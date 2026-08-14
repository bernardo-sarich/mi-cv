# api

Azure Functions isolated worker (.NET 9) backing `mi-cv`, organized as Clean/Hexagonal Architecture: `Api` (Functions, thin) → `Application` (use cases) → `Domain` (entities + ports) → `Infrastructure` (EF Core, implements the ports). A fifth project, `Seed`, is a standalone console tool that populates the database from `client/src/data/cv-data.json`.

## Local setup

1. Copy the example settings file and fill in a real local connection string:

   ```bash
   cp Api/local.settings.json.example Api/local.settings.json
   ```

   Edit `Api/local.settings.json` and set `ConnectionStrings:CvDatabase` to a database you control (a local SQL Server / SQL Server Express / Docker instance, or your own Azure SQL Database free-tier instance). This file is gitignored — it never gets committed, and no secret value should ever be added to `local.settings.json.example`.

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

## Other local.settings.json keys

`local.settings.json.example` only lists the keys every environment needs (`AzureWebJobsStorage`, `FUNCTIONS_WORKER_RUNTIME`, `ConnectionStrings:CvDatabase`). Two more sections have code-level defaults and only need overriding if you want non-default behavior locally:

- `Cors:AllowedOrigins` (comma-separated string, see `Api/Cors/CorsOptions.cs`)
- `ContactRateLimit:MaxAttempts` / `ContactRateLimit:Window` (see `Application/RateLimitOptions.cs`)

If `Program.cs` or these options classes grow new required settings, update `local.settings.json.example` to match.
