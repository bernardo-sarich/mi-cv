## 1. Project scaffolding

- [x] 1.1 Create `api/Seed/Seed.csproj` (net9.0, `Nullable`/`ImplicitUsings` enabled) referencing `Domain` and `Infrastructure`
- [x] 1.2 Add `api/Seed` to `api/api.slnx`
- [x] 1.3 Add a package reference for JSON config binding (`Microsoft.Extensions.Configuration.Json`) needed to read `local.settings.json`

## 2. Configuration loading

- [x] 2.1 In `api/Seed/Program.cs`, build an `IConfiguration` from `api/Api/local.settings.json` (`Values` section, Functions' JSON shape) plus environment variable overrides
- [x] 2.2 Fail fast with a clear error message and non-zero exit code if `ConnectionStrings:CvDatabase` (or the `Values:ConnectionStrings__CvDatabase` equivalent) is missing, without attempting a database connection

## 3. JSON parsing

- [x] 3.1 Add a model (or reuse `System.Text.Json` dynamic parsing) to read `client/src/data/cv-data.json` into per-locale objects matching its `name/title/bio/stats/experience/skills/projects` shape (ignore `contact`)
- [x] 3.2 Resolve the JSON file path relative to the repo root so the tool works when run via `dotnet run --project api/Seed` from either the repo root or `api/`

## 4. Seeding logic

- [x] 4.1 Map each parsed locale directly to `Infrastructure` EF entities (`ProfileEntity`, `StatEntity`, `ExperienceEntity`, `ProjectEntity`, `SkillCategoryEntity`), setting `Language` from the JSON's locale key (`es`/`en`) — see note below
- [x] 4.2 For each locale, inside one `CvDbContext` transaction: delete existing `Profile` (cascades to `Stat`), `Experience`, `Project`, and `SkillCategory` rows for that `Language`, then insert the freshly mapped rows, then commit
- [x] 4.3 Log a summary per locale (rows written per entity type) to the console on success

## 5. Documentation

- [x] 5.1 Create `api/Api/local.settings.json.example` documenting the required keys (`ConnectionStrings:CvDatabase`, `AzureWebJobsStorage`, `FUNCTIONS_WORKER_RUNTIME`, and any existing `CorsOptions`/`RateLimitOptions` keys already read by `Program.cs`), with placeholder (non-secret) values
- [x] 5.2 Create `api/README.md` covering: local setup (copy `local.settings.json.example` to `local.settings.json`, fill in a real local connection string), how to run the seed (`dotnet run --project api/Seed`), that the seed is destructive per-locale (delete+reinsert) and should target a local/dev database, and how the connection string secret is provided in deployed environments (Azure Function App Settings key `ConnectionStrings__CvDatabase`, and the GitHub Actions secret convention to use once a CI/CD workflow exists)

## 6. Verification

- [x] 6.1 Run `dotnet build` from `api/` and confirm all five projects (including `Seed`) build cleanly
- [x] 6.2 Manually run the seed twice in a row and confirm row counts are identical after each run — run against the real Azure SQL database (`mi-cv-db`) instead of a local instance; both runs produced identical counts per locale (Profile: 1, Stats: 1, Experience: 3, Projects: 2, SkillCategories: 5)
