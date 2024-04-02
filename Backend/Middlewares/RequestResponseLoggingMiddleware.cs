using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Middlewares
{
    // MIDDLEWARE CLASS FOR LOGGING
    public class RequestResponseLoggingMiddleware
    {
        // REQUEST DELEGATE TO HANDLE NEXT MIDDLEWARE IN PIPELINE AND LOGGER FOR LOGGING
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestResponseLoggingMiddleware> _logger;

        // CONSTRUCTOR FOR DEPENDENCY INJECTION
        public RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // CLONE ORIGINAL RESPONSE BODY STREAM TO INTERCEPT RESPONSE
                var originalBodyStream = context.Response.Body;
                using var responseBodyStream = new MemoryStream();
                context.Response.Body = responseBodyStream;

                await _next(context); // CALL NEXT MIDDLEWARE IN PIPELINE

                // LOG REQUEST AND RESPONSE
                responseBodyStream.Seek(0, SeekOrigin.Begin);
                var responseBodyText = await new StreamReader(responseBodyStream).ReadToEndAsync();
                responseBodyStream.Seek(0, SeekOrigin.Begin);
                _logger.LogInformation($"Response: {responseBodyText}");

                await responseBodyStream.CopyToAsync(originalBodyStream); // COPY RESPONSE STREAM TO ORIGINAL STREAM
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while logging the request and response. {ErrorMessage}", ex.Message);
                throw; // PROPAGATE EXCEPTION IF RESPONSE HAS ALREADY STARTED
            }
        }
    }
}
