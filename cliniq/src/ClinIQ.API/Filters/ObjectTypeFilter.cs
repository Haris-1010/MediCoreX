using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ClinIQ.API.Filters;

public class ObjectTypeFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (context.Type == typeof(object))
        {
            schema.Type = "object";
            schema.AdditionalPropertiesAllowed = true;
            schema.Properties.Clear();
        }
    }
}
