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
            // LOG REQUEST INFORMATION
            var requestInfo = $"Incoming request: {context.Request.Method} {context.Request.Path}";

            // CLONE ORIGINAL RESPONS BODY STREAM TO INTERCEPT RESPONSE
            var originalBodyStream = context.Response.Body;
            using var responseBodyStream = new MemoryStream();
            context.Response.Body = responseBodyStream;

            // PROCESS REQUEST PIPELINE
            await _next(context);

            // READ INTERCEPTED RESPONSE STREAM
            responseBodyStream.Seek(0, SeekOrigin.Begin);
            var responseBodyText = await new StreamReader(responseBodyStream).ReadToEndAsync();
            responseBodyStream.Seek(0, SeekOrigin.Begin);

            // LOG RESPONSE INFORMATION
            var responseInfo = $"Outgoing response: {context.Response.StatusCode}";
            var responseBodyInfo = $"Response body: {responseBodyText}";

            // COMBINE ALL LOG INFORMATION AND LOG IT AS A SINGLE ENTRY
            var logEntry = new StringBuilder()
                .AppendLine(requestInfo)
                .AppendLine(responseInfo)
                .AppendLine(responseBodyInfo)
                .ToString();

            _logger.LogInformation(logEntry);

            // COPY INTERCEPTED RESPONSE STREAM BACK TO ORIGINAL STREAM
            await responseBodyStream.CopyToAsync(originalBodyStream);
        }
    }
}
