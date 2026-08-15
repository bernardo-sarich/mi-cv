using Application.Ports;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class EfProjectRepository(IDbContextFactory<CvDbContext> dbContextFactory) : IProjectRepository
{
    public async Task<IReadOnlyList<Project>> GetProjectsAsync(Language language, CancellationToken cancellationToken = default)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync(cancellationToken);
        var entities = await dbContext.Projects
            .Where(p => p.Language == language)
            .OrderBy(p => p.Id)
            .ToListAsync(cancellationToken);
        return entities.Select(p => p.ToDomain()).ToList();
    }
}
