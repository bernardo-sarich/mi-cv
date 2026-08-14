using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Api.Cors;

public class CorsHeaderWriter(IOptions<CorsOptions> corsOptions)
{
    public void Apply(HttpRequest request, HttpResponse response)
    {
        var origin = request.Headers.Origin.ToString();

        if (string.IsNullOrEmpty(origin) || !corsOptions.Value.AllowedOriginsList.Contains(origin))
            return;

        response.Headers.AccessControlAllowOrigin = origin;
        response.Headers.Vary = "Origin";

        if (HttpMethods.IsOptions(request.Method))
        {
            response.Headers.AccessControlAllowMethods = "GET, POST, OPTIONS";
            response.Headers.AccessControlAllowHeaders = "Content-Type";
        }
    }
}
