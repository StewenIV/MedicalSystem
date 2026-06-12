
using System;
using Npgsql;

class Program
{
    static void Main()
    {
        string connStr = "Host=localhost;Port=5432;Database=medicalsystem;Username=medicalsystem;Password=medicalsystem123";
        using var conn = new NpgsqlConnection(connStr);
        conn.Open();
        
        string sql = @"
            INSERT INTO ""__EFMigrationsHistory"" (""MigrationId"", ""ProductVersion"") VALUES 
            ('20260604145807_AddUserTableAndOtherNeadedEntity', '8.0.0'),
            ('20260605083156_Add', '8.0.0'),
            ('20260610164252_AddEncounterFormData', '8.0.0'),
            ('20260610180316_IncreaseEncounterTextFields', '8.0.0')
            ON CONFLICT (""MigrationId"") DO NOTHING;
        ";
        
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        Console.WriteLine("Done inserting into __EFMigrationsHistory");
    }
}

