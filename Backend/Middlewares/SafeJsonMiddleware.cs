using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Backend.Middlewares
{
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
                string requestBody;

                context.Request.EnableBuffering(); // ENABLING BUFFERING TO READ REQUEST BODY

                // READING REQUEST BODY AS STRING
                using (var reader = new StreamReader(context.Request.Body, Encoding.UTF8, true, 1024, true))
                {
                    requestBody = await reader.ReadToEndAsync();
                    context.Request.Body.Position = 0;
                }

                try
                {
                    var deserializedBody = JsonSerializer.Deserialize<object>(requestBody, _options); // ATTEMPTING TO DESERIALIZE REQUEST BODY
                }
                catch (JsonException jsonException)
                {
                    Console.WriteLine(jsonException);

                    // RETURNING BAD REQUEST IF JSON IS INVALID
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    await context.Response.WriteAsync($"Invalid JSON format: {jsonException.Message}");
                    return;
                }
            }

            // STORING ORIGINAL RESPONSE BODY STREAM
            var originalBodyStream = context.Response.Body;

            // CREATING A NEW MEMORY STREAM FOR RESPONSE
            using (var memoryStream = new MemoryStream())
            {
                context.Response.Body = memoryStream;

                await _next(context); // PASSING REQUEST TO NEXT MIDDLEWARE

                // READING RESPONSE BODY FROM MEMORY STREAM
                memoryStream.Seek(0, SeekOrigin.Begin);
                var responseBody = await new StreamReader(memoryStream).ReadToEndAsync();
                var responseObj = JsonSerializer.Deserialize<object>(responseBody, _options);

                // WRITING MODIFIED RESPONSE BACK TO ORIGINAL STREAM
                context.Response.Body = originalBodyStream;
                await context.Response.WriteAsync(JsonSerializer.Serialize(responseObj, _options));
            }
        }
    }
}
