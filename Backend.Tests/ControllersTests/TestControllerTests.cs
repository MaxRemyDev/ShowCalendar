using Xunit;
using Microsoft.AspNetCore.Mvc;
using Backend.Controllers;
using Microsoft.AspNetCore.Http;

namespace Backend.Tests.ControllersTests
{
    // UNIT TEST - TEST CONTROLLER
    public class TestControllerTests
    {
        // DECLARES A PRIVATE READ-ONLY FIELD FOR "TESTCONTROLLER"
        private readonly TestController _controller;

        // CONSTRUCTOR FOR "TESTCONTROLLERTESTS" CREATES AN INSTANCE OF "TESTCONTROLLER"
        public TestControllerTests()
        {
            _controller = new TestController();
        }

        // TEST TO VERIFY THAT "TEST" ROUTE RETURNS "OKOBJECTRESULT"
        [Fact]
        public void Test_Route_Returns_Ok()
        {
            // ACT - CALL "TEST" METHOD
            var result = _controller.Test();

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OKOBJECTRESULT"
            Assert.IsType<OkObjectResult>(result);
        }

        // TEST TO VERIFY THAT "CAUSEERROR" RETURNS "OBJECTRESULT" WITH STATUS CODE 500 (INTERNAL SERVER ERROR)
        [Fact]
        public void CauseError_Returns_InternalServerError()
        {
            // ACT - CALL "CAUSEERROR" METHOD
            var result = _controller.CauseError();

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OBJECTRESULT" WITH STATUS CODE 500
            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(StatusCodes.Status500InternalServerError, objectResult.StatusCode);
        }

        // TEST TO VERIFY THAT "CAUSENOTFOUNDERROR" RETURNS "NOTFOUNDOBJECTRESULT"
        [Fact]
        public void CauseNotFoundError_Returns_NotFound()
        {
            // ACT - CALL "CAUSENOTFOUNDERROR" METHOD
            var result = _controller.CauseNotFoundError();

            // ASSERT - VERIFY THAT METHOD RETURNS A "NOTFOUNDOBJECTRESULT"
            Assert.IsType<NotFoundObjectResult>(result);
        }

        // TEST TO VERIFY THAT "CAUSEUNAUTHORIZEDERROR" RETURNS "OBJECTRESULT" WITH STATUS CODE 403 (FORBIDDEN)
        [Fact]
        public void CauseUnauthorizedError_Returns_Forbidden()
        {
            // ACT - CALL "CAUSEUNAUTHORIZEDERROR" METHOD
            var result = _controller.CauseUnauthorizedError();

            // ASSERT - VERIFY THAT METHOD RETURNS AN "OBJECTRESULT" WITH STATUS CODE 403
            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(StatusCodes.Status403Forbidden, objectResult.StatusCode);
        }

        // TEST TO VERIFY THAT "CAUSEBADREQUESTERROR" RETURNS "BADREQUESTOBJECTRESULT"
        [Fact]
        public void CauseBadRequestError_Returns_BadRequest()
        {
            // ACT - CALL "CAUSEBADREQUESTERROR" METHOD
            var result = _controller.CauseBadRequestError();

            // ASSERT - VERIFY THAT METHOD RETURNS A "BADREQUESTOBJECTRESULT"
            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}
