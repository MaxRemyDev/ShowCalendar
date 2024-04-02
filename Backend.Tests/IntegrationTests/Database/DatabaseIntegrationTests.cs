using Backend.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;
using Backend.Data;
using Backend.Tests.IntegrationTests.Configuration;

namespace Backend.Tests.IntegrationTests.Database
{
    public class DatabaseIntegrationTests : IClassFixture<ApiWebApplicationFactory>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public DatabaseIntegrationTests(ApiWebApplicationFactory factory)
        {
            _factory = factory;
        }

        // [Fact]
        public async Task CreateUser_SavesToDatabase()
        {
            // ARRANGE - CREATE A NEW SCOPE AND GET DATABASE CONTEXT
            var scope = _factory.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetService(typeof(ApplicationDbContext)) as ApplicationDbContext;
            var testUser = new User { Username = "TestUser", Email = "testuser@example.com", PasswordHash = new byte[10], PasswordSalt = new byte[10] };

            if (dbContext != null)
            {
                // ACT - ADD USER TO DATABASE
                dbContext.Users.Add(testUser);
                await dbContext.SaveChangesAsync();

                // ASSERT - CHECK IF USER IS SAVED TO DATABASE
                var userFromDb = await dbContext.Users.FirstOrDefaultAsync(u => u.Username == "TestUser");
                Assert.NotNull(userFromDb);
                Assert.Equal("testuser@example.com", userFromDb.Email);
            }
        }

        // [Fact]
        public async Task GetAllUsers_ReturnsUsersFromDatabase()
        {
            // ARRANGE - CREATE A NEW SCOPE AND GET DATABASE CONTEXT
            var scope = _factory.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetService(typeof(ApplicationDbContext)) as ApplicationDbContext;

            if (dbContext != null)
            {
                // ACT - GET ALL USERS FROM DATABASE
                dbContext.Users.RemoveRange(dbContext.Users);
                await dbContext.SaveChangesAsync();

                // ADD USERS TO DATABASE
                dbContext.Users.Add(new User { Username = "UnitUser1", Email = "unit_user1@example.com", PasswordHash = new byte[10], PasswordSalt = new byte[10] });
                dbContext.Users.Add(new User { Username = "UnitUser2", Email = "unit_user2@example.com", PasswordHash = new byte[10], PasswordSalt = new byte[10] });
                await dbContext.SaveChangesAsync();

                // ASSERT - CHECK IF USERS ARE RETURNED FROM DATABASE
                var users = await dbContext.Users.ToListAsync();
                Assert.Equal(2, users.Count);
            }
        }
    }
}
