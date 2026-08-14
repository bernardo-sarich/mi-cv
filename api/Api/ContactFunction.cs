using System.Text.Json;
using Api.Cors;
using Api.Errors;
using Application.Errors;
using Application.UseCases;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using ValidationException = Application.Errors.ValidationException;

namespace Api;

public class ContactFunction(
    SubmitContactUseCase submitContactUseCase,
    CorsHeaderWriter corsHeaderWriter,
    ILogger<ContactFunction> logger)
{
    [Function("ContactFunction")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", "options", Route = "contact")] HttpRequest req,
        CancellationToken cancellationToken)
    {
        corsHeaderWriter.Apply(req, req.HttpContext.Response);

        if (HttpMethods.IsOptions(req.Method))
            return new StatusCodeResult(StatusCodes.Status204NoContent);

        try
        {
            var body = await JsonSerializer.DeserializeAsync<SubmitContactRequest>(
                req.Body,
                new JsonSerializerOptions(JsonSerializerDefaults.Web),
                cancellationToken);

            if (body is null)
                return ProblemDetailsResult.ValidationProblem(
                    new Dictionary<string, string[]> { ["body"] = ["Request body is required."] });

            var ipAddress = GetClientIpAddress(req);

            await submitContactUseCase.ExecuteAsync(body, ipAddress, cancellationToken);
            return new StatusCodeResult(StatusCodes.Status201Created);
        }
        catch (JsonException)
        {
            return ProblemDetailsResult.ValidationProblem(
                new Dictionary<string, string[]> { ["body"] = ["Request body is not valid JSON."] });
        }
        catch (ValidationException ex)
        {
            return ProblemDetailsResult.ValidationProblem(ex.Errors);
        }
        catch (RateLimitExceededException)
        {
            return ProblemDetailsResult.RateLimitProblem();
        }
        catch (Exception ex)
        {
            return ProblemDetailsResult.InternalProblem(logger, ex);
        }
    }

    private static string GetClientIpAddress(HttpRequest req)
    {
        // Azure's edge appends the real client IP as the last hop of X-Forwarded-For;
        // any earlier hops (including the first) can be forged by the caller, so trusting
        // them would let an attacker set an arbitrary IP and bypass the rate limit.
        if (req.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor) &&
            !string.IsNullOrWhiteSpace(forwardedFor))
        {
            var hops = forwardedFor.ToString().Split(',');
            return hops[^1].Trim();
        }

        return req.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}
