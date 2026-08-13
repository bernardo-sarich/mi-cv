using Domain;

namespace Infrastructure.Persistence.Entities;

public class SkillCategoryEntity
{
    public int Id { get; set; }
    public Language Language { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<string> Items { get; set; } = [];

    public SkillCategory ToDomain() => new()
    {
        Language = Language,
        Name = Name,
        Items = Items,
    };
}
