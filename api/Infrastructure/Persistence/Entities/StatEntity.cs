using Domain;

namespace Infrastructure.Persistence.Entities;

public class StatEntity
{
    public int Id { get; set; }
    public int Value { get; set; }
    public string Suffix { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public int ProfileId { get; set; }

    public Stat ToDomain() => new()
    {
        Value = Value,
        Suffix = Suffix,
        Label = Label,
    };

    public static StatEntity FromDomain(Stat stat) => new()
    {
        Value = stat.Value,
        Suffix = stat.Suffix,
        Label = stat.Label,
    };
}
