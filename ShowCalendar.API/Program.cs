using DotNetEnv;
using ShowCalendar.API.Extensions;
using ShowCalendar.API.Middleware;

Env.Load(); // LOAD ENVIRONMENT VARIABLES

// BUILDER
var builder = WebApplication.CreateBuilder(args);

// SERVICES
builder.Services.AddControllers();
builder.Services.AddCalendarServices(builder.Configuration); // REGISTER CALENDAR SERVICES

// API DOCUMENTATION
builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();

// CREATE APPLICATION
var app = builder.Build();

// SWAGGER UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "ShowCalendar API V1");
            c.RoutePrefix = string.Empty;  // SET SWAGGER UI AT APP ROOT
        }
    );
}

// MIDDLEWARE
app.UseGlobalExceptionHandler(app.Environment.IsDevelopment()); 
app.UseHttpsRedirection();
app.UseAuthorization();

// ROUTES
app.MapControllers();

// RUN APPLICATION
app.Run();
