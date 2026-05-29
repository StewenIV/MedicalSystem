using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.App.Services;
using MedicalSystem.Data.DataGeneration;
using MedicalSystem.Data.DbContext;
using MedicalSystem.Data.Queries;
using MedicalSystem.Data.Storages;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);


var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "FrontendCors";
builder.Services.AddCors(options =>
    options.AddPolicy(CorsPolicy, policy =>
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()));


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<MedicalSystemDbContext>(options =>
    options.UseNpgsql(connectionString));


builder.Services.AddScoped<IPatientQuery, PatientQuery>();

builder.Services.AddScoped<PatientService>();
builder.Services.AddScoped<IVitalSignStorage, VitalSignStorage>();

builder.Services.AddScoped<VitalSignService>();


builder.Services.AddControllers();


builder.Services.AddOpenApi();


var app = builder.Build();


using (var scope = app.Services.CreateScope())

{
    var services = scope.ServiceProvider;

    var logger = services.GetRequiredService<ILogger<Program>>();

    var context = services.GetRequiredService<MedicalSystemDbContext>();


    try

    {
        await context.Database.MigrateAsync();

        await DataSeeder.SeedAsync(context, logger);
    }

    catch (Exception ex)

    {
        logger.LogError(ex, "Произошла ошибка при миграции или заполнении базы данных.");
    }
}


if (app.Environment.IsDevelopment())

{
    app.MapOpenApi();


    app.MapScalarApiReference(options =>
    {
        options
            .WithTitle("Medical System API")
            .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}


app.UseHttpsRedirection();


app.UseCors(CorsPolicy);

app.UseAuthorization();


app.MapControllers();


app.Run();