using Domain;

namespace Application.Ports;

public interface IContactNotifier
{
    Task NotifyAsync(ContactMessage message, CancellationToken cancellationToken = default);
}
