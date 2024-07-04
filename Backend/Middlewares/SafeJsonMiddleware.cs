using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Backend.Middlewares
{
    // MIDDLEWARE CLASS FOR HANDLING JSON REQUEST AND RESPONSE
    public class SafeJsonMiddleware
    {
        // REQUEST DELEGATE TO HANDLE NEXT MIDDLEWARE IN PIPELINE AND JSON SERIALIZER OPTIONS
        private readonly RequestDelegate _next;
        private readonly JsonSerializerOptions _options;
        private readonly ILogger<SafeJsonMiddleware> _logger;

        public SafeJsonMiddleware(RequestDelegate next, ILogger<SafeJsonMiddleware> logger)
        {
            _next = next;
            _logger = logger;

            // SETTING UP JSON SERIALIZER OPTIONS
            _options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true,
                DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
            };
        }

        // METHOD TO HANDLE HTTP REQUEST
        public async Task InvokeAsync(HttpContext context)
        {
            // SKIP JSON VALIDATION FOR GET, POST, PUT, DELETE REQUESTS
            if (context.Request.Method.Equals("GET") || context.Request.Method.Equals("POST") || context.Request.Method.Equals("PUT") || context.Request.Method.Equals("DELETE"))
            {
                await _next(context); // PROCESS REQUEST AND PASS TO NEXT MIDDLEWARE
                return;
            }

            // CHECKING IF REQUEST CONTENT TYPE IS JSON
            if (context.Request.ContentType?.Contains("application/json") == true)
            {
                try
                {
                    context.Request.EnableBuffering(); // ENABLING BUFFERING TO READ REQUEST BODY
                    var requestBody = await new StreamReader(context.Request.Body).ReadToEndAsync(); // READING REQUEST BODY AS STRING
                    context.Request.Body.Position = 0; // RESET REQUEST BODY POSITION

                    // CHECKING IF REQUEST BODY IS EMPTY
                    if (string.IsNullOrEmpty(requestBody))
                    {
                        throw new Exception("Request body is empty");
                    }

                    JsonSerializer.Deserialize<object>(requestBody, _options); // CHECKING IF REQUEST BODY IS VALID JSON FORMAT
                }
                catch (JsonException jsonException)
                {
                    _logger.LogError(jsonException, "Invalid JSON format: {ErrorMessage}", jsonException.Message);
                    context.Response.StatusCode = 400; // RETURNING BAD REQUEST STATUS CODE
                    await context.Response.WriteAsync($"Invalid JSON format: {jsonException.Message}");
                    return; // STOP FURTHER REQUEST PROCESSING
                }

                await _next(context); // PROCESS REQUEST AND PASS TO NEXT MIDDLEWARE
            }

            var originalBodyStream = context.Response.Body; // SAVING ORIGINAL RESPONSE BODY STREAM

            // READING RESPONSE BODY AS STRING
            using (var memoryStream = new MemoryStream())
            {
                // REPLACING RESPONSE BODY STREAM WITH MEMORY STREAM
                context.Response.Body = memoryStream;
                await _next(context);

                // READING RESPONSE BODY AS STRING
                memoryStream.Seek(0, SeekOrigin.Begin);
                var responseBody = await new StreamReader(memoryStream).ReadToEndAsync();

                // CHECKING IF RESPONSE BODY IS VALID JSON FORMAT AND RETURNING BAD REQUEST IF NOT
                context.Response.Body = originalBodyStream;

                if (context.Response.StatusCode != StatusCodes.Status204NoContent)
                {
                    try
                    {
                        // CHECK IF RESPONSE BODY IS EMPTY
                        if (!string.IsNullOrWhiteSpace(responseBody))
                        {
                            JsonSerializer.Deserialize<object>(responseBody, _options); // CHECK IF RESPONSE BODY IS VALID JSON FORMAT
                        }
                        await context.Response.WriteAsync(responseBody); // WRITING RESPONSE BODY TO CLIENT
                    }
                    catch (JsonException jsonException)
                    {
                        _logger.LogError(jsonException, "Invalid JSON format: {ErrorMessage}", jsonException.Message);
                        context.Response.StatusCode = 500; // RETURNING INTERNAL SERVER ERROR STATUS CODE
                        await context.Response.WriteAsync($"Invalid JSON format in response: {jsonException.Message}");
                    }
                }
            }
        }
    }
}
