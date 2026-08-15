using Domain;

namespace Application.Ports;

public interface ISkillCategoryRepository
{
    Task<IReadOnlyList<SkillCategory>> GetSkillsAsync(Language language, CancellationToken cancellationToken = default);
}
