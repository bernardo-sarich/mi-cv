using Domain;

namespace Application.Ports;

public interface IContactRepository
{
    Task SaveAsync(ContactMessage message, CancellationToken cancellationToken = default);
}
