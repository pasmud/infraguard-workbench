import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const scans = sqliteTable('scans', {
  id: text('id').primaryKey(),
  directory: text('directory').notNull(),
  scanner: text('scanner').notNull(),
  status: text('status').notNull(),
  startedAt: text('started_at').notNull(),
  completedAt: text('completed_at'),
  error: text('error'),
  findingsCount: integer('findings_count').notNull().default(0),
});

export const findings = sqliteTable('findings', {
  id: text('id').primaryKey(),
  scanId: text('scan_id').notNull().references(() => scans.id),
  scanner: text('scanner').notNull(),
  file: text('file').notNull(),
  policyId: text('policy_id').notNull(),
  policyName: text('policy_name').notNull(),
  severity: text('severity').notNull(),
  resource: text('resource').notNull(),
  description: text('description').notNull(),
  remediation: text('remediation').notNull(),
  framework: text('framework').notNull(),
  complianceIds: text('compliance_ids').notNull(),
  exceptionId: text('exception_id'),
  createdAt: text('created_at').notNull(),
});

export const exceptions = sqliteTable('exceptions', {
  id: text('id').primaryKey(),
  findingId: text('finding_id').notNull().references(() => findings.id),
  status: text('status').notNull(),
  reason: text('reason').notNull(),
  compensatingControl: text('compensating_control').notNull(),
  expiryDate: text('expiry_date').notNull(),
  proposedBy: text('proposed_by').notNull(),
  approvedBy: text('approved_by'),
  approvedAt: text('approved_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  details: text('details'),
  createdAt: text('created_at').notNull(),
});
