import { db } from '../db/index.ts';
import { auditLogs } from '../db/schema.ts';
import { v4 as uuid } from 'uuid';

export async function logAudit(action: string, entityType: string, entityId: string, details?: Record<string, unknown>) {
  await db.insert(auditLogs).values({
    id: uuid(),
    action,
    entityType,
    entityId,
    details: details ? JSON.stringify(details) : null,
    createdAt: new Date().toISOString(),
  });
}

export async function getAuditLogs() {
  return db.select().from(auditLogs).orderBy(auditLogs.createdAt).all();
}
