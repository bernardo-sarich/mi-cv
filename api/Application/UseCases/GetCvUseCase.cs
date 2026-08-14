using Application.Ports;
using Domain;

namespace Application.UseCases;

public class GetCvUseCase(ICvRepository cvRepository)
{
    public Task<CvContent> ExecuteAsync(Language language, CancellationToken cancellationToken = default) =>
        cvRepository.GetCvAsync(language, cancellationToken);
}
