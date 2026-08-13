namespace Domain;

public class ContactMessage
{
    public required string Name { get; init; }
    public required string Email { get; init; }
    public required string Message { get; init; }
    public required DateTimeOffset SubmittedAt { get; init; }
}
