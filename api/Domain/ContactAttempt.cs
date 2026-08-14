namespace Domain;

public class ContactAttempt
{
    public required string IpAddress { get; init; }
    public required DateTimeOffset AttemptedAt { get; init; }
}
