using Application.Ports;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<CvDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("CvDatabase"),
                sql => sql.ExecutionStrategy(dependencies => new FastRetryExecutionStrategy(dependencies))));

        services.AddScoped<ICvRepository, EfCvRepository>();
        services.AddScoped<IContactRepository, EfContactRepository>();
        services.AddScoped<IContactAttemptStore, EfContactAttemptStore>();

        return services;
    }
}
