using Microsoft.AspNetCore.Http;
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

        public ErrorHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
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
                // SETTING UP RESPONSE CONTEXT IN CASE OF AN ERROR
                var response = context.Response;
                response.ContentType = "application/json";

                // SWITCHING ERROR TYPES TO DETERMINE CORRECT STATUS CODE
                response.StatusCode = error switch
                {
                    KeyNotFoundException => (int)HttpStatusCode.NotFound, // 404 ERROR FOR NOT FOUND
                    InvalidOperationException => (int)HttpStatusCode.Conflict, // 409 ERROR FOR OPERATION CONFLICT
                    _ => (int)HttpStatusCode.InternalServerError, // 500 ERROR FOR ANY OTHER INTERNAL SERVER ERROR
                };

                // SERIALIZING ERROR MESSAGE TO JSON FORMAT
                var result = JsonSerializer.Serialize(new { message = error.Message }); //! old version: error?.Message

                // WRITING ERROR RESPONSE BACK TO CLIENT
                await response.WriteAsync(result);
            }
        }
    }
}
