using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using dotenv.net;
using System;

// LOAD ENVIRONMENT VARIABLES FROM .ENV FILE
DotEnv.Load();

// CREATE WEB APPLICATION BUILDER
var builder = WebApplication.CreateBuilder(args);

// ADD DATABASE CONTEXT WITH MYSQL CONFIGURATION WITH ENVIRONMENT VARIABLES
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(Environment.GetEnvironmentVariable("DB_CONNECTION_STRING"),
    new MySqlServerVersion(new Version(8, 0, 21))));

// ADD SERVICE CONTROLLERS
builder.Services.AddControllers();

// ADD AUTHORIZATION POLICY
builder.Services.AddAuthorization();

// BUILD WEB APPLICATION
var app = builder.Build();

// CONFIGURE ERROR HANDLING FOR NON-DEVELOPMENT ENVIRONMENTS
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// ENABLE HTTPS REDIRECTION
app.UseHttpsRedirection();

// ENABLE ROUTING
app.UseRouting();

// ENABLE AUTHORIZATION
app.UseAuthorization();

// DEFINE CONTROLLER ROUTE MAPPING (CONTROLLER NAME, DEFAULT ACTION, OPTIONAL ID)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

// RUN WEB APPLICATION
app.Run();
