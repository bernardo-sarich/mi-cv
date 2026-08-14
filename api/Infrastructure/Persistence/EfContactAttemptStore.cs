using Application.Ports;
using Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class EfContactAttemptStore(CvDbContext dbContext) : IContactAttemptStore
{
    public Task<int> CountRecentAsync(string ipAddress, DateTimeOffset since, CancellationToken cancellationToken = default) =>
        dbContext.ContactAttempts
            .Where(a => a.IpAddress == ipAddress && a.AttemptedAt >= since)
            .CountAsync(cancellationToken);

    public async Task RecordAsync(string ipAddress, DateTimeOffset attemptedAt, CancellationToken cancellationToken = default)
    {
        dbContext.ContactAttempts.Add(new ContactAttemptEntity { IpAddress = ipAddress, AttemptedAt = attemptedAt });
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
