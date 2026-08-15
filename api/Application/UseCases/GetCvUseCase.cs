using Application.Ports;
using Domain;

namespace Application.UseCases;

public class GetCvUseCase(
    IProfileRepository profileRepository,
    IExperienceRepository experienceRepository,
    IProjectRepository projectRepository,
    ISkillCategoryRepository skillCategoryRepository)
{
    public async Task<CvContent> ExecuteAsync(Language language, CancellationToken cancellationToken = default)
    {
        var profileTask = profileRepository.GetProfileAsync(language, cancellationToken);
        var experienceTask = experienceRepository.GetExperienceAsync(language, cancellationToken);
        var projectsTask = projectRepository.GetProjectsAsync(language, cancellationToken);
        var skillsTask = skillCategoryRepository.GetSkillsAsync(language, cancellationToken);

        await Task.WhenAll(profileTask, experienceTask, projectsTask, skillsTask);

        return new CvContent
        {
            Language = language,
            Profile = await profileTask,
            Experience = await experienceTask,
            Projects = await projectsTask,
            Skills = await skillsTask,
        };
    }
}
