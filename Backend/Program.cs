using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Microsoft.AspNetCore.Builder;
using dotenv.net;
using AutoMapper;
using System;
using System.Text;
using Backend.Interfaces;
using Backend.Services;
using Backend.Services.Extensions;
using Microsoft.IdentityModel.Tokens;
using Backend.Middlewares;
using AspNetCoreRateLimit;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.OpenApi.Models;

// LOAD ENVIRONMENT VARIABLES FROM .ENV FILE
DotEnv.Load();

// CREATE WEB APPLICATION BUILDER
var builder = WebApplication.CreateBuilder(args);

// CONFIGURE SERVICES CORS POLICY
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("https://localhost:7201", "http://localhost:5113", "http://localhost:3000", "https://showcalendar.com")
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
builder.Services.AddJwtAuthentication(builder.Configuration);

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
builder.Services.AddScoped<IEnvironmentService, EnvironmentService>();

// SERVICES FOR CONTROLLING CONTROLLERS AND SWAGGER/OPENAPI
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ShowCalendar Backend API", Version = "v0.0.1" });
});

// BUILD WEB APPLICATION
var app = builder.Build();

// CONFIGURE DEVELOPMENT ENVIRONMENT SWAGGER AND SWAGGER UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ShowCalendar API V1");
        c.RoutePrefix = string.Empty;
    });
}

// CONFIGURE DEVELOPMENT ENVIRONMENT SEEDING OF DATABASE WITH INITIAL DATA
// RUN : "docker-compose up -d" TO CREATE TEST DATABASE WITH DOCKER-COMPOSE AND FOR ENTER SCHEMA "dotnet run" TO SEED DATABASE
// RUN : "dotnet run --environment test" | "dotnet run" FOR SWITCHING TO TEST ENVIRONMENT OR NORMAL DEVELOPMENT
if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Test"))
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var dbContext = services.GetRequiredService<ApplicationDbContext>();

        if (dbContext.Database.IsRelational())
        {
            dbContext.Database.Migrate(); // APPLY MIGRATION TO DATABASE
        }

        SeedData.Initialize(services); // SEED DATA TO DATABASE
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
app.UseMiddleware<ErrorHandlerMiddleware>();
app.UseMiddleware<RequestResponseLoggingMiddleware>();
app.UseMiddleware<SafeJsonMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();

// CONFIGURE AUTHENTICATION AND AUTHORIZATION
app.UseAuthentication();
app.UseAuthorization();

// CONFIGURE ENDPOINTS
app.MapControllers();

// RUN WEB APPLICATION
app.Run();

public partial class Program
{
    protected Program() { }
}
