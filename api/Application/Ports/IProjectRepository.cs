using Domain;

namespace Application.Ports;

public interface IProjectRepository
{
    Task<IReadOnlyList<Project>> GetProjectsAsync(Language language, CancellationToken cancellationToken = default);
}
