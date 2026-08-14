using System.Text.RegularExpressions;
using Application.Errors;
using Application.Ports;
using Domain;
using Microsoft.Extensions.Options;

namespace Application.UseCases;

public record SubmitContactRequest(string? Name, string? Email, string? Message, string? Website = null);

public partial class SubmitContactUseCase(
    IContactRepository contactRepository,
    IContactAttemptStore contactAttemptStore,
    IOptions<RateLimitOptions> rateLimitOptions)
{
    private const int NameMaxLength = 200;
    private const int EmailMaxLength = 320;
    private const int MessageMinLength = 10;
    private const int MessageMaxLength = 5000;

    public async Task ExecuteAsync(
        SubmitContactRequest request,
        string ipAddress,
        CancellationToken cancellationToken = default)
    {
        if (!string.IsNullOrWhiteSpace(request.Website))
            return;

        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(request.Name))
            errors["name"] = ["Name is required."];
        else if (request.Name.Length > NameMaxLength)
            errors["name"] = [$"Name must be at most {NameMaxLength} characters."];

        if (string.IsNullOrWhiteSpace(request.Email))
            errors["email"] = ["Email is required."];
        else if (request.Email.Length > EmailMaxLength)
            errors["email"] = [$"Email must be at most {EmailMaxLength} characters."];
        else if (!EmailRegex().IsMatch(request.Email))
            errors["email"] = ["Email is not a valid email address."];

        if (string.IsNullOrWhiteSpace(request.Message))
            errors["message"] = ["Message is required."];
        else if (request.Message.Length < MessageMinLength)
            errors["message"] = [$"Message must be at least {MessageMinLength} characters."];
        else if (request.Message.Length > MessageMaxLength)
            errors["message"] = [$"Message must be at most {MessageMaxLength} characters."];

        if (errors.Count > 0)
            throw new ValidationException(errors);

        var now = DateTimeOffset.UtcNow;
        var options = rateLimitOptions.Value;
        var recentAttempts = await contactAttemptStore.CountRecentAsync(ipAddress, now - options.Window, cancellationToken);

        if (recentAttempts >= options.MaxAttempts)
            throw new RateLimitExceededException();

        var message = new ContactMessage
        {
            Name = request.Name!.Trim(),
            Email = request.Email!.Trim(),
            Message = request.Message!.Trim(),
            SubmittedAt = now,
        };

        await contactRepository.SaveAsync(message, cancellationToken);
        await contactAttemptStore.RecordAsync(ipAddress, now, cancellationToken);
    }

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$")]
    private static partial Regex EmailRegex();
}
