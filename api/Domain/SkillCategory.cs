namespace Domain;

public class SkillCategory
{
    public required Language Language { get; init; }
    public required string Name { get; init; }
    public required IReadOnlyList<string> Items { get; init; }
}
