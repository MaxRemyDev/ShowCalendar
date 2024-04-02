using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;
using System.Net;
using Newtonsoft.Json;
using System.Text;
using Backend.Dtos;
using FluentAssertions;
using Backend.Tests.IntegrationTests.Configuration;

namespace Backend.Tests.IntegrationTests.API
{
    public class ApiIntegrationTests : IClassFixture<ApiWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public ApiIntegrationTests(ApiWebApplicationFactory factory)
        {
            _client = factory.CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false
            });
        }

        // [Fact]
        public async Task When_IdIsNotValid_Then_NotFoundStatusCodeShouldBeReturned()
        {
            var userResponse = await _client.GetAsync($"/api/users/{1}");
            userResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }


        // [Fact]
        public async Task GetAllUsers_ShouldReturnSuccessStatusCode()
        {
            // ARRANGE
            var response = await _client.GetAsync("/api/users");
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            // ACT
            var content = await response.Content.ReadAsStringAsync();

            // ASSERT
            Assert.NotEmpty(content);
        }

        // [Fact]
        public async Task CreateUser_ShouldReturnSuccessAndResourceLocation()
        {
            // ARRANGE
            var newUser = new UserRegistrationDto
            {
                Username = "testUser",
                Email = "testUser@example.com",
                Password = "Password123!"
            };

            // ACT
            var content = new StringContent(JsonConvert.SerializeObject(newUser), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("/api/users", content);

            // ASSERT
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            Assert.NotNull(response.Headers.Location);
            var responseContent = await response.Content.ReadAsStringAsync();
            Assert.NotEmpty(responseContent);
        }
    }
}
