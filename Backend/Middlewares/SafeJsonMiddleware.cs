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

        public SafeJsonMiddleware(RequestDelegate next)
        {
            _next = next;

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
            // CHECKING IF REQUEST CONTENT TYPE IS JSON
            if (context.Request.ContentType == "application/json")
            {
                context.Request.EnableBuffering(); // ENABLING BUFFERING TO READ REQUEST BODY

                // READING REQUEST BODY AS STRING
                using (var reader = new StreamReader(context.Request.Body, Encoding.UTF8, true, 1024, true))
                {
                    var requestBody = await reader.ReadToEndAsync();
                    context.Request.Body.Position = 0;

                    // CHECKING IF REQUEST BODY IS VALID JSON FORMAT AND RETURNING BAD REQUEST IF NOT
                    try
                    {
                        JsonSerializer.Deserialize<object>(requestBody, _options);
                    }
                    catch (JsonException jsonException)
                    {
                        context.Response.StatusCode = StatusCodes.Status400BadRequest;
                        await context.Response.WriteAsync($"Invalid JSON format: {jsonException.Message}");
                        return;
                    }
                }
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
                    await context.Response.WriteAsync(responseBody);
                }
            }
        }
    }
}
