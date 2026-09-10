using System.Reflection;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace ClinIQ.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register FluentValidation validators
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // Register AutoMapper profiles
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        return services;
    }
}
