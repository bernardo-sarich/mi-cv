## 1. Port and options

- [x] 1.1 Add `IContactNotifier` port in `api/Application/Ports/IContactNotifier.cs` with `Task NotifyAsync(ContactMessage message, CancellationToken cancellationToken = default)`.
- [x] 1.2 Add `EmailNotificationOptions` in `api/Application/EmailNotificationOptions.cs` (section `EmailNotification`) with `SmtpHost`, `SmtpPort`, `FromAddress`, `ToAddress`, `Username` properties and sensible Gmail SMTP defaults (`smtp.gmail.com`, `587`).

## 2. SMTP adapter

- [x] 2.1 Add the `MailKit` package reference to `api/Infrastructure/Infrastructure.csproj`.
- [x] 2.2 Implement `SmtpContactNotifier` in `api/Infrastructure/Email/SmtpContactNotifier.cs`: reads `EmailNotificationOptions` and the `EmailNotification:AppPassword` config value directly; if the App Password, `FromAddress`, or `ToAddress` is missing/blank, logs a warning and returns without connecting; otherwise builds a plain-text `MimeMessage` (subject includes the visitor's name, body includes name/email/message) and sends it via `MailKit.Net.Smtp.SmtpClient` over STARTTLS.

## 3. Wiring

- [x] 3.1 Register `IContactNotifier` → `SmtpContactNotifier` in `api/Infrastructure/ServiceCollectionExtensions.cs`.
- [x] 3.2 Bind `EmailNotificationOptions` in `api/Api/Program.cs` the same way `RateLimitOptions` is bound.

## 4. Use case integration

- [x] 4.1 Inject `IContactNotifier` and `ILogger<SubmitContactUseCase>` into `SubmitContactUseCase`.
- [x] 4.2 After `contactRepository.SaveAsync` and `contactAttemptStore.RecordAsync` succeed, call `contactNotifier.NotifyAsync(message, cancellationToken)` inside a try/catch that logs any exception and does not rethrow.

## 5. Configuration and docs

- [x] 5.1 Add the non-secret `EmailNotification` keys (`SmtpHost`, `SmtpPort`, `FromAddress`, `ToAddress`, `Username`) to `api/Api/local.settings.json.example`, without an `AppPassword` entry.
- [x] 5.2 Update `api/README.md`: document the new `EmailNotification` section, that `AppPassword` must be supplied out-of-band (local `local.settings.json`, or `EmailNotification__AppPassword` app setting when deployed), and a one-line pointer to generating a Gmail App Password.

## 6. Verification

- [x] 6.1 Run `dotnet build` from `api/` and confirm it succeeds.
- [ ] 6.2 Locally configure a real Gmail App Password, run the Api, submit a contact form request (e.g. via `curl` or the client), and confirm both the DB row and the notification email arrive.
- [x] 6.3 Confirm that with `AppPassword` unset, a submission still returns `201 Created` and persists, with a logged warning instead of a thrown exception.
