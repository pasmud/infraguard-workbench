import { db } from '../db/index.ts';
import { exceptions, findings } from '../db/schema.ts';
import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';
import type { Exception, ExceptionStatus } from '../types/index.ts';
import { logAudit } from './audit.ts';

export async function createException(
  findingId: string,
  reason: string,
  compensatingControl: string,
  expiryDate: string,
  proposedBy: string
): Promise<Exception> {
  const now = new Date().toISOString();
  const exception: Exception = {
    id: uuid(),
    findingId,
    status: 'proposed',
    reason,
    compensatingControl,
    expiryDate,
    proposedBy,
    approvedBy: null,
    approvedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(exceptions).values({
    id: exception.id,
    findingId: exception.findingId,
    status: exception.status,
    reason: exception.reason,
    compensatingControl: exception.compensatingControl,
    expiryDate: exception.expiryDate,
    proposedBy: exception.proposedBy,
    approvedBy: exception.approvedBy,
    approvedAt: exception.approvedAt,
    createdAt: exception.createdAt,
    updatedAt: exception.updatedAt,
  });

  await db.update(findings)
    .set({ exceptionId: exception.id })
    .where(eq(findings.id, findingId));

  await logAudit('exception.created', 'exception', exception.id, {
    findingId,
    reason,
    expiryDate,
    proposedBy,
  });

  return exception;
}

export async function updateExceptionStatus(id: string, status: ExceptionStatus, approvedBy?: string): Promise<Exception | null> {
  const existing = await db.select().from(exceptions).where(eq(exceptions.id, id)).all();
  if (!existing.length) return null;

  const now = new Date().toISOString();
  const updates: Record<string, string | null> = {
    status,
    updatedAt: now,
  };

  if (status === 'approved' && approvedBy) {
    updates.approvedBy = approvedBy;
    updates.approvedAt = now;
  }

  await db.update(exceptions).set(updates).where(eq(exceptions.id, id));

  await logAudit(`exception.${status}`, 'exception', id, { approvedBy });

  const updated = await db.select().from(exceptions).where(eq(exceptions.id, id)).all();
  return updated[0] as unknown as Exception || null;
}

export async function getExceptions() {
  const rows = await db.select().from(exceptions).orderBy(exceptions.createdAt).all();
  return rows.map((r) => ({
    ...r,
  })) as unknown as Exception[];
}

export async function getExceptionById(id: string) {
  const rows = await db.select().from(exceptions).where(eq(exceptions.id, id)).all();
  return rows[0] as unknown as Exception || null;
}
