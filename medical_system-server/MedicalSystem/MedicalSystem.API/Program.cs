using FluentValidation;
using FluentValidation.AspNetCore;
using MedicalSystem.API.Services;
using MedicalSystem.API.Hubs;
using Minio;
using Microsoft.Extensions.Options;
using MedicalSystem.App.Contracts.Query;
using MedicalSystem.App.Contracts.Services;
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
builder.Services.AddScoped<IMedicineQuery, MedicineQuery>();
builder.Services.AddScoped<IStaffScheduleQuery, StaffScheduleQuery>();

builder.Services.AddScoped<IRoomStorage, RoomStorage>();
builder.Services.AddScoped<IVitalSignStorage, VitalSignStorage>();
builder.Services.AddScoped<IHospitalBedStorage, HospitalBedStorage>();
builder.Services.AddScoped<IBedOccupancyHistoryStorage, BedOccupancyHistoryStorage>();
builder.Services.AddScoped<IPrescriptionStorage, PrescriptionStorage>();
builder.Services.AddScoped<IPatientStorage, PatientStorage>();
builder.Services.AddScoped<IMedicalProblemStorage, MedicalProblemStorage>();
builder.Services.AddScoped<IEncounterStorage, EncounterStorage>();
builder.Services.AddScoped<IMedicineStorage, MedicineStorage>();
builder.Services.AddScoped<IShiftStorage, ShiftStorage>();
builder.Services.AddScoped<INotificationStorage, NotificationStorage>();
builder.Services.AddScoped<IDocumentStorage, DocumentStorage>();
builder.Services.AddScoped<IPatientCabinetStorage, PatientCabinetStorage>();


builder.Services.AddScoped<VitalSignService>();
builder.Services.AddScoped<PatientService>();
builder.Services.AddScoped<BedService>();
builder.Services.AddScoped<RoomService>();
builder.Services.AddScoped<WardStatisticsService>();
builder.Services.AddScoped<SearchService>();
builder.Services.AddScoped<EncounterService>();
builder.Services.AddScoped<MedicineService>();
builder.Services.AddScoped<StaffScheduleService>();
builder.Services.AddScoped<PatientCabinetService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

builder.Services.Configure<MinioSettings>(builder.Configuration.GetSection("Minio"));
builder.Services.AddSingleton<IMinioClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MinioSettings>>().Value;
    return new MinioClient()
        .WithEndpoint(settings.Endpoint)
        .WithCredentials(settings.AccessKey, settings.SecretKey)
        .WithSSL(settings.Secure)
        .Build();
});
builder.Services.AddScoped<IFileStorageService, MinioFileStorageService>();


builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<EmailService>();


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

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/notifications"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddSignalR().AddJsonProtocol(options =>
{
    options.PayloadSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddControllers()
    .AddJsonOptions(x =>
    {
        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    })
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

        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"Prescription\" ADD COLUMN IF NOT EXISTS \"MedicineId\" uuid NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"BedActionLogs\" ADD COLUMN IF NOT EXISTS \"PerformedByName\" text NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"Encounters\" ADD COLUMN IF NOT EXISTS \"FormData\" text NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"LabResults\" ADD COLUMN IF NOT EXISTS \"ResultData\" text NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"LabResults\" ADD COLUMN IF NOT EXISTS \"Comments\" text NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"LabResults\" ADD COLUMN IF NOT EXISTS \"PdfDocumentPath\" text NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"LabResults\" ADD COLUMN IF NOT EXISTS \"LaboratoryEmployeeId\" uuid NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"LabResults\" ADD COLUMN IF NOT EXISTS \"DateUpdated\" timestamp with time zone NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"Notifications\" ADD COLUMN IF NOT EXISTS \"Title\" text NOT NULL DEFAULT '';"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"Notifications\" ADD COLUMN IF NOT EXISTS \"PatientRecipientId\" uuid NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"Notifications\" ADD COLUMN IF NOT EXISTS \"RecipientType\" text NOT NULL DEFAULT 'Staff';"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"Notifications\" ALTER COLUMN \"RecipientId\" DROP NOT NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"PatientDocuments\" ADD COLUMN IF NOT EXISTS \"DocumentType\" text NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"PatientDocuments\" ADD COLUMN IF NOT EXISTS \"Content\" text NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"PatientDocuments\" ADD COLUMN IF NOT EXISTS \"DoctorName\" text NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"Users\" ADD COLUMN IF NOT EXISTS \"PatientId\" uuid NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"Users\" ADD COLUMN IF NOT EXISTS \"ResetToken\" text NULL;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE \"Users\" ADD COLUMN IF NOT EXISTS \"ResetTokenExpiry\" timestamp with time zone NULL;"); } catch { }

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
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();