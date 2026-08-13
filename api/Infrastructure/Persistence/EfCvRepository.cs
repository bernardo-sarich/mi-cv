using Application.Ports;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class EfCvRepository(CvDbContext dbContext) : ICvRepository
{
    public async Task<CvContent> GetCvAsync(Language language, CancellationToken cancellationToken = default)
    {
        var profile = await dbContext.Profiles
            .Include(p => p.Stats)
            .SingleAsync(p => p.Language == language, cancellationToken);

        var experience = await dbContext.Experiences
            .Where(e => e.Language == language)
            .ToListAsync(cancellationToken);

        var projects = await dbContext.Projects
            .Where(p => p.Language == language)
            .ToListAsync(cancellationToken);

        var skills = await dbContext.SkillCategories
            .Where(s => s.Language == language)
            .ToListAsync(cancellationToken);

        return new CvContent
        {
            Language = language,
            Profile = profile.ToDomain(),
            Experience = experience.Select(e => e.ToDomain()).ToList(),
            Projects = projects.Select(p => p.ToDomain()).ToList(),
            Skills = skills.Select(s => s.ToDomain()).ToList(),
        };
    }
}
