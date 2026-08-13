using Domain;

namespace Infrastructure.Persistence.Entities;

public class ContactMessageEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTimeOffset SubmittedAt { get; set; }

    public static ContactMessageEntity FromDomain(ContactMessage message) => new()
    {
        Name = message.Name,
        Email = message.Email,
        Message = message.Message,
        SubmittedAt = message.SubmittedAt,
    };
}
