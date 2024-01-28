using Microsoft.AspNetCore.Mvc;
using System;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        // GET: api/test
        [HttpGet("route")]
        public IActionResult Test()
        {
            return Ok("TEST: THIS IS A TEST ROUTE.");
        }

        // GET: api/test/error
        [HttpGet("error")]
        public IActionResult CauseError()
        {
            throw new Exception("TEST: THIS IS A SIMULATED ERROR TO TEST ERRORHANDLERMIDDLEWARE.");
        }

        // GET: api/test/notfound
        [HttpGet("notfound")]
        public IActionResult CauseNotFoundError()
        {
            throw new KeyNotFoundException("TEST: THE SPECIFIED KEY WAS NOT FOUND IN THE COLLECTION.");
        }

        // GET: api/test/unauthorized
        [HttpGet("unauthorized")]
        public IActionResult CauseUnauthorizedError()
        {
            throw new UnauthorizedAccessException("TEST: THE USER DOES NOT HAVE PERMISSION TO PERFORM THIS ACTION.");
        }

        // GET: api/test/badrequest
        [HttpGet("badrequest")]
        public IActionResult CauseBadRequestError()
        {
            throw new ArgumentException("TEST: AN INVALID ARGUMENT WAS PROVIDED TO THE METHOD.");
        }

        // GET: api/test/customerror
        [HttpGet("customerror")]
        public IActionResult CauseCustomError()
        {
            throw new CustomException("TEST: THIS IS A CUSTOM EXCEPTION.");
        }
    }

    // class CUSTOM EXCEPTION CLASS
    public class CustomException : Exception
    {
        public CustomException(string message) : base(message)
        {
            // NEED CONFIGURATION TO HANDLE CUSTOM EXCEPTIONS
        }
    }
}
