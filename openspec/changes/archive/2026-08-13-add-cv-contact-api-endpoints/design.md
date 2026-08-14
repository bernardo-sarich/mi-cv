## Context

`Api` targets `net9.0`, isolated worker model, Functions v4 (`FunctionsApplication.CreateBuilder`), and already registers `AddApplication()` + `AddInfrastructure()` in `Program.cs`. `Application` currently has no use cases, only `ICvRepository`/`IContactRepository` ports and an empty `AddApplication()`. `Infrastructure` already implements both ports against `CvDbContext` (SQL Server). The client's `getCVData(lang)` in `client/src/lib/api.js` is a synchronous-shaped async stub reading the bundled mock JSON; `useCVData.js` already calls it reactively per `lang` change and needs no changes. See proposal.md - Why/What Changes for full motivation and scope.

The SWA production domain isn't recorded anywhere in the repo as plain text (the workflow only references a GitHub secret for the deploy token); the resource name `icy-river-0fd990410` implies the default hostname `https://icy-river-0fd990410.azurestaticapps.net`, which is the value used below as the default allowed origin. A custom domain, if one exists, isn't visible to this change.

## Goals / Non-Goals

**Goals:**
- Thin Functions that only deserialize/map; all logic lives in Application use cases.
- One consistent error-response mechanism reused by both Functions, not duplicated try/catch bodies with copy-pasted ProblemDetails construction.
- CORS origin list configurable per environment (app setting), not hardcoded to a single string in code.

**Non-Goals:**
- Wiring the client contact form to `POST /api/contact` (out of scope per proposal.md; the form is currently a client-only demo per `contact-section` spec).
- Any authentication/authorization on the endpoints.
- Rate limiting or abuse protection on `POST /api/contact`.
- Automated tests (no test runner configured in this repo, per CLAUDE.md).

## Decisions

**Use case shape**: `GetCvUseCase` is a thin pass-through (`Task<CvContent> ExecuteAsync(Language language, CancellationToken ct)`) — its only value-add over calling `ICvRepository` directly is being the seam the Function depends on, keeping the Function free of `Infrastructure`/`Domain` wiring concerns and matching the Clean Architecture layering CLAUDE.md describes. `SubmitContactUseCase` does real work: validates input and throws a `ValidationException` (a small custom type in `Application`, not System.ComponentModel's) carrying field-level error info on failure, or builds a `ContactMessage` with `SubmittedAt = DateTimeOffset.UtcNow` and calls `IContactRepository.SaveAsync` on success. Rejected alternative: pushing validation into the Function — violates "Functions delgadas, sin lógica de negocio" from the request and from CLAUDE.md's Clean Architecture description.

**Language parsing**: `GET /api/cv` parses `lang` leniently — `"es"`/`"en"` (case-insensitive) map to the enum, anything else (missing, empty, unrecognized) defaults to `Language.Es`. Rejected alternative: 400 on invalid `lang` — rejected because a CV page is a low-stakes public read; defaulting is friendlier and matches how the client already behaves (`lang` always comes from a fixed toggle, so malformed values only happen from direct/malicious URL access, not real usage).

**Error handling mechanism**: a small static helper (`Api/Errors/ProblemDetailsResult.cs`) with `ValidationProblem(IDictionary<string,string[]> errors)` and `InternalProblem(ILogger, Exception)` methods, each returning an `ObjectResult` with `application/problem+json` content type and a `ProblemDetails`/`ValidationProblemDetails` body. Each Function wraps its body in try/catch: catches `ValidationException` → `ValidationProblem`, catches `Exception` → logs full exception via `ILogger` then `InternalProblem` (generic detail, no exception text). Rejected alternative: a global exception-handling middleware via `IFunctionsWorkerMiddleware` — more idiomatic for isolated-worker Functions and would avoid repeating try/catch per Function, but with only two Functions the middleware's indirection and registration cost isn't worth it yet; revisit if a third endpoint is added. This is a deliberate scope-sized choice, not a correctness requirement, so it doesn't change the spec.

**CORS**: configured in `Api/Program.cs` by reading a `Cors:AllowedOrigins` configuration value (comma-separated), defaulting to `https://icy-river-0fd990410.azurestaticapps.net,http://localhost:5173` when unset, and applied via `HttpResponseData` headers set from a small helper invoked at the top of each Function (isolated-worker Functions don't have ASP.NET Core's `UseCors` pipeline available the same way in the HTTP-trigger-as-IActionResult model this repo uses). Concretely: read the `Origin` request header, and if it's in the configured allow-list, echo it back as `Access-Control-Allow-Origin` on the response; otherwise omit the header. `local.settings.json` (gitignored) can override `Cors:AllowedOrigins` for local dev; `host.json`/app settings in Azure carry the production value if it ever needs to change without a code deploy.

**Response DTO shape**: `Api` maps `CvContent` to an anonymous-shaped/record DTO matching the client mock's lowercase keys (`name`, `title`, `bio`, `stats: [{value, suffix, label}]`, `experience: [{company, role, dates, bullets}]`, `skills: [{name, items}]`, `projects: [{name, desc, stack, link}]`) via `System.Text.Json` with camelCase property naming, so the client's section components (which already consume this exact shape from the mock) need no changes beyond `lib/api.js` itself. `Project.Description` maps to JSON key `desc` (not `description`) to match the mock — done via `[JsonPropertyName("desc")]` on the DTO.

**Client fallback**: `getCVData(lang)` becomes `async` (it already was declared `async` but never awaited anything): `fetch` the API, and on any thrown error or non-ok response, catch and return the local mock's `cvData[lang]` — same behavior `useCVData.js` already expects (a resolved promise either way), so the hook needs no change.

## Risks / Trade-offs

[CORS default origin is a guess based on the resource name, not a confirmed value] → low risk: it's overridable via configuration without a code change, and the guess is directly derived from the SWA resource name visible in the deploy workflow; flagged here for the user to confirm/correct post-deploy if wrong.

[Per-Function try/catch duplicates the same three lines twice instead of a shared middleware] → acceptable at 2 endpoints; revisit with a real middleware if a third HTTP-triggered Function is added later.

[Echoing a single matched Origin header instead of a full ASP.NET Core CORS policy misses preflight (`OPTIONS`) handling nuances] → both endpoints are simple `GET`/`POST` with JSON bodies; `POST /api/contact` with `Content-Type: application/json` triggers a CORS preflight from browsers, so the CORS helper must also respond to `OPTIONS` requests with the allow-origin/allow-methods/allow-headers headers and a 204, not only decorate the main response — call this out explicitly in tasks.md.
