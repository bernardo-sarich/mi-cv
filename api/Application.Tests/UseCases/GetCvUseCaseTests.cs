using Application.Ports;
using Application.UseCases;
using Domain;
using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace Application.Tests.UseCases;

public class GetCvUseCaseTests
{
    private const Language RequestedLanguage = Language.Es;

    private readonly IProfileRepository _profileRepository = Substitute.For<IProfileRepository>();
    private readonly IExperienceRepository _experienceRepository = Substitute.For<IExperienceRepository>();
    private readonly IProjectRepository _projectRepository = Substitute.For<IProjectRepository>();
    private readonly ISkillCategoryRepository _skillCategoryRepository = Substitute.For<ISkillCategoryRepository>();

    private GetCvUseCase CreateSut() =>
        new(_profileRepository, _experienceRepository, _projectRepository, _skillCategoryRepository);

    private static Profile KnownProfile() => new()
    {
        Language = RequestedLanguage,
        Name = "Ada Lovelace",
        Title = "Software Engineer",
        Bio = "Bio de prueba.",
        Stats = [],
    };

    private static IReadOnlyList<Experience> KnownExperience() =>
    [
        new Experience
        {
            Language = RequestedLanguage,
            Company = "Analytical Engines Inc.",
            Role = "Engineer",
            Dates = "2020 - Presente",
            Bullets = ["Bullet de prueba"],
        },
    ];

    private static IReadOnlyList<Project> KnownProjects() =>
    [
        new Project
        {
            Language = RequestedLanguage,
            Name = "Proyecto de prueba",
            Description = "Descripción de prueba.",
            Stack = ["C#", ".NET"],
            Link = "https://example.com",
        },
    ];

    private static IReadOnlyList<SkillCategory> KnownSkills() =>
    [
        new SkillCategory
        {
            Language = RequestedLanguage,
            Name = "Backend",
            Items = ["C#", "SQL"],
        },
    ];

    private void ConfigureRepositoriesToReturnKnownValues(
        Profile profile, IReadOnlyList<Experience> experience, IReadOnlyList<Project> projects, IReadOnlyList<SkillCategory> skills)
    {
        _profileRepository.GetProfileAsync(RequestedLanguage, Arg.Any<CancellationToken>()).Returns(profile);
        _experienceRepository.GetExperienceAsync(RequestedLanguage, Arg.Any<CancellationToken>()).Returns(experience);
        _projectRepository.GetProjectsAsync(RequestedLanguage, Arg.Any<CancellationToken>()).Returns(projects);
        _skillCategoryRepository.GetSkillsAsync(RequestedLanguage, Arg.Any<CancellationToken>()).Returns(skills);
    }

    [Fact]
    public async Task ExecuteAsync_WithValidLanguage_ReturnsCvContentAssembledFromRepositories()
    {
        var sut = CreateSut();
        var profile = KnownProfile();
        var experience = KnownExperience();
        var projects = KnownProjects();
        var skills = KnownSkills();
        ConfigureRepositoriesToReturnKnownValues(profile, experience, projects, skills);

        var result = await sut.ExecuteAsync(RequestedLanguage);

        Assert.Equal(RequestedLanguage, result.Language);
        Assert.Same(profile, result.Profile);
        Assert.Same(experience, result.Experience);
        Assert.Same(projects, result.Projects);
        Assert.Same(skills, result.Skills);
    }

    [Fact]
    public async Task ExecuteAsync_WithValidLanguage_InvokesEachRepositoryExactlyOnceWithThatLanguage()
    {
        var sut = CreateSut();
        ConfigureRepositoriesToReturnKnownValues(KnownProfile(), KnownExperience(), KnownProjects(), KnownSkills());

        await sut.ExecuteAsync(RequestedLanguage);

        await _profileRepository.Received(1).GetProfileAsync(RequestedLanguage, Arg.Any<CancellationToken>());
        await _experienceRepository.Received(1).GetExperienceAsync(RequestedLanguage, Arg.Any<CancellationToken>());
        await _projectRepository.Received(1).GetProjectsAsync(RequestedLanguage, Arg.Any<CancellationToken>());
        await _skillCategoryRepository.Received(1).GetSkillsAsync(RequestedLanguage, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task ExecuteAsync_WhenARepositoryThrows_PropagatesTheSameException()
    {
        var sut = CreateSut();
        _profileRepository.GetProfileAsync(RequestedLanguage, Arg.Any<CancellationToken>()).Returns(KnownProfile());
        _experienceRepository.GetExperienceAsync(RequestedLanguage, Arg.Any<CancellationToken>()).Returns(KnownExperience());
        _skillCategoryRepository.GetSkillsAsync(RequestedLanguage, Arg.Any<CancellationToken>()).Returns(KnownSkills());
        var expectedException = new InvalidOperationException("DB down");
        _projectRepository.GetProjectsAsync(RequestedLanguage, Arg.Any<CancellationToken>()).ThrowsAsync(expectedException);

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => sut.ExecuteAsync(RequestedLanguage));

        Assert.Same(expectedException, ex);
    }
}
