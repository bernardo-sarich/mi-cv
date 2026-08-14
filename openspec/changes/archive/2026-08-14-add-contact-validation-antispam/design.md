## Context

`SubmitContactUseCase` (`api/Application/UseCases/SubmitContactUseCase.cs`) currently validates only non-blank fields and email format, then calls `IContactRepository.SaveAsync`. `ContactFunction` (`api/Api/ContactFunction.cs`) is a thin Function that deserializes the body, invokes the use case, and maps `ValidationException` → `400` via `ProblemDetailsResult`. The previous change (`archive/2026-08-13-add-cv-contact-api-endpoints`) explicitly deferred rate limiting. See `proposal.md` for why this change brings it back.

The `Api` project runs on the Azure Functions **Consumption plan**: it scales out to multiple concurrent instances and each instance can be recycled at any time, so in-process state (a static `Dictionary`, `MemoryCache`, etc.) does not give a correct or durable count of attempts per IP across instances. Consumption plan has no built-in per-endpoint request throttling that could be configured declaratively here (that class of feature belongs to Azure API Management, which is out of scope for this repo).

The `Infrastructure` project already has an EF Core `DbContext` (`CvDbContext`) over Azure SQL (free/serverless tier) with an existing migration (`Infrastructure/Migrations/20260813225829_InitialCreate.cs`), so persisting rate-limit state in the same database is the lowest-friction option that's actually consistent across instances.

## Goals / Non-Goals

**Goals:**
- Bound the size of `name`/`email`/`message` so the endpoint can't be used to store arbitrarily large junk.
- Reject the class of bot traffic that blindly fills every form field (honeypot).
- Reject bursts of automated submissions from a single IP (rate limiting), correctly across multiple Function instances.
- Write down, in this file, why honeypot + DB-backed rate limiting were chosen over CAPTCHA.

**Non-Goals:**
- Blocking sophisticated bots that skip hidden fields and rotate IPs — that class of abuse needs CAPTCHA or a managed WAF/Bot service, which this change deliberately does not add (see Decisions).
- Wiring the honeypot field into the actual client contact form's DOM — out of scope per `proposal.md`; the form simply never sends the field, so the honeypot never triggers for legitimate users.
- Rate limiting or abuse protection on `GET /api/cv` (read-only, no persistence, not in scope).

## Decisions

### Anti-spam approach: honeypot + DB-backed rate limiting, not CAPTCHA
Three options were considered for this low-volume, public contact form:

- **CAPTCHA** (e.g. hCaptcha/reCAPTCHA/Turnstile): strong bot resistance, but requires a third-party account, API keys, an external script loaded in `client/`, and adds friction/latency to every legitimate submit. For a personal CV site's contact form, that cost is disproportionate to the risk being mitigated.
- **Honeypot field**: near-zero cost (one extra optional field, no external dependency, no UX friction for humans since it's never rendered), but only stops unsophisticated bots that fill every input blindly. It is trivially bypassed by a bot that inspects the DOM/CSS before submitting.
- **Rate limiting per IP**: doesn't stop a single well-behaved bot submission, but bounds the damage of repeated/automated bursts from one source, and is useful defense-in-depth regardless of how the request was crafted.

Decision: combine **honeypot + rate limiting**. Together they cover the realistic threat model for this site (opportunistic scripted spam, not a targeted attacker) without adding a third-party dependency or degrading UX for real visitors. CAPTCHA is rejected for now; if abuse patterns in production show sophisticated bots bypassing both, CAPTCHA can be added later as a follow-up change — the honeypot field and rate-limit check are additive and don't need to be removed to add it.

### Honeypot field: silent 201, not a 400
When the honeypot field is filled, the Function responds `201 Created` without persisting, rather than `400 Bad Request`. Returning an error would let a bot detect and adapt (e.g. retry without the field). Returning the same success response as a real submission gives the bot no signal, at the cost of the use case having a "pretend success" branch — judged an acceptable trade for not tipping off scripted submitters.

### Rate limiting: new DB table behind an Application port, not in-memory
Alternatives considered:
- **In-memory counter** (e.g. `IMemoryCache`): rejected — Consumption plan instances don't share memory, and instances recycle, so counts would be inconsistent and resettable by the very bursts being defended against.
- **Azure API Management / Front Door rate limiting**: real per-IP throttling exists at that layer, but neither is currently provisioned for this repo (`openspec/specs/deployment-config`); adding one is significant new infra scope, not a `SubmitContactUseCase` validation change.
- **DB-backed attempt tracking** (chosen): a new `ContactAttempt` entity (`IpAddress`, `AttemptedAt`) persisted via EF Core in the same `CvDbContext`/database already used for `ContactMessage`. `SubmitContactUseCase` asks a new port (`IContactAttemptStore`, in `Application/Ports`) how many attempts a given IP has made within the configured window before proceeding; `Infrastructure` implements it with an EF Core query + insert. This adds one extra DB round trip per submission, which is acceptable given the endpoint's expected volume (a personal site's contact form, not a high-throughput API).

The rate-limit window and max-attempts values are read from configuration (`local.settings.json` / Azure Function app settings), following the existing pattern used for CORS (`CorsOptions` bound from configuration in `Program.cs`), rather than being hardcoded — this makes the limit tunable without a code change if production traffic patterns differ from expectations. Suggested defaults: 5 attempts per IP per 15-minute window; final defaults are set in `tasks.md`/config and can be tuned post-deploy without a spec change.

### Client IP extraction
`ContactFunction` reads the client IP the same way ASP.NET Core normally does for a request behind Azure Functions' front end: `HttpContext.Connection.RemoteIpAddress`, falling back to the `X-Forwarded-For` header's first value if present (Azure's edge sets this). This stays entirely inside `Api` — `Application`/`Domain` only ever see a plain `string` IP, no HTTP-specific types.

### Error propagation: new exception type, not reusing ValidationException
Rate-limit rejection is modeled as a new `Application.Errors.RateLimitExceededException` (parallel to the existing `ValidationException`), rather than overloading `ValidationException`, because it maps to a different HTTP status (`429`, not `400`) and isn't a per-field validation error — `ContactFunction` catches it and returns a new `ProblemDetailsResult.RateLimitProblem()` helper (`429`, `application/problem+json`), following the same pattern as the existing `ValidationProblem`/`InternalProblem` helpers.

## Risks / Trade-offs

- [Extra DB round trip per submission for the rate-limit check] → Acceptable at this endpoint's expected volume; if it ever becomes a bottleneck, the check can be optimized (e.g. a single indexed query) without changing the port's contract.
- [Rate-limit table grows unboundedly over time] → Out of scope to add cleanup in this change (endpoint volume is low), but note it here: a future change can add a scheduled cleanup or a TTL-style delete of attempts older than the window.
- [Shared/NAT'd IPs (e.g. an office network) can hit the rate limit from legitimate concurrent users] → Accepted trade-off for a personal contact form; defaults are chosen generously (5 per 15 minutes) to make this unlikely in practice.
- [Honeypot is bypassable by a bot that parses the DOM] → Acknowledged non-goal; rate limiting is the backstop for that case.

## Migration Plan

New EF Core migration adds the `ContactAttempts` table; no changes to existing tables. No data migration needed — the table starts empty and rate limiting is effectively "off" (nothing has hit the limit) until attempts accumulate. Deploying is additive and has no rollback complexity beyond reverting the migration if needed.
