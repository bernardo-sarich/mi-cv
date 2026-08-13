namespace Domain;

public class Experience
{
    public required Language Language { get; init; }
    public required string Company { get; init; }
    public required string Role { get; init; }
    public required string Dates { get; init; }
    public required IReadOnlyList<string> Bullets { get; init; }
}
