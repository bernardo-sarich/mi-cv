using Domain;

namespace Application.Ports;

public interface ICvRepository
{
    Task<CvContent> GetCvAsync(Language language, CancellationToken cancellationToken = default);
}
