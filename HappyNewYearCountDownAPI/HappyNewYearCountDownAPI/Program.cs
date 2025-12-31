using dotenv.net;
using HappyNewYearCountDownAPI;
using HealthChecks.ApplicationStatus.DependencyInjection;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Serilog;

DotEnv.Load();
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSignalR();
builder.Services.AddCors();
builder.Services.AddHealthChecks().AddApplicationStatus();
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

var app = builder.Build();


app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true)
    .AllowCredentials());

app.UseHttpsRedirection();

app.MapHub<ChatHub>("chat-hub");

app.MapHealthChecks("/health", new HealthCheckOptions {
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.Run();
