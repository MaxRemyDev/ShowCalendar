using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace Backend.Middlewares
{
    public class ErrorHandlerMiddleware
    {
        // REQUEST DELEGATE TO HANDLE NEXT MIDDLEWARE IN PIPELINE
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlerMiddleware> _logger;

        public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        // METHOD TO HANDLE HTTP REQUEST
        public async Task Invoke(HttpContext context)
        {
            try
            {
                // PROCESS REQUEST AND PASS TO NEXT MIDDLEWARE
                await _next(context);
            }
            catch (Exception error)
            {
                // CHECK IF RESPONSE HAS ALREADY STARTED
                if (context.Response.HasStarted)
                {
                    _logger.LogError("The response has already started, the error handler middleware will not execute. Exception: {ErrorMessage}", error.Message);
                    throw; // PROPAGATE EXCEPTION IF RESPONSE HAS ALREADY STARTED
                }

                // LOG ERROR MESSAGE
                _logger.LogError("An unhandled exception has occurred while processing the request. Exception: {ErrorMessage}, Type: {ExceptionType}, StackTrace: {StackTrace}, Request: {Method} {Url}",
                                 error.Message, error.GetType().Name, error.StackTrace, context.Request.Method, context.Request.Path);
                await HandleExceptionAsync(context, error);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception error)
        {
            // SET RESPONSE STATUS CODE AND CONTENT TYPE
            var response = context.Response;
            response.ContentType = "application/json";

            // SET RESPONSE STATUS CODE BASED ON EXCEPTION
            response.StatusCode = error switch
            {
                KeyNotFoundException => (int)HttpStatusCode.NotFound, // 404
                InvalidOperationException => (int)HttpStatusCode.Conflict, // 409
                _ => (int)HttpStatusCode.InternalServerError, // 500
            };

            var result = JsonSerializer.Serialize(new { message = error.Message }); // SERIALIZE ERROR MESSAGE
            await response.WriteAsync(result); // WRITE RESPONSE
        }
    }
}
