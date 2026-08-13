using Domain;

namespace Infrastructure.Persistence.Entities;

public class ExperienceEntity
{
    public int Id { get; set; }
    public Language Language { get; set; }
    public string Company { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Dates { get; set; } = string.Empty;
    public List<string> Bullets { get; set; } = [];

    public Experience ToDomain() => new()
    {
        Language = Language,
        Company = Company,
        Role = Role,
        Dates = Dates,
        Bullets = Bullets,
    };
}
