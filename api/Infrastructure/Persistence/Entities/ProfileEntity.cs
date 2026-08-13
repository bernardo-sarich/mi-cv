using Domain;

namespace Infrastructure.Persistence.Entities;

public class ProfileEntity
{
    public int Id { get; set; }
    public Language Language { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public List<StatEntity> Stats { get; set; } = [];

    public Profile ToDomain() => new()
    {
        Language = Language,
        Name = Name,
        Title = Title,
        Bio = Bio,
        Stats = Stats.Select(s => s.ToDomain()).ToList(),
    };
}
