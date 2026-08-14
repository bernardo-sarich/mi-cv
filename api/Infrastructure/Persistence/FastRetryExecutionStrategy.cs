using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Persistence;

public class FastRetryExecutionStrategy : SqlServerRetryingExecutionStrategy
{
    private static readonly TimeSpan RetryDelay = TimeSpan.FromMilliseconds(500);

    public FastRetryExecutionStrategy(ExecutionStrategyDependencies dependencies)
        : base(dependencies, maxRetryCount: 40, maxRetryDelay: RetryDelay, errorNumbersToAdd: null)
    {
    }

    protected override TimeSpan? GetNextDelay(Exception lastException)
    {
        var baseDelay = base.GetNextDelay(lastException);
        return baseDelay is null ? null : RetryDelay;
    }
}
