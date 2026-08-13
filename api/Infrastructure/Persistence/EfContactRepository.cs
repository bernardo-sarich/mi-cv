using Application.Ports;
using Domain;
using Infrastructure.Persistence.Entities;

namespace Infrastructure.Persistence;

public class EfContactRepository(CvDbContext dbContext) : IContactRepository
{
    public async Task SaveAsync(ContactMessage message, CancellationToken cancellationToken = default)
    {
        dbContext.ContactMessages.Add(ContactMessageEntity.FromDomain(message));
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
