import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'tea_estate.db'));

export function initDb() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Employees table
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nic TEXT UNIQUE NOT NULL,
      date_of_birth DATE NOT NULL,
      join_date DATE NOT NULL,
      is_resident BOOLEAN NOT NULL,
      block_number TEXT,
      contact_number TEXT NOT NULL,
      emergency_contact TEXT NOT NULL,
      address TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Dependents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS dependents (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      name TEXT NOT NULL,
      relationship TEXT NOT NULL,
      date_of_birth DATE NOT NULL,
      nic TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    )
  `);

  // Tea records table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tea_records (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      date DATE NOT NULL,
      weight DECIMAL(10,2) NOT NULL,
      verified_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees (id),
      FOREIGN KEY (verified_by) REFERENCES users (id)
    )
  `);

  // Salary records table
  db.exec(`
    CREATE TABLE IF NOT EXISTS salary_records (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      week_starting DATE NOT NULL,
      week_ending DATE NOT NULL,
      days_worked INTEGER NOT NULL,
      average_weight DECIMAL(10,2) NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    )
  `);
}

export default db;