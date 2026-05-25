import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.ts';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/infraguard.db';
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const client = createClient({
  url: `file:${dbPath}`,
});

export const db = drizzle(client, { schema });

export function runMigrations() {
  const sql = `
    CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      directory TEXT NOT NULL,
      scanner TEXT NOT NULL,
      status TEXT NOT NULL,
      started_at TEXT NOT NULL,
      completed_at TEXT,
      error TEXT,
      findings_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS findings (
      id TEXT PRIMARY KEY,
      scan_id TEXT NOT NULL REFERENCES scans(id),
      scanner TEXT NOT NULL,
      file TEXT NOT NULL,
      policy_id TEXT NOT NULL,
      policy_name TEXT NOT NULL,
      severity TEXT NOT NULL,
      resource TEXT NOT NULL,
      description TEXT NOT NULL,
      remediation TEXT NOT NULL,
      framework TEXT NOT NULL,
      compliance_ids TEXT NOT NULL,
      exception_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exceptions (
      id TEXT PRIMARY KEY,
      finding_id TEXT NOT NULL REFERENCES findings(id),
      status TEXT NOT NULL,
      reason TEXT NOT NULL,
      compensating_control TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      proposed_by TEXT NOT NULL,
      approved_by TEXT,
      approved_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL
    );
  `;

  client.execute(sql);
}
