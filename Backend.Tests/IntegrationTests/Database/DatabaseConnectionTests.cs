using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;
using MySqlConnector;
using Backend.Tests.IntegrationTests.Configuration;

namespace Backend.Tests.IntegrationTests.Database
{
    public class DatabaseConnectionTests : IClassFixture<ApiWebApplicationFactory>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public DatabaseConnectionTests(ApiWebApplicationFactory factory)
        {
            _factory = factory;
        }

        // [Fact]
        public async Task ProductionDatabaseConnection_IsSuccessful()
        {
            using var scope = _factory.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var canConnect = await dbContext.Database.CanConnectAsync();
            Assert.True(canConnect, "Failed to connect to the production database.");
        }

        // [Fact]
        public async Task TestDatabaseConnection_IsSuccessful()
        {
            using var scope = _factory.Services.CreateScope();
            var dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseMySql(Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_TEST"), ServerVersion.AutoDetect(Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_TEST")))
                .Options;
            var dbContext = new ApplicationDbContext(dbContextOptions);
            var canConnect = await dbContext.Database.CanConnectAsync();
            Assert.True(canConnect, "Failed to connect to the test database.");
        }

        // [Fact]
        public void CanConnectToDatabase()
        {
            var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_TEST");
            using var connection = new MySqlConnection(connectionString);
            connection.Open();
        }

        // [Fact]
        public void PrintConnectionString()
        {
            var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_TEST");
            Assert.False(string.IsNullOrEmpty(connectionString), "Connection string is not set.");
            Console.WriteLine(connectionString);
        }

        // [Fact]
        public void DatabaseIsInMemory()
        {
            var scope = _factory.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetService(typeof(ApplicationDbContext)) as ApplicationDbContext;

            var isInMemory = dbContext?.Database.IsInMemory();
            Assert.True(isInMemory, "The database should be in memory.");
        }

        // [Fact]
        public async Task DatabaseConnection_IsSuccessful()
        {
            // ARRANGE - CREATE A NEW SCOPE AND GET DATABASE CONTEXT
            var scope = _factory.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetService(typeof(ApplicationDbContext)) as ApplicationDbContext;

            // ACT - CHECK IF DATABASE CONTEXT IS NOT NULL
            Assert.NotNull(dbContext);

            // ASSERT - CHECK IF DATABASE CONNECTION IS SUCCESSFUL
            var canConnect = await dbContext.Database.CanConnectAsync();
            Assert.True(canConnect, "Database connection failed.");
        }
    }
}
