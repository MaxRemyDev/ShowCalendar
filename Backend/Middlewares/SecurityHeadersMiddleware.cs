using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Backend.Middlewares
{
    public class SecurityHeadersMiddleware
    {
        // REQUEST DELEGATE TO HANDLE NEXT MIDDLEWARE IN PIPELINE
        private readonly RequestDelegate _next;

        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        // METHOD TO HANDLE HTTP REQUEST
        public async Task InvokeAsync(HttpContext context)
        {
            // SETTING SECURITY HEADERS TO ENHANCE APPLICATION SECURITY

            context.Response.Headers["X-Frame-Options"] = "DENY"; // PREVENT CLICKJACKING ATTACKS

            context.Response.Headers["X-Content-Type-Options"] = "nosniff"; // PREVENT MIME SNIFFING SECURITY RISK

            context.Response.Headers["X-XSS-Protection"] = "1; mode=block"; // ENABLE CROSS-SITE SCRIPTING (XSS) FILTER

            context.Response.Headers["Referrer-Policy"] = "no-referrer"; // CONTROL INFORMATION THAT CAN BE INCLUDED IN REFERER HEADER

            context.Response.Headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; object-src 'none';"; // DEFINE CONTENT SECURITY POLICY TO RESTRICTS RESOURCES SUCH AS SCRIPTS, IMAGES, ETC. TO BE LOADED ONLY FROM SAME ORIGIN

            // PASSING REQUEST TO NEXT MIDDLEWARE
            await _next(context);
        }
    }
}
