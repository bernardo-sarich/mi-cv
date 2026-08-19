using Application.Errors;
using Application.Ports;
using Application.UseCases;
using Domain;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace Application.Tests.UseCases;

public class SubmitContactUseCaseTests
{
    private const string ValidName = "Ada Lovelace";
    private const string ValidEmail = "ada@example.com";
    private const string ValidMessage = "Hola, quiero contactarte por un proyecto.";
    private const string IpAddress = "203.0.113.10";

    private readonly IContactRepository _contactRepository = Substitute.For<IContactRepository>();
    private readonly IContactAttemptStore _contactAttemptStore = Substitute.For<IContactAttemptStore>();
    private readonly IContactNotifier _contactNotifier = Substitute.For<IContactNotifier>();
    private readonly ILogger<SubmitContactUseCase> _logger = Substitute.For<ILogger<SubmitContactUseCase>>();

    private SubmitContactUseCase CreateSut(int maxAttempts = 5, TimeSpan? window = null)
    {
        var options = Options.Create(new RateLimitOptions
        {
            MaxAttempts = maxAttempts,
            Window = window ?? TimeSpan.FromMinutes(15),
        });

        return new SubmitContactUseCase(
            _contactRepository,
            _contactAttemptStore,
            _contactNotifier,
            options,
            _logger);
    }

    private static SubmitContactRequest ValidRequest(string? website = null) =>
        new(ValidName, ValidEmail, ValidMessage, website);

    // 2. Honeypot

    [Fact]
    public async Task ExecuteAsync_WithNonEmptyWebsite_ReturnsWithoutTouchingAnyPort()
    {
        var sut = CreateSut();
        var request = ValidRequest(website: "https://spambot.example");

        await sut.ExecuteAsync(request, IpAddress);

        await _contactRepository.DidNotReceive().SaveAsync(Arg.Any<ContactMessage>(), Arg.Any<CancellationToken>());
        await _contactAttemptStore.DidNotReceive().CountRecentAsync(Arg.Any<string>(), Arg.Any<DateTimeOffset>(), Arg.Any<CancellationToken>());
        await _contactAttemptStore.DidNotReceive().RecordAsync(Arg.Any<string>(), Arg.Any<DateTimeOffset>(), Arg.Any<CancellationToken>());
        await _contactNotifier.DidNotReceive().NotifyAsync(Arg.Any<ContactMessage>(), Arg.Any<CancellationToken>());
    }

    // 3. Validación de campos individuales

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task ExecuteAsync_WithEmptyOrWhitespaceName_ThrowsValidationExceptionWithNameError(string? name)
    {
        var sut = CreateSut();
        var request = new SubmitContactRequest(name, ValidEmail, ValidMessage);

        var ex = await Assert.ThrowsAsync<ValidationException>(() => sut.ExecuteAsync(request, IpAddress));

        Assert.True(ex.Errors.ContainsKey("name"));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task ExecuteAsync_WithEmptyOrWhitespaceEmail_ThrowsValidationExceptionWithEmailError(string? email)
    {
        var sut = CreateSut();
        var request = new SubmitContactRequest(ValidName, email, ValidMessage);

        var ex = await Assert.ThrowsAsync<ValidationException>(() => sut.ExecuteAsync(request, IpAddress));

        Assert.True(ex.Errors.ContainsKey("email"));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task ExecuteAsync_WithEmptyOrWhitespaceMessage_ThrowsValidationExceptionWithMessageError(string? message)
    {
        var sut = CreateSut();
        var request = new SubmitContactRequest(ValidName, ValidEmail, message);

        var ex = await Assert.ThrowsAsync<ValidationException>(() => sut.ExecuteAsync(request, IpAddress));

        Assert.True(ex.Errors.ContainsKey("message"));
    }

    [Fact]
    public async Task ExecuteAsync_WithNameLongerThan200Characters_ThrowsValidationExceptionWithNameLengthError()
    {
        var sut = CreateSut();
        var request = new SubmitContactRequest(new string('a', 201), ValidEmail, ValidMessage);

        var ex = await Assert.ThrowsAsync<ValidationException>(() => sut.ExecuteAsync(request, IpAddress));

        Assert.True(ex.Errors.ContainsKey("name"));
        Assert.Contains("200", ex.Errors["name"][0]);
    }

    [Theory]
    [InlineData("sin-arroba")]
    [InlineData("falta@dominio")]
    [InlineData("@sin-usuario.com")]
    public async Task ExecuteAsync_WithInvalidEmailFormat_ThrowsValidationExceptionWithEmailError(string invalidEmail)
    {
        var sut = CreateSut();
        var request = new SubmitContactRequest(ValidName, invalidEmail, ValidMessage);

        var ex = await Assert.ThrowsAsync<ValidationException>(() => sut.ExecuteAsync(request, IpAddress));

        Assert.True(ex.Errors.ContainsKey("email"));
    }

    [Fact]
    public async Task ExecuteAsync_WithEmailLongerThan320Characters_ThrowsValidationExceptionWithEmailLengthError()
    {
        var sut = CreateSut();
        var longLocalPart = new string('a', 315);
        var request = new SubmitContactRequest(ValidName, $"{longLocalPart}@x.com", ValidMessage);

        var ex = await Assert.ThrowsAsync<ValidationException>(() => sut.ExecuteAsync(request, IpAddress));

        Assert.True(ex.Errors.ContainsKey("email"));
        Assert.Contains("320", ex.Errors["email"][0]);
    }

    [Fact]
    public async Task ExecuteAsync_WithMessageShorterThan10Characters_ThrowsValidationExceptionWithMinLengthError()
    {
        var sut = CreateSut();
        var request = new SubmitContactRequest(ValidName, ValidEmail, "short");

        var ex = await Assert.ThrowsAsync<ValidationException>(() => sut.ExecuteAsync(request, IpAddress));

        Assert.True(ex.Errors.ContainsKey("message"));
        Assert.Contains("at least", ex.Errors["message"][0]);
    }

    [Fact]
    public async Task ExecuteAsync_WithMessageLongerThan5000Characters_ThrowsValidationExceptionWithMaxLengthError()
    {
        var sut = CreateSut();
        var request = new SubmitContactRequest(ValidName, ValidEmail, new string('a', 5001));

        var ex = await Assert.ThrowsAsync<ValidationException>(() => sut.ExecuteAsync(request, IpAddress));

        Assert.True(ex.Errors.ContainsKey("message"));
        Assert.Contains("at most", ex.Errors["message"][0]);
    }

    // 4. Validación combinada

    [Fact]
    public async Task ExecuteAsync_WithMultipleInvalidFields_ThrowsValidationExceptionWithAllErrorKeys()
    {
        var sut = CreateSut();
        var request = new SubmitContactRequest(string.Empty, string.Empty, ValidMessage);

        var ex = await Assert.ThrowsAsync<ValidationException>(() => sut.ExecuteAsync(request, IpAddress));

        Assert.True(ex.Errors.ContainsKey("name"));
        Assert.True(ex.Errors.ContainsKey("email"));
    }

    // 5. Rate limiting

    [Fact]
    public async Task ExecuteAsync_WhenRateLimitReached_ThrowsRateLimitExceededExceptionAndNeverSaves()
    {
        var sut = CreateSut(maxAttempts: 3);
        _contactAttemptStore
            .CountRecentAsync(IpAddress, Arg.Any<DateTimeOffset>(), Arg.Any<CancellationToken>())
            .Returns(3);

        await Assert.ThrowsAsync<RateLimitExceededException>(() => sut.ExecuteAsync(ValidRequest(), IpAddress));

        await _contactRepository.DidNotReceive().SaveAsync(Arg.Any<ContactMessage>(), Arg.Any<CancellationToken>());
    }

    // 6. Camino feliz

    [Fact]
    public async Task ExecuteAsync_WithValidRequest_SavesTrimmedMessageRecordsAttemptAndNotifies()
    {
        // El email no lleva padding: el regex de formato exige que el string entero,
        // sin espacios, matchee, así que un email con espacios al borde nunca pasa
        // la validación y el .Trim() posterior es inalcanzable para ese campo.
        var sut = CreateSut();
        var request = new SubmitContactRequest(
            $"  {ValidName}  ",
            ValidEmail,
            $"  {ValidMessage}  ");

        await sut.ExecuteAsync(request, IpAddress);

        await _contactRepository.Received(1).SaveAsync(
            Arg.Is<ContactMessage>(m => m.Name == ValidName && m.Email == ValidEmail && m.Message == ValidMessage),
            Arg.Any<CancellationToken>());
        await _contactAttemptStore.Received(1).RecordAsync(IpAddress, Arg.Any<DateTimeOffset>(), Arg.Any<CancellationToken>());
        await _contactNotifier.Received(1).NotifyAsync(Arg.Any<ContactMessage>(), Arg.Any<CancellationToken>());
    }

    // 7. Notificación best-effort

    [Fact]
    public async Task ExecuteAsync_WhenNotifierThrows_DoesNotPropagateAndHadAlreadySaved()
    {
        var sut = CreateSut();
        _contactNotifier
            .NotifyAsync(Arg.Any<ContactMessage>(), Arg.Any<CancellationToken>())
            .ThrowsAsync(new InvalidOperationException("SMTP down"));

        await sut.ExecuteAsync(ValidRequest(), IpAddress);

        await _contactRepository.Received(1).SaveAsync(Arg.Any<ContactMessage>(), Arg.Any<CancellationToken>());
    }
}
