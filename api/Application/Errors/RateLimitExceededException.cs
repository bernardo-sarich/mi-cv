namespace Application.Errors;

public class RateLimitExceededException() : Exception("Too many contact submissions from this IP address.");
