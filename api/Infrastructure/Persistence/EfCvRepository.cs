using Application.Ports;
using Domain;
using Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class EfCvRepository(IDbContextFactory<CvDbContext> dbContextFactory) : ICvRepository
{
    public async Task<CvContent> GetCvAsync(Language language, CancellationToken cancellationToken = default)
    {
        var profileTask = GetProfileAsync(language, cancellationToken);
        var experienceTask = GetExperienceAsync(language, cancellationToken);
        var projectsTask = GetProjectsAsync(language, cancellationToken);
        var skillsTask = GetSkillsAsync(language, cancellationToken);

        await Task.WhenAll(profileTask, experienceTask, projectsTask, skillsTask);

        return new CvContent
        {
            Language = language,
            Profile = (await profileTask).ToDomain(),
            Experience = (await experienceTask).Select(e => e.ToDomain()).ToList(),
            Projects = (await projectsTask).Select(p => p.ToDomain()).ToList(),
            Skills = (await skillsTask).Select(s => s.ToDomain()).ToList(),
        };
    }

    private async Task<ProfileEntity> GetProfileAsync(Language language, CancellationToken cancellationToken)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync(cancellationToken);
        return await dbContext.Profiles
            .Include(p => p.Stats)
            .SingleAsync(p => p.Language == language, cancellationToken);
    }

    private async Task<List<ExperienceEntity>> GetExperienceAsync(Language language, CancellationToken cancellationToken)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync(cancellationToken);
        return await dbContext.Experiences
            .Where(e => e.Language == language)
            .OrderBy(e => e.Id)
            .ToListAsync(cancellationToken);
    }

    private async Task<List<ProjectEntity>> GetProjectsAsync(Language language, CancellationToken cancellationToken)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync(cancellationToken);
        return await dbContext.Projects
            .Where(p => p.Language == language)
            .OrderBy(p => p.Id)
            .ToListAsync(cancellationToken);
    }

    private async Task<List<SkillCategoryEntity>> GetSkillsAsync(Language language, CancellationToken cancellationToken)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync(cancellationToken);
        return await dbContext.SkillCategories
            .Where(s => s.Language == language)
            .OrderBy(s => s.Id)
            .ToListAsync(cancellationToken);
    }
}
