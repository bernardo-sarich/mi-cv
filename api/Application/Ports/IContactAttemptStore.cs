namespace Application.Ports;

public interface IContactAttemptStore
{
    Task<int> CountRecentAsync(string ipAddress, DateTimeOffset since, CancellationToken cancellationToken = default);

    Task RecordAsync(string ipAddress, DateTimeOffset attemptedAt, CancellationToken cancellationToken = default);
}
