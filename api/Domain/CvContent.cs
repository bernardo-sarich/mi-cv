namespace Domain;

public class CvContent
{
    public required Language Language { get; init; }
    public required Profile Profile { get; init; }
    public required IReadOnlyList<Experience> Experience { get; init; }
    public required IReadOnlyList<Project> Projects { get; init; }
    public required IReadOnlyList<SkillCategory> Skills { get; init; }
}
