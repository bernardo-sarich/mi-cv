using System.Text.Json;
using System.Text.Json.Serialization;
using Domain;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

var repoRoot = FindRepoRoot(AppContext.BaseDirectory);
var localSettingsPath = Path.Combine(repoRoot, "api", "Api", "local.settings.json");

var configuration = new ConfigurationBuilder()
    .AddJsonFile(localSettingsPath, optional: true, reloadOnChange: false)
    .AddEnvironmentVariables()
    .Build();

var connectionString = configuration.GetConnectionString("CvDatabase");
if (string.IsNullOrWhiteSpace(connectionString))
{
    Console.Error.WriteLine(
        "Missing configuration key 'ConnectionStrings:CvDatabase'. Copy api/Api/local.settings.json.example " +
        "to api/Api/local.settings.json and fill in a connection string, or set the " +
        "ConnectionStrings__CvDatabase environment variable.");
    return 1;
}

var cvDataPath = Path.Combine(repoRoot, "client", "src", "data", "cv-data.json");
if (!File.Exists(cvDataPath))
{
    Console.Error.WriteLine($"CV data file not found at '{cvDataPath}'.");
    return 1;
}

var locales = ParseCvData(cvDataPath);

var optionsBuilder = new DbContextOptionsBuilder<CvDbContext>();
optionsBuilder.UseSqlServer(connectionString);

await using var db = new CvDbContext(optionsBuilder.Options);

foreach (var (language, locale) in locales)
{
    await SeedLocaleAsync(db, language, locale);
}

return 0;

static string FindRepoRoot(string startDirectory)
{
    var dir = new DirectoryInfo(startDirectory);
    while (dir is not null)
    {
        if (File.Exists(Path.Combine(dir.FullName, "api", "api.slnx")))
        {
            return dir.FullName;
        }

        dir = dir.Parent;
    }

    throw new InvalidOperationException("Could not locate repo root (no ancestor directory contains api/api.slnx).");
}

static Dictionary<Language, LocaleJson> ParseCvData(string cvDataPath)
{
    var json = File.ReadAllText(cvDataPath);
    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
    var raw = JsonSerializer.Deserialize<Dictionary<string, LocaleJson>>(json, options)
              ?? throw new InvalidOperationException($"'{cvDataPath}' did not contain a valid locale map.");

    var result = new Dictionary<Language, LocaleJson>();
    foreach (var (key, locale) in raw)
    {
        result[ParseLanguage(key)] = locale;
    }

    return result;
}

static Language ParseLanguage(string key) => key switch
{
    "es" => Language.Es,
    "en" => Language.En,
    _ => throw new InvalidOperationException($"Unknown locale key '{key}' in cv-data.json."),
};

static async Task SeedLocaleAsync(CvDbContext db, Language language, LocaleJson locale)
{
    await using var transaction = await db.Database.BeginTransactionAsync();

    db.Profiles.RemoveRange(await db.Profiles.Where(p => p.Language == language).ToListAsync());
    db.Experiences.RemoveRange(await db.Experiences.Where(e => e.Language == language).ToListAsync());
    db.Projects.RemoveRange(await db.Projects.Where(p => p.Language == language).ToListAsync());
    db.SkillCategories.RemoveRange(await db.SkillCategories.Where(s => s.Language == language).ToListAsync());
    await db.SaveChangesAsync();

    var profile = new ProfileEntity
    {
        Language = language,
        Name = locale.Name,
        Title = locale.Title,
        Bio = locale.Bio,
        Stats = locale.Stats
            .Select(s => new StatEntity { Value = s.Value, Suffix = s.Suffix, Label = s.Label })
            .ToList(),
    };
    db.Profiles.Add(profile);

    var experiences = locale.Experience
        .Select(e => new ExperienceEntity
        {
            Language = language,
            Company = e.Company,
            Role = e.Role,
            Dates = e.Dates,
            Bullets = e.Bullets,
        })
        .ToList();
    db.Experiences.AddRange(experiences);

    var projects = locale.Projects
        .Select(p => new ProjectEntity
        {
            Language = language,
            Name = p.Name,
            Description = p.Desc,
            Stack = p.Stack,
            Link = p.Link,
        })
        .ToList();
    db.Projects.AddRange(projects);

    var skillCategories = locale.Skills
        .Select(s => new SkillCategoryEntity { Language = language, Name = s.Name, Items = s.Items })
        .ToList();
    db.SkillCategories.AddRange(skillCategories);

    await db.SaveChangesAsync();
    await transaction.CommitAsync();

    Console.WriteLine(
        $"[{language}] Profile: 1, Stats: {profile.Stats.Count}, Experience: {experiences.Count}, " +
        $"Projects: {projects.Count}, SkillCategories: {skillCategories.Count}");
}

internal sealed record LocaleJson(
    string Name,
    string Title,
    string Bio,
    List<StatJson> Stats,
    List<ExperienceJson> Experience,
    List<SkillCategoryJson> Skills,
    List<ProjectJson> Projects);

internal sealed record StatJson(int Value, string Suffix, string Label);

internal sealed record ExperienceJson(string Company, string Role, string Dates, List<string> Bullets);

internal sealed record SkillCategoryJson(string Name, List<string> Items);

internal sealed record ProjectJson(
    string Name,
    [property: JsonPropertyName("desc")] string Desc,
    List<string> Stack,
    string Link);
