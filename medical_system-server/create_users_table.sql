CREATE TABLE IF NOT EXISTS "Users" (
    "Id" uuid NOT NULL,
    "Login" character varying(100) NOT NULL,
    "PasswordHash" text NOT NULL,
    "Role" character varying(50) NOT NULL,
    "DisplayName" character varying(200) NULL,
    "MedicalStaffId" uuid NULL,
    "CreatedAt" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "IX_Users_Login" ON "Users" ("Login");
CREATE INDEX IF NOT EXISTS "IX_Users_MedicalStaffId" ON "Users" ("MedicalStaffId");

SELECT 'Users table created successfully' AS result;
