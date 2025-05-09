import { getDbConnection } from "../db";

interface Migration {
  name: string;
  up: string;
  down: string;
}

interface MigrationRecord {
  name: string;
  executed_at: string;
}

const migrations: Migration[] = [
  {
    name: "001_create_users_table",
    up: `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
    down: `DROP TABLE IF EXISTS users`,
  },
  {
    name: "002_add_role_to_users",
    up: `ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`,
    down: `
      CREATE TABLE users_backup AS SELECT id, name, email, created_at FROM users;
      DROP TABLE users;
      ALTER TABLE users_backup RENAME TO users;
    `,
  },
];

// Tabla para trackear las migraciones ejecutadas
const createMigrationsTable = `
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export async function runMigrations() {
  console.log("Running migrations...");
  const db = await getDbConnection();

  // Crear tabla de migraciones si no existe
  db.exec(createMigrationsTable);

  // Obtener migraciones ya ejecutadas
  const executedMigrations = await db.all("SELECT name FROM migrations");
  const executedMigrationNames = executedMigrations.map(
    (row: MigrationRecord) => row.name
  );

  // Ejecutar migraciones pendientes
  for (const migration of migrations) {
    if (!executedMigrationNames.includes(migration.name)) {
      console.log(`Running migration: ${migration.name}`);

      try {
        // Iniciar transacción
        db.exec("BEGIN TRANSACTION");

        // Ejecutar migración
        db.exec(migration.up);

        // Registrar migración como ejecutada
        await db.run(
          "INSERT INTO migrations (name) VALUES (?)",
          migration.name
        );

        // Confirmar transacción
        db.exec("COMMIT");

        console.log(`Migration completed: ${migration.name}`);
      } catch (error) {
        // Revertir en caso de error
        db.exec("ROLLBACK");
        console.error(`Error in migration ${migration.name}:`, error);
        throw error;
      }
    }
  }

  console.log("All migrations completed");
}

export async function rollbackMigration() {
  // Obtener última migración ejecutada
  const db = await getDbConnection();
  const lastMigration = (await db.get(`
    SELECT name FROM migrations 
    ORDER BY executed_at DESC LIMIT 1
  `)) as MigrationRecord;

  if (!lastMigration) {
    console.log("No migrations to rollback");
    return;
  }

  const migration = migrations.find((m) => m.name === lastMigration.name);

  if (!migration) {
    throw new Error(`Migration ${lastMigration.name} not found`);
  }

  console.log(`Rolling back migration: ${migration.name}`);

  try {
    db.exec("BEGIN TRANSACTION");

    // Ejecutar rollback
    db.exec(migration.down);

    // Eliminar registro de la migración
    await db.run("DELETE FROM migrations WHERE name = ?", migration.name);

    db.exec("COMMIT");

    console.log(`Rollback completed: ${migration.name}`);
  } catch (error) {
    db.exec("ROLLBACK");
    console.error(`Error in rollback ${migration.name}:`, error);
    throw error;
  }
}
