## Why

When a visitor submits the contact form, the message is persisted to the database but nothing tells the site owner it arrived — he has to remember to check the `ContactMessage` table. An email notification to his personal inbox closes that loop.

## What Changes

- After `SubmitContactUseCase` persists a valid, non-rate-limited contact submission (`contactRepository.SaveAsync` + `contactAttemptStore.RecordAsync`), send an email notification to `bernardo.sarich@gmail.com` containing the visitor's name, email, and message.
- Add a new Application port `IContactNotifier` with a single `NotifyAsync(ContactMessage message, CancellationToken)` method.
- Add an Infrastructure adapter `SmtpContactNotifier` implementing `IContactNotifier` via SMTP, using the `MailKit` package, authenticating to Gmail's SMTP server with an account and an App Password.
- Add a new options class `EmailNotificationOptions` (section `EmailNotification`) holding the non-secret SMTP/sender configuration (host, port, from address, to address, username); the App Password is read from configuration but never given a default and never committed — supplied via `local.settings.json` locally and `EmailNotification__AppPassword`-style app settings in deployed environments, following the same convention as the DB connection string.
- Sending the notification is best-effort: if it throws (SMTP error, timeout, misconfiguration), the error is logged and swallowed inside `SubmitContactUseCase`, and the visitor still gets `201 Created`. A failed notification email SHALL NOT roll back the persisted contact message or attempt count, and SHALL NOT surface as an error to the HTTP client.
- Update `api/README.md` and `api/Api/local.settings.json.example` with the new non-secret configuration keys (host/port/from/to/username), documenting that the App Password itself must never go in `local.settings.json.example`.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `cv-api`: `POST /api/contact` gains a side effect on successful submission — an email notification is sent to the site owner; failure to send does not change the endpoint's response.

## Impact

- `api/Application/Ports/IContactNotifier.cs` — new port.
- `api/Application/UseCases/SubmitContactUseCase.cs` — calls the notifier after persistence, swallowing/logging failures.
- `api/Infrastructure/Email/SmtpContactNotifier.cs` — new MailKit-based adapter.
- `api/Application/EmailNotificationOptions.cs` — new options class.
- `api/Infrastructure/ServiceCollectionExtensions.cs`, `api/Api/Program.cs` — DI registration and options binding.
- `api/Infrastructure/Infrastructure.csproj` — new `MailKit` package reference.
- `api/Api/local.settings.json.example`, `api/README.md` — new configuration keys documented.
- No client-side changes; no changes to the `POST /api/contact` request/response contract.
