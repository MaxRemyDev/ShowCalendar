using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace ShowCalendar.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;
        private readonly bool _isDevelopment;

        // CONSTRUCTOR
        public GlobalExceptionMiddleware(
            RequestDelegate next, 
            ILogger<GlobalExceptionMiddleware> logger,
            bool isDevelopment)
        {
            _next = next;
            _logger = logger;
            _isDevelopment = isDevelopment;
        }

        // INVOKE ASYNC
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        // HANDLE EXCEPTION ASYNC
        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            var response = new
            {
                status = context.Response.StatusCode,
                error = exception.Message,
                stackTrace = _isDevelopment ? exception.StackTrace : null
            };

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };

            var json = JsonSerializer.Serialize(response, options);
            return context.Response.WriteAsync(json);
        }
    }

    // EXTENSION METHOD TO MAKE IT EASY TO ADD TO THE PIPELINE
    public static class GlobalExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandler(
            this IApplicationBuilder builder,
            bool isDevelopment)
        {
            return builder.UseMiddleware<GlobalExceptionMiddleware>(isDevelopment);
        }
    }
} 
