namespace Application;

public class RateLimitOptions
{
    public const string SectionName = "ContactRateLimit";

    public int MaxAttempts { get; set; } = 5;

    public TimeSpan Window { get; set; } = TimeSpan.FromMinutes(15);
}
