import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { runMigrations } from "./migrations";

// Usar el directorio de datos persistente
const dbPath = path.join(process.cwd(), "data", "database.db");

// Configurar SQLite con modo verbose para debugging
sqlite3.verbose();

// Crear conexión a la base de datos
export async function getDbConnection() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  return db;
}

export async function initDatabase() {
  try {
    await runMigrations();
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }
}
