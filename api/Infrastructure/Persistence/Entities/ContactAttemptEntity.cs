namespace Infrastructure.Persistence.Entities;

public class ContactAttemptEntity
{
    public int Id { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public DateTimeOffset AttemptedAt { get; set; }
}
