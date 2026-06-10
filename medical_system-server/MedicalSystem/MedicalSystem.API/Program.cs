using FluentValidation;
using FluentValidation.AspNetCore;
using MedicalSystem.API.Services;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Storage;
using MedicalSystem.App.Services;
using MedicalSystem.App.Validators;
using MedicalSystem.Data.DataGeneration;
using MedicalSystem.Data.DbContext;
using MedicalSystem.Data.Queries;
using MedicalSystem.Data.Storages;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;
using System.Text.Json.Serialization;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);


var builder = WebApplication.CreateBuilder(args);


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<MedicalSystemDbContext>(options =>
    options.UseNpgsql(connectionString));


builder.Services.AddScoped<IPatientQuery, PatientQuery>();
builder.Services.AddScoped<IBedQuery, BedQuery>();
builder.Services.AddScoped<IRoomQuery, RoomQuery>();
builder.Services.AddScoped<IWardStatisticsQuery, WardStatisticsQuery>();
builder.Services.AddScoped<IPatientSearchQuery, PatientSearchQuery>();

builder.Services.AddScoped<IRoomStorage, RoomStorage>();
builder.Services.AddScoped<IVitalSignStorage, VitalSignStorage>();
builder.Services.AddScoped<IHospitalBedStorage, HospitalBedStorage>();
builder.Services.AddScoped<IBedOccupancyHistoryStorage, BedOccupancyHistoryStorage>();
builder.Services.AddScoped<IPrescriptionStorage, PrescriptionStorage>();
builder.Services.AddScoped<IPatientStorage, PatientStorage>();
builder.Services.AddScoped<IMedicalProblemStorage, MedicalProblemStorage>();
builder.Services.AddScoped<IEncounterStorage, EncounterStorage>();

builder.Services.AddScoped<VitalSignService>();
builder.Services.AddScoped<PatientService>();
builder.Services.AddScoped<BedService>();
builder.Services.AddScoped<RoomService>();
builder.Services.AddScoped<WardStatisticsService>();
builder.Services.AddScoped<SearchService>();
builder.Services.AddScoped<EncounterService>();


builder.Services.AddScoped<AuthService>();


var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = builder.Configuration["Jwt:Audience"]!;

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();


builder.Services.AddControllers()
    .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles)
    .AddFluentValidation(fv =>
    {
        fv.RegisterValidatorsFromAssemblyContaining<AssignPatientRequestDtoValidator>();
        fv.DisableDataAnnotationsValidation = true;
    });

builder.Services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(e => e.Value?.Errors.Count > 0)
            .SelectMany(e => e.Value!.Errors.Select(err =>
                string.IsNullOrWhiteSpace(err.ErrorMessage)
                    ? err.Exception?.Message ?? "Ошибка валидации"
                    : err.ErrorMessage))
            .ToList();

        var result = new
        {
            message = "Ошибка валидации данных.",
            errors
        };

        return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(result);
    };
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000",
                "http://localhost:3001"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


builder.Services.AddOpenApi();


var app = builder.Build();


using (var scope = app.Services.CreateScope())

{
    var services = scope.ServiceProvider;

    var logger = services.GetRequiredService<ILogger<Program>>();

    var context = services.GetRequiredService<MedicalSystemDbContext>();


    try

    {
        // await context.Database.MigrateAsync();

        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"BedActionLogs\" ADD COLUMN IF NOT EXISTS \"PerformedByName\" text NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"Encounters\" ADD COLUMN IF NOT EXISTS \"FormData\" text NULL;"); } catch { }

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

app.UseCors();

app.UseAuthentication();

app.UseAuthorization();


app.MapControllers();


app.Run();