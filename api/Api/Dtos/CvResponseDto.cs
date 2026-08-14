using System.Text.Json.Serialization;
using Domain;

namespace Api.Dtos;

public record StatDto(int Value, string Suffix, string Label)
{
    public static StatDto FromDomain(Stat stat) => new(stat.Value, stat.Suffix, stat.Label);
}

public record ExperienceDto(string Company, string Role, string Dates, IReadOnlyList<string> Bullets)
{
    public static ExperienceDto FromDomain(Experience experience) =>
        new(experience.Company, experience.Role, experience.Dates, experience.Bullets);
}

public record SkillCategoryDto(string Name, IReadOnlyList<string> Items)
{
    public static SkillCategoryDto FromDomain(SkillCategory category) => new(category.Name, category.Items);
}

public record ProjectDto(
    string Name,
    [property: JsonPropertyName("desc")] string Description,
    IReadOnlyList<string> Stack,
    string Link)
{
    public static ProjectDto FromDomain(Project project) =>
        new(project.Name, project.Description, project.Stack, project.Link);
}

public record CvResponseDto(
    string Name,
    string Title,
    string Bio,
    IReadOnlyList<StatDto> Stats,
    IReadOnlyList<ExperienceDto> Experience,
    IReadOnlyList<SkillCategoryDto> Skills,
    IReadOnlyList<ProjectDto> Projects)
{
    public static CvResponseDto FromDomain(CvContent content) => new(
        content.Profile.Name,
        content.Profile.Title,
        content.Profile.Bio,
        content.Profile.Stats.Select(StatDto.FromDomain).ToList(),
        content.Experience.Select(ExperienceDto.FromDomain).ToList(),
        content.Skills.Select(SkillCategoryDto.FromDomain).ToList(),
        content.Projects.Select(ProjectDto.FromDomain).ToList());
}
