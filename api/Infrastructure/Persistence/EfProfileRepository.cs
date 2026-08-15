using Application.Ports;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class EfProfileRepository(IDbContextFactory<CvDbContext> dbContextFactory) : IProfileRepository
{
    public async Task<Profile> GetProfileAsync(Language language, CancellationToken cancellationToken = default)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync(cancellationToken);
        var entity = await dbContext.Profiles
            .Include(p => p.Stats)
            .SingleAsync(p => p.Language == language, cancellationToken);
        return entity.ToDomain();
    }
}
