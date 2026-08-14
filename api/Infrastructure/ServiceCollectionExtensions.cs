using Application.Ports;
using Infrastructure.Email;
using Infrastructure.Persistence;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class ServiceCollectionExtensions
{
    // Azure SQL serverless auto-resume can take longer than SqlClient's 15s default
    // connect timeout; Microsoft recommends 30s for serverless tiers so a single
    // connection attempt has a real chance of landing while the database wakes up.
    private const int ConnectTimeoutSeconds = 30;

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionStringBuilder = new SqlConnectionStringBuilder(configuration.GetConnectionString("CvDatabase"))
        {
            ConnectTimeout = ConnectTimeoutSeconds,
        };

        services.AddDbContext<CvDbContext>(options =>
            options.UseSqlServer(
                connectionStringBuilder.ConnectionString,
                sql => sql.ExecutionStrategy(dependencies => new FastRetryExecutionStrategy(dependencies))));

        services.AddScoped<ICvRepository, EfCvRepository>();
        services.AddScoped<IContactRepository, EfContactRepository>();
        services.AddScoped<IContactAttemptStore, EfContactAttemptStore>();
        services.AddScoped<IContactNotifier, SmtpContactNotifier>();

        return services;
    }
}
