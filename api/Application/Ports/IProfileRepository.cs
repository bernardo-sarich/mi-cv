using Domain;

namespace Application.Ports;

public interface IProfileRepository
{
    Task<Profile> GetProfileAsync(Language language, CancellationToken cancellationToken = default);
}
