using Application;
using Application.Ports;
using Domain;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Infrastructure.Email;

public class SmtpContactNotifier(
    IOptions<EmailNotificationOptions> options,
    IConfiguration configuration,
    ILogger<SmtpContactNotifier> logger) : IContactNotifier
{
    public async Task NotifyAsync(ContactMessage message, CancellationToken cancellationToken = default)
    {
        var settings = options.Value;
        var appPassword = configuration["EmailNotification:AppPassword"];

        if (string.IsNullOrWhiteSpace(appPassword) ||
            string.IsNullOrWhiteSpace(settings.FromAddress) ||
            string.IsNullOrWhiteSpace(settings.ToAddress))
        {
            logger.LogWarning("Contact notification email not sent: EmailNotification is not fully configured.");
            return;
        }

        var mimeMessage = new MimeMessage();
        mimeMessage.From.Add(MailboxAddress.Parse(settings.FromAddress));
        mimeMessage.To.Add(MailboxAddress.Parse(settings.ToAddress));
        mimeMessage.Subject = $"Nuevo mensaje de contacto de {message.Name}";
        mimeMessage.Body = new TextPart("plain")
        {
            Text = $"Nombre: {message.Name}\nEmail: {message.Email}\n\n{message.Message}",
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(settings.SmtpHost, settings.SmtpPort, SecureSocketOptions.StartTls, cancellationToken);
        await client.AuthenticateAsync(settings.Username ?? settings.FromAddress, appPassword, cancellationToken);
        await client.SendAsync(mimeMessage, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}
