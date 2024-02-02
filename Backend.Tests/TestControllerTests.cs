using Xunit;
using Microsoft.AspNetCore.Mvc;
using Backend.Controllers;
using Microsoft.AspNetCore.Http;

namespace Backend.Tests.Controllers
{
    public class TestControllerTests
    {
        private readonly TestController _controller;

        public TestControllerTests()
        {
            _controller = new TestController();
        }

        [Fact]
        public void Test_Route_Returns_Ok()
        {
            // Act
            var result = _controller.Test();

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void CauseError_Returns_InternalServerError()
        {
            // Act
            var result = _controller.CauseError();

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(StatusCodes.Status500InternalServerError, objectResult.StatusCode);
        }

        [Fact]
        public void CauseNotFoundError_Returns_NotFound()
        {
            // Act
            var result = _controller.CauseNotFoundError();

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public void CauseUnauthorizedError_Returns_Forbidden()
        {
            // Act
            var result = _controller.CauseUnauthorizedError();

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(StatusCodes.Status403Forbidden, objectResult.StatusCode);
        }

        [Fact]
        public void CauseBadRequestError_Returns_BadRequest()
        {
            // Act
            var result = _controller.CauseBadRequestError();

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }
    }

}