using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Errors;

public static class ProblemDetailsResult
{
    public static ObjectResult ValidationProblem(IDictionary<string, string[]> errors)
    {
        var problem = new ValidationProblemDetails(errors)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "One or more validation errors occurred.",
            Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
        };

        return new ObjectResult(problem)
        {
            StatusCode = StatusCodes.Status400BadRequest,
            ContentTypes = { "application/problem+json" },
        };
    }

    public static ObjectResult RateLimitProblem()
    {
        var problem = new ProblemDetails
        {
            Status = StatusCodes.Status429TooManyRequests,
            Title = "Too many requests.",
            Detail = "Too many contact submissions from this IP address. Please try again later.",
            Type = "https://tools.ietf.org/html/rfc6585#section-4",
        };

        return new ObjectResult(problem)
        {
            StatusCode = StatusCodes.Status429TooManyRequests,
            ContentTypes = { "application/problem+json" },
        };
    }

    public static ObjectResult InternalProblem(ILogger logger, Exception exception)
    {
        logger.LogError(exception, "Unhandled exception while processing request.");

        var problem = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "An unexpected error occurred.",
            Detail = "An unexpected error occurred while processing the request.",
            Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
        };

        return new ObjectResult(problem)
        {
            StatusCode = StatusCodes.Status500InternalServerError,
            ContentTypes = { "application/problem+json" },
        };
    }
}
