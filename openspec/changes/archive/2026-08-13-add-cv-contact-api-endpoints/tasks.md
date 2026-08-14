## 1. Application use cases

- [x] 1.1 Add `Application/Errors/ValidationException.cs`: carries a `IDictionary<string, string[]>` of field errors.
- [x] 1.2 Add `Application/UseCases/GetCvUseCase.cs`: `ExecuteAsync(Language language, CancellationToken ct)` delegating to `ICvRepository.GetCvAsync`.
- [x] 1.3 Add `Application/UseCases/SubmitContactUseCase.cs`: validates `name`/`email`/`message` are non-blank and `email` is a syntactically valid address (throw `ValidationException` with per-field messages otherwise), builds a `ContactMessage` with `SubmittedAt = DateTimeOffset.UtcNow`, calls `IContactRepository.SaveAsync`.
- [x] 1.4 Register both use cases in `Application/ServiceCollectionExtensions.cs`.

## 2. Api error handling and CORS helpers

- [x] 2.1 Add `Api/Errors/ProblemDetailsResult.cs` with `ValidationProblem(IDictionary<string,string[]> errors)` and `InternalProblem(ILogger, Exception)`, both returning `ObjectResult` with `application/problem+json` and status 400/500 respectively per design.md's Error handling mechanism decision.
- [x] 2.2 Add `Api/Cors/CorsOptions.cs` (or equivalent) reading `Cors:AllowedOrigins` from configuration (comma-separated), defaulting to `https://icy-river-0fd990410.azurestaticapps.net,http://localhost:5173` when unset.
- [x] 2.3 Add a CORS helper that, given the incoming `Origin` header and the configured allow-list, returns the headers to apply (`Access-Control-Allow-Origin` when matched, plus `Access-Control-Allow-Methods`/`Access-Control-Allow-Headers` for preflight) — used by both Functions on every response, including `OPTIONS` preflight requests per design.md's CORS risk note.
- [x] 2.4 Register `CorsOptions` binding in `Program.cs`.

## 3. HTTP Functions

- [x] 3.1 Delete `Api/ProfileFunction.cs`.
- [x] 3.2 Add `Api/CvFunction.cs`: `GET /api/cv` (and `OPTIONS /api/cv` for preflight), parses `lang` leniently (`es`/`en` case-insensitive, anything else defaults to `Language.Es`), calls `GetCvUseCase`, maps `CvContent` to the mock-compatible response DTO (camelCase JSON, `Project.Description` → `desc`), applies CORS headers, wraps body in try/catch → `ProblemDetailsResult.InternalProblem` on unexpected failure.
- [x] 3.3 Add `Api/ContactFunction.cs`: `POST /api/contact` (and `OPTIONS /api/contact` for preflight), deserializes JSON body, calls `SubmitContactUseCase`, returns `201 Created` on success, applies CORS headers, catches `ValidationException` → `ProblemDetailsResult.ValidationProblem`, catches `Exception` → `ProblemDetailsResult.InternalProblem`.
- [x] 3.4 Add the response DTO types (`CvResponseDto`, nested `ProfileDto`/`ExperienceDto`/`ProjectDto`/`SkillCategoryDto`/`StatDto`) matching the mock JSON's lowercase key shape described in design.md.

## 4. Client integration

- [x] 4.1 Update `client/src/lib/api.js`'s `getCVData(lang)` to `fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/cv?lang=${lang}`)`, parse JSON on an ok response, and on any thrown error or non-ok response fall back to returning `cvData[lang]` from the existing local import.
- [x] 4.2 Verify `client/src/hooks/useCVData.js` needs no changes (it already awaits `getCVData` reactively per `lang`).

## 5. Verification

- [x] 5.1 `dotnet build` from `api/` succeeds.
- [ ] 5.2 Manually sanity-check `GET /api/cv?lang=en`, `GET /api/cv` (no param), `GET /api/cv?lang=xx`, `POST /api/contact` (valid and invalid bodies) via `func start` or `swa start`, confirming status codes and `application/problem+json` error shapes match specs/cv-api/spec.md.
- [x] 5.3 `npm run lint` from `client/` succeeds.
- [x] 5.4 `npm run build` from `client/` succeeds.
