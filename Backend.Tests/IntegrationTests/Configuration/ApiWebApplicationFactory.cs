using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Backend.Data;
using System;
using System.Linq;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Backend.Tests.IntegrationTests.Configuration
{
    public class ApiWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                // REMOVE EXISTING DB CONTEXT
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                var connectionStringTest = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_TEST"); // GET CONNECTION STRING FROM ENVIRONMENT VARIABLES

                // ADD DB CONTEXT
                if (!string.IsNullOrEmpty(connectionStringTest))
                {
                    services.AddDbContext<ApplicationDbContext>(options =>
                        options.UseMySql(connectionStringTest, ServerVersion.AutoDetect(connectionStringTest)));
                    Console.WriteLine("USING MYSQL DATABASE FOR TESTING");
                }
                else
                {
                    services.AddDbContext<ApplicationDbContext>(options =>
                    {
                        options.UseInMemoryDatabase("InMemoryDbForTesting");
                        Console.WriteLine("USING IN-MEMORY DATABASE FOR TESTING");
                    });
                }

                var sp = services.BuildServiceProvider(); // BUILD SERVICE PROVIDER

                // CREATE A SCOPE TO GET DB CONTEXT
                using (var scope = sp.CreateScope())
                {
                    // GET DB CONTEXT AND LOGGER
                    var scopedServices = scope.ServiceProvider;
                    var db = scopedServices.GetRequiredService<ApplicationDbContext>();
                    var logger = scopedServices.GetRequiredService<ILogger<ApiWebApplicationFactory>>();

                    // ENSURE DB IS CREATED AND MIGRATED
                    if (db.Database.IsInMemory())
                    {
                        db.Database.EnsureDeleted(); // ENSURE DB IS DELETED
                        db.Database.EnsureCreated(); // ENSURE DB IS CREATED

                        // LOG DATABASE INITIALIZED
                        logger.LogInformation("IN-MEMORY DATABASE FOR TESTING INITIALIZED");
                        Console.WriteLine($"ConnectionStringTest: {Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_TEST")}");
                    }
                    else
                    {
                        logger.LogInformation("USING MYSQL DATABASE FOR TESTING");
                        //TODO: CREATE LOGIC TO MYSQL DATABASE
                    }
                }
            })
            .ConfigureLogging(logging =>
            {
                // CONFIGURE LOGGING
                logging.ClearProviders();
                logging.AddDebug();
                logging.AddConsole();
            });
        }
    }
}
