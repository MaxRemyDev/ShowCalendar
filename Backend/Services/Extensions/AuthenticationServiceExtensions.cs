using System.Text;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace Backend.Services.Extensions
{
    // EXTENSION METHOD TO ADD JWT AUTHENTICATION TO SERVICE COLLECTION
    public static class AuthenticationServiceExtensions
    {
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            // ADD JWT AUTHENTICATION TO SERVICE COLLECTION
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    // RESOLVE ENVIRONMENT SERVICE TO ACCESS ENVIRONMENT VARIABLES
                    // WARN: USING BuildServiceProvider CAN LEAD TO AN INCREASE IN APP'S MEMORY USAGE AND POSSIBLE SERVICE LIFETIME ISSUES
                    var environmentService = services.BuildServiceProvider().GetRequiredService<IEnvironmentService>();
                    var jwtSecret = environmentService.GetJwtSecret(); // RETRIEVE JWT SECRET FROM ENVIRONMENT VARIABLES

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true, // ENSURE TOKEN'S SIGNATURE IS VALID
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecret)), // SET KEY USED TO SIGN TOKEN
                        ValidateIssuer = false, // DO NOT VALIDATE TOKEN ISSUER //!(RECOMMENDED TO CHANGE IN PRODUCTION)
                        ValidateAudience = false, // DO NOT VALIDATE AUDIENCE //!(RECOMMENDED TO CHANGE IN PRODUCTION)
                    };
                    options.Events = new JwtBearerEvents
                    {
                        // CUSTOMIZE RESPONSE ON AUTHENTICATION FAILURE
                        OnAuthenticationFailed = context =>
                        {
                            // SET RESPONSE STATUS CODE AND CONTENT TYPE
                            context.Response.StatusCode = 401;
                            context.Response.ContentType = "application/json";

                            // RETURN A CUSTOM JSON ERROR MESSAGE
                            // INFO: CUSTOMIZING ERROR RESPONSE ALLOWS FOR MORE USER-FRIENDLY ERROR HANDLING
                            return context.Response.WriteAsync(JsonConvert.SerializeObject(new
                            {
                                error = "An authentication error has occurred"
                            }));
                        },
                    };
                });

            // RETURN UPDATED SERVICE COLLECTION
            // INFO: THIS METHOD EXTENDS IServiceCollection TO INCLUDE JWT AUTHENTICATION BASED ON APPLICATION'S CONFIGURATION
            return services;
        }
    }
}
