namespace Domain;

public class Project
{
    public required Language Language { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required IReadOnlyList<string> Stack { get; init; }
    public required string Link { get; init; }
}
