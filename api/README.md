# api

Azure Functions isolated worker (.NET 9) backing `mi-cv`, organized as Clean/Hexagonal Architecture: `Api` (Functions, thin) → `Application` (use cases) → `Domain` (entities + ports) → `Infrastructure` (EF Core, implements the ports). A fifth project, `Seed`, is a standalone console tool that populates the database from `client/src/data/cv-data.json`.

## Local setup

1. Copy the example settings file and fill in a real local connection string:

   ```bash
   cp Api/local.settings.json.example Api/local.settings.json
   ```

   Edit `Api/local.settings.json` and set `ConnectionStrings:CvDatabase` to a database you control (a local Postgres / Docker instance, or your own Neon free-tier project). This file is gitignored — it never gets committed, and no secret value should ever be added to `local.settings.json.example`.

2. Apply the EF Core migrations to create the schema:

   ```bash
   dotnet ef database update --project Infrastructure --startup-project Infrastructure
   ```

3. Run the seed tool to populate the tables from `client/src/data/cv-data.json`:

   ```bash
   dotnet run --project Seed
   ```

   The seed reads the same `ConnectionStrings:CvDatabase` setting as the Api (from `Api/local.settings.json`, or from a `ConnectionStrings__CvDatabase` environment variable, which takes precedence). It is **destructive per locale**: each run deletes and re-inserts every `Profile`, `Stat`, `Experience`, `Project`, and `SkillCategory` row for the locales present in `cv-data.json`, so point it at a local/dev database, not a shared or production one. It's safe to re-run any time `cv-data.json` changes or to bring a fresh database up to date — running it twice in a row with unchanged data leaves the same rows in place. It does not migrate the `contact` (github/linkedin/email) block; those links have no table and stay hardcoded in the client.

4. Run the Api:

   ```bash
   dotnet run --project Api
   ```

   or use the Static Web Apps CLI from the repo root (`swa start mi-cv`) to run client + api together.

## Connection string in deployed environments

The connection string is never stored in the repo. It's supplied per environment via configuration, read at `ConnectionStrings:CvDatabase`:

- **Deployed Function App**: set it in the Function App's **Application settings** (Azure Portal → Function App → Configuration), as a setting named `ConnectionStrings__CvDatabase` (the `__` double-underscore is how App Settings encode the `:` section separator that `IConfiguration` expects). Mark it as a slot setting / use Key Vault references if the deployment has multiple slots or stricter secret handling.
- **CI/CD**: no GitHub Actions workflow exists yet in this repo. When one is added, store the connection string as a **GitHub Actions secret** (repo or environment-scoped) and inject it into the deployment step's environment as `ConnectionStrings__CvDatabase` (or pass it to whatever step configures the Function App's application settings) — never write it into a workflow file or commit it.

## Serverless cold start

The database is a Neon Postgres serverless project, which auto-suspends after a period of inactivity and resumes on the next connection — typically in well under a second. `Infrastructure/ServiceCollectionExtensions.cs` configures `UseNpgsql(..., npgsql => npgsql.EnableRetryOnFailure())`, Npgsql's standard bounded retry for transient connection errors, so a request that lands right as the database is resuming doesn't fail on the first attempt. There's no custom retry strategy or extended connect timeout — Neon's resume is fast enough that the provider's defaults are sufficient (this is a deliberate contrast with Azure SQL serverless, which this project used previously and whose ~45s auto-resume needed a much longer custom retry window).

When connecting to Neon from a deployed environment (as opposed to local development), use the **pooled** connection endpoint (the host with a `-pooler` suffix in the Neon dashboard) rather than the direct host — Azure Functions Consumption plan instances can open many short-lived connections, and Neon's built-in PgBouncer pooler handles that better than direct connections.

## Other local.settings.json keys

`local.settings.json.example` only lists the keys every environment needs (`AzureWebJobsStorage`, `FUNCTIONS_WORKER_RUNTIME`, `ConnectionStrings:CvDatabase`). Two more sections have code-level defaults and only need overriding if you want non-default behavior locally:

- `Cors:AllowedOrigins` (comma-separated string, see `Api/Cors/CorsOptions.cs`)
- `ContactRateLimit:MaxAttempts` / `ContactRateLimit:Window` (see `Application/RateLimitOptions.cs`)

If `Program.cs` or these options classes grow new required settings, update `local.settings.json.example` to match.

## Contact notification email

When a visitor submits the contact form, after the message is persisted the Api attempts to send a notification email (see `Application/UseCases/SubmitContactUseCase.cs`, `Infrastructure/Email/SmtpContactNotifier.cs`). This is best-effort: if it fails, the failure is only logged — the visitor still gets `201 Created` and the message is still saved.

Sending is done over SMTP via Gmail, using the `MailKit` package. Configuration lives under the `EmailNotification` section:

- `EmailNotification:SmtpHost` / `EmailNotification:SmtpPort` — default to `smtp.gmail.com` / `587`, no need to override for Gmail.
- `EmailNotification:FromAddress` / `EmailNotification:ToAddress` / `EmailNotification:Username` — non-secret, see `local.settings.json.example`.
- `EmailNotification:AppPassword` — **secret, never committed and not present in `local.settings.json.example`.** Generate it from the sending Gmail account's security settings (requires 2-Step Verification enabled: Google Account → Security → 2-Step Verification → App passwords), then set it:
  - **Local**: add it to your own gitignored `Api/local.settings.json` under `EmailNotification:AppPassword`.
  - **Deployed Function App**: set it as an application setting named `EmailNotification__AppPassword`, the same `__`-for-`:` convention used for `ConnectionStrings__CvDatabase`.

If `AppPassword`, `FromAddress`, or `ToAddress` is missing, the notifier logs a warning and skips sending instead of throwing — a fresh local setup that only cares about the database works without it.
