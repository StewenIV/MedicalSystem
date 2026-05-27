using MedicalSystem.Data.DbContext;
using MedicalSystem.Data.DataGeneration;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore; // Добавляем пространство имен Scalar

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// Встроенная поддержка генерации OpenAPI-спецификации (.NET 9+)
builder.Services.AddOpenApi();

// Регистрация DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<MedicalSystemDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddControllers();

var app = builder.Build();

// --- БЛОК ЗАПОЛНЕНИЯ ДАННЫМИ ---
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

// Настройка окружения для разработки
if (app.Environment.IsDevelopment())
{
    // 1. Включаем генерацию JSON-документа по стандарту OpenAPI (доступен по адресу /openapi/v1.json)
    app.MapOpenApi();
    
    // 2. Подключаем красивый интерфейс Scalar (доступен по адресу /scalar/v1)
    app.MapScalarApiReference(); 
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();