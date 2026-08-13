namespace Domain;

public class Profile
{
    public required Language Language { get; init; }
    public required string Name { get; init; }
    public required string Title { get; init; }
    public required string Bio { get; init; }
    public required IReadOnlyList<Stat> Stats { get; init; }
}
