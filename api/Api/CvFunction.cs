using Api.Cors;
using Api.Dtos;
using Api.Errors;
using Application.UseCases;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Api;

public class CvFunction(GetCvUseCase getCvUseCase, CorsHeaderWriter corsHeaderWriter, ILogger<CvFunction> logger)
{
    [Function("CvFunction")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "cv")] HttpRequest req,
        CancellationToken cancellationToken)
    {
        corsHeaderWriter.Apply(req, req.HttpContext.Response);

        if (HttpMethods.IsOptions(req.Method))
            return new StatusCodeResult(StatusCodes.Status204NoContent);

        try
        {
            var language = ParseLanguage(req.Query["lang"]);
            var content = await getCvUseCase.ExecuteAsync(language, cancellationToken);
            return new OkObjectResult(CvResponseDto.FromDomain(content));
        }
        catch (Exception ex)
        {
            return ProblemDetailsResult.InternalProblem(logger, ex);
        }
    }

    private static Language ParseLanguage(string? lang) =>
        lang?.Trim().ToLowerInvariant() switch
        {
            "en" => Language.En,
            _ => Language.Es,
        };
}
