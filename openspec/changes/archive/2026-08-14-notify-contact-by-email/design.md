## Context

See proposal.md - Why. `SubmitContactUseCase` (`api/Application/UseCases/SubmitContactUseCase.cs`) already validates, rate-limits, persists via `IContactRepository`, and records the attempt via `IContactAttemptStore`. Both are ports implemented in `Infrastructure` and registered in `Infrastructure/ServiceCollectionExtensions.cs`; options (e.g. `RateLimitOptions`) are bound in `Api/Program.cs` from `IConfiguration`, sourced from `local.settings.json` locally and Function App application settings (`Section__Key` env vars) when deployed — see `api/README.md`.

## Goals / Non-Goals

**Goals:**
- Send a best-effort email to `bernardo.sarich@gmail.com` after a contact message is persisted.
- Keep the notification failure isolated: it must never affect the HTTP response or the persisted data.
- Keep secrets (the Gmail App Password) out of the repo, following the existing connection-string convention.

**Non-Goals:**
- Retry/queueing for failed notification sends (a single best-effort attempt is enough for this traffic volume).
- Templated/HTML email bodies — plain text is sufficient.
- Notifying about anything other than a newly persisted contact message.

## Decisions

- **New port `IContactNotifier`** in `Application/Ports`, with one method `Task NotifyAsync(ContactMessage message, CancellationToken cancellationToken = default)`. Mirrors the existing `IContactRepository` / `IContactAttemptStore` port style, keeping `Application` free of any SMTP/MailKit reference.
- **Adapter `SmtpContactNotifier`** in `Infrastructure/Email`, implementing `IContactNotifier` with `MailKit.Net.Smtp.SmtpClient`, connecting to `smtp.gmail.com:587` with STARTTLS and authenticating with the configured Gmail account + App Password. MailKit is chosen over the built-in `System.Net.Mail.SmtpClient` because the latter is in maintenance mode and MailKit is the community-standard replacement with better TLS/auth support.
- **New options class `EmailNotificationOptions`** (`Application/EmailNotificationOptions.cs`, section `EmailNotification`), holding `SmtpHost`, `SmtpPort`, `FromAddress`, `ToAddress`, `Username` — all non-secret and safe to default/document. The App Password is read directly from `IConfiguration["EmailNotification:AppPassword"]` inside the adapter (not modeled as an options property) so a missing/empty value is simple to detect and treat as "notifications disabled" rather than crashing DI at startup.
- **Failure isolation happens in the use case, not the adapter.** `SubmitContactUseCase.ExecuteAsync` wraps the `contactNotifier.NotifyAsync(...)` call in a try/catch that only logs (via `ILogger<SubmitContactUseCase>`, injected alongside the existing dependencies) and swallows the exception. This keeps the adapter free to let real exceptions surface (simpler adapter code, easier to unit-test the use case's swallowing behavior) while guaranteeing the boundary the spec requires.
- **Missing configuration disables notification rather than failing.** If `AppPassword`, `FromAddress`, or `ToAddress` is unset, `SmtpContactNotifier.NotifyAsync` logs a warning and returns without attempting to connect. This means the feature degrades gracefully in any environment where the App Password hasn't been provisioned yet (e.g. a fresh local dev setup that only cares about the DB), matching how `local.settings.json.example` documents optional sections today.

## Risks / Trade-offs

- [Gmail SMTP rate/anti-abuse limits] → Traffic volume for a personal portfolio's contact form is far below Gmail's sending limits; no mitigation needed beyond noting it in the README.
- [App Password revoked or Gmail account 2FA/security settings change] → Notification silently stops working (logged warning/error each time, visitor experience unaffected); the persisted `ContactMessage` row remains the source of truth, so no message is ever lost, only the notification.
- [Adding a network call inside the request path adds latency to `POST /api/contact`] → Send happens after the response-critical persistence steps but before returning; a slow/unreachable SMTP server could delay the `201` response. Mitigated by MailKit's default connect/send timeouts bounding the worst case; not worth the added complexity of fire-and-forget background dispatch for this traffic volume.

## Migration Plan

1. Add the `MailKit` package reference to `Infrastructure.csproj`.
2. Implement `IContactNotifier` / `SmtpContactNotifier` / `EmailNotificationOptions`, wire DI in `Infrastructure/ServiceCollectionExtensions.cs` and options binding in `Api/Program.cs`.
3. Update `SubmitContactUseCase` to call the notifier with try/catch-and-log.
4. Document the new config keys in `api/README.md` and `api/Api/local.settings.json.example` (non-secret keys only).
5. Locally: generate a Gmail App Password for `bernardo.sarich@gmail.com`, add it to local `local.settings.json` (gitignored), verify a submission triggers an email.
6. Deployed: set the equivalent `EmailNotification__*` application settings (including `EmailNotification__AppPassword`) on the Function App via the Azure Portal — same mechanism already used for `ConnectionStrings__CvDatabase`.

No rollback complexity: if the feature misbehaves, unset/blank the `AppPassword` setting to disable sending without touching code, or revert the deploy — the contact form's persistence behavior is unaffected either way.
