using Application.Ports;
using Infrastructure.Email;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace Infrastructure;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = new NpgsqlConnectionStringBuilder(configuration.GetConnectionString("CvDatabase")).ConnectionString;

        services.AddDbContextFactory<CvDbContext>(options =>
            options.UseNpgsql(connectionString, npgsql => npgsql.EnableRetryOnFailure()));

        services.AddScoped<CvDbContext>(sp => sp.GetRequiredService<IDbContextFactory<CvDbContext>>().CreateDbContext());

        services.AddScoped<ICvRepository, EfCvRepository>();
        services.AddScoped<IContactRepository, EfContactRepository>();
        services.AddScoped<IContactAttemptStore, EfContactAttemptStore>();
        services.AddScoped<IContactNotifier, SmtpContactNotifier>();

        return services;
    }
}
