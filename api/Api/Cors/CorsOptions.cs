namespace Api.Cors;

public class CorsOptions
{
    public const string SectionName = "Cors";

    private const string DefaultAllowedOrigins =
        "https://icy-river-0fd990410.azurestaticapps.net,http://localhost:5173";

    public string AllowedOrigins { get; set; } = DefaultAllowedOrigins;

    public IReadOnlyList<string> AllowedOriginsList =>
        AllowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
}
