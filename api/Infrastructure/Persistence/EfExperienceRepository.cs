using Application.Ports;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class EfExperienceRepository(IDbContextFactory<CvDbContext> dbContextFactory) : IExperienceRepository
{
    public async Task<IReadOnlyList<Experience>> GetExperienceAsync(Language language, CancellationToken cancellationToken = default)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync(cancellationToken);
        var entities = await dbContext.Experiences
            .Where(e => e.Language == language)
            .OrderBy(e => e.Id)
            .ToListAsync(cancellationToken);
        return entities.Select(e => e.ToDomain()).ToList();
    }
}
