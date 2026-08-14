namespace Application;

public class EmailNotificationOptions
{
    public const string SectionName = "EmailNotification";

    public string SmtpHost { get; set; } = "smtp.gmail.com";

    public int SmtpPort { get; set; } = 587;

    public string? FromAddress { get; set; }

    public string? ToAddress { get; set; }

    public string? Username { get; set; }
}
