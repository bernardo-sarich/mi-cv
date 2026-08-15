using Domain;

namespace Application.Ports;

public interface IExperienceRepository
{
    Task<IReadOnlyList<Experience>> GetExperienceAsync(Language language, CancellationToken cancellationToken = default);
}
