using Application.UseCases;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<GetCvUseCase>();
        services.AddScoped<SubmitContactUseCase>();

        return services;
    }
}
