using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Microsoft.AspNetCore.Builder;
using dotenv.net;
using AutoMapper;
using System;
using System.Text;
using Backend.Interfaces;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Backend.Middlewares;
using AspNetCoreRateLimit;
using Newtonsoft.Json;

// LOAD ENVIRONMENT VARIABLES FROM .ENV FILE
DotEnv.Load();

// CREATE WEB APPLICATION BUILDER
var builder = WebApplication.CreateBuilder(args);

// CONFIGURE SERVICES CORS POLICY
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("https://localhost:7201", "http://localhost:5113", "https://showcalendar.com")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

// CONFIGURE SERVICES MIDDLEWARE FOR RATE LIMITING POLICIES AND SERVICES
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.Configure<IpRateLimitPolicies>(builder.Configuration.GetSection("IpRateLimitPolicies"));
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

// CONFIGURE SERVICE DATABASE CONTEXT
var connectionString = builder.Environment.IsDevelopment()
    ? Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
    : Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_TEST");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 21))));


// CONFIGURE SERVICE AUTHENTICATION
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET") ?? throw new InvalidOperationException("JWT Secret is not set"))),
            ValidateIssuer = false,
            ValidateAudience = false,
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsync(JsonConvert.SerializeObject(new
                {
                    error = "An authentication error has occurred"
                }));
            },
        };
    });

// CONFIGURE SERVICES AUTHORIZATION AND CONTROLLERS WITH AUTOMAPPER
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(Backend.Mappings.AutoMapperProfile));

// CONFIGURE SERVICES DEPENDENCY INJECTION
builder.Services.AddScoped<IAuthService, AuthenticationService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICalendarService, CalendarService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// BUILD WEB APPLICATION
var app = builder.Build();

// CONFIGURE DEVELOPMENT ENVIRONMENT SEEDING OF DATABASE WITH INITIAL DATA
// CLI for switching to test environment: "dotnet run --environment test" | "dotnet run" for switch to normal development
if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Test"))
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        SeedData.Initialize(services);
    }
}

// CONFIGURE ERROR HANDLING FOR NON-DEVELOPMENT ENVIRONMENTS
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
// ENABLE HTTPS REDIRECTION AND ENABLE ROUTING
app.UseHttpsRedirection();
app.UseRouting();

// CONFIGURE MIDDLEWARES FOR RATE LIMITING, JSON PARSING, SECURITY HEADERS AND ERROR HANDLING
app.UseCors("CorsPolicy");
app.UseIpRateLimiting();
app.UseMiddleware<SafeJsonMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseMiddleware<ErrorHandlerMiddleware>();

// CONFIGURE AUTHENTICATION AND AUTHORIZATION
app.UseAuthentication();
app.UseAuthorization();

// CONFIGURE ENDPOINTS
app.MapControllers();

// RUN WEB APPLICATION
app.Run();
