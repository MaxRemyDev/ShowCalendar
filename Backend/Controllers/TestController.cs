using Microsoft.AspNetCore.Mvc;
using System;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        // GET: api/test/route => 200 OK RESPONSE
        [HttpGet("route")]
        public IActionResult Test()
        {
            return Ok("TEST: THIS IS A TEST ROUTE.");
        }

        // GET: api/test/error => 500 INTERNAL SERVER ERROR RESPONSE
        [HttpGet("error")]
        public IActionResult CauseError()
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "TEST: THIS IS A SIMULATED ERROR TO TEST ERRORHANDLERMIDDLEWARE.");
        }

        // GET: api/test/notfound => 404 NOT FOUND RESPONSE
        [HttpGet("notfound")]
        public IActionResult CauseNotFoundError()
        {
            return NotFound("TEST: THE SPECIFIED KEY WAS NOT FOUND IN THE COLLECTION.");
        }

        // GET: api/test/unauthorized => 403 FORBIDDEN RESPONSE
        [HttpGet("unauthorized")]
        public IActionResult CauseUnauthorizedError()
        {
            return StatusCode(StatusCodes.Status403Forbidden, "TEST: THE USER DOES NOT HAVE PERMISSION TO PERFORM THIS ACTION.");
        }

        // GET: api/test/badrequest => 400 BAD REQUEST RESPONSE
        [HttpGet("badrequest")]
        public IActionResult CauseBadRequestError()
        {
            return BadRequest("TEST: AN INVALID ARGUMENT WAS PROVIDED TO THE METHOD.");
        }
    }
}
