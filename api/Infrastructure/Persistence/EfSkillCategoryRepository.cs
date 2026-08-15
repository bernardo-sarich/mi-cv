using Application.Ports;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class EfSkillCategoryRepository(IDbContextFactory<CvDbContext> dbContextFactory) : ISkillCategoryRepository
{
    public async Task<IReadOnlyList<SkillCategory>> GetSkillsAsync(Language language, CancellationToken cancellationToken = default)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync(cancellationToken);
        var entities = await dbContext.SkillCategories
            .Where(s => s.Language == language)
            .OrderBy(s => s.Id)
            .ToListAsync(cancellationToken);
        return entities.Select(s => s.ToDomain()).ToList();
    }
}
