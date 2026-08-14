## 1. Domain & configuration

- [x] 1.1 Add `ContactAttempt` entity to `Domain` (`IpAddress`, `AttemptedAt`).
- [x] 1.2 Add `RateLimitOptions` (max attempts, window duration) bound from configuration in `Api/Program.cs`, following the existing `CorsOptions` pattern; set sensible defaults (5 attempts / 15 minutes) in `local.settings.json` / documented app settings.

## 2. Application layer

- [x] 2.1 Add `IContactAttemptStore` port to `Application/Ports` with methods to count recent attempts for an IP within a window and to record a new attempt.
- [x] 2.2 Add `RateLimitExceededException` to `Application/Errors`.
- [x] 2.3 Extend `SubmitContactRequest` with an optional honeypot field (e.g. `Website`) and a `ClientIp` (or accept IP as a separate use-case parameter — decide based on what keeps `Application` free of HTTP concerns).
- [x] 2.4 Update `SubmitContactUseCase.ExecuteAsync`: if the honeypot field is non-blank, return without persisting (treat as success). Otherwise, add length validation (`name` ≤ 200, `email` ≤ 320, `message` between 10 and 5000) to the existing validation block. Before persisting, check `IContactAttemptStore` for the request's IP against `RateLimitOptions`; if exceeded, throw `RateLimitExceededException`. On successful persistence, record the attempt via `IContactAttemptStore`.

## 3. Infrastructure

- [x] 3.1 Add `ContactAttemptEntity` + EF Core mapping in `CvDbContext.OnModelCreating`.
- [x] 3.2 Implement `EfContactAttemptStore : IContactAttemptStore` in `Infrastructure/Persistence`, querying attempts within the configured window for an IP and inserting new attempt rows.
- [x] 3.3 Register `IContactAttemptStore` in `Infrastructure/ServiceCollectionExtensions.AddInfrastructure`.
- [x] 3.4 Add an EF Core migration for the new `ContactAttempts` table.

## 4. Api layer

- [x] 4.1 Add `ProblemDetailsResult.RateLimitProblem()` (`429`, `application/problem+json`) alongside the existing `ValidationProblem`/`InternalProblem` helpers.
- [x] 4.2 Update `ContactFunction.Run` to extract the client IP (`HttpContext.Connection.RemoteIpAddress`, falling back to `X-Forwarded-For`), pass it into the use case call, and catch `RateLimitExceededException` → `ProblemDetailsResult.RateLimitProblem()`.

## 5. Verification

- [x] 5.1 `dotnet build` the `api` solution and confirm it compiles cleanly.
- [ ] 5.2 Manually exercise `POST /api/contact` (e.g. via `swa start` or a direct Functions host run) for: a valid submission, an oversized field, a too-short message, a filled honeypot, and repeated submissions past the rate limit — confirm `201`/`400`/`429` respectively. **Not run**: requires a live SQL Server (Docker Desktop daemon is not running in this environment) — left for the user to run locally.
