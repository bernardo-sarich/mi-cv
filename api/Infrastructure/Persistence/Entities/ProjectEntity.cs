using Domain;

namespace Infrastructure.Persistence.Entities;

public class ProjectEntity
{
    public int Id { get; set; }
    public Language Language { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Stack { get; set; } = [];
    public string Link { get; set; } = string.Empty;

    public Project ToDomain() => new()
    {
        Language = Language,
        Name = Name,
        Description = Description,
        Stack = Stack,
        Link = Link,
    };
}
