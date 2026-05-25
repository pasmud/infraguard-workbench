import { db } from '../db/index.ts';
import { scans, findings } from '../db/schema.ts';
import { v4 as uuid } from 'uuid';
import type { Finding, Scan, ScannerType } from '../types/index.ts';
import { runCheckov, isCheckovAvailable } from './checkov.ts';
import { runTrivy, isTrivyAvailable } from './trivy.ts';
import { getMockFindings } from './mock.ts';
import { logAudit } from './audit.ts';
import { eq } from 'drizzle-orm';

export async function createScan(directory: string, scanner: ScannerType): Promise<Scan> {
  const id = uuid();
  const now = new Date().toISOString();
  const scan: Scan = {
    id,
    directory,
    scanner,
    status: 'running',
    startedAt: now,
    completedAt: null,
    error: null,
    findingsCount: 0,
  };

  await db.insert(scans).values({
    id: scan.id,
    directory: scan.directory,
    scanner: scan.scanner,
    status: scan.status,
    startedAt: scan.startedAt,
    completedAt: scan.completedAt,
    error: scan.error,
    findingsCount: scan.findingsCount,
  });

  await logAudit('scan.created', 'scan', id, { directory, scanner });
  return scan;
}

export async function runScan(directory: string, scanner: ScannerType): Promise<{ scan: Scan; findings: Finding[] }> {
  const scan = await createScan(directory, scanner);
  let scanFindings: Finding[] = [];

  try {
    if (scanner === 'mock' || (!isCheckovAvailable().available && !isTrivyAvailable().available)) {
      scanFindings = getMockFindings(scan.id);
    } else if (scanner === 'checkov' || (scanner === 'trivy' && !isTrivyAvailable().available)) {
      if (scanner === 'checkov' || !isCheckovAvailable().available) {
        scanFindings = runCheckov(directory, scan.id);
      }
    } else if (scanner === 'trivy' || !isCheckovAvailable().available) {
      scanFindings = runTrivy(directory, scan.id);
    }

    for (const f of scanFindings) {
      await db.insert(findings).values({
        id: f.id,
        scanId: f.scanId,
        scanner: f.scanner,
        file: f.file,
        policyId: f.policyId,
        policyName: f.policyName,
        severity: f.severity,
        resource: f.resource,
        description: f.description,
        remediation: f.remediation,
        framework: f.framework,
        complianceIds: JSON.stringify(f.complianceIds),
        exceptionId: f.exceptionId,
        createdAt: f.createdAt,
      });
    }

    const completedScan: Scan = {
      ...scan,
      status: 'completed',
      completedAt: new Date().toISOString(),
      findingsCount: scanFindings.length,
    };

    await db.update(scans)
      .set({ status: 'completed', completedAt: completedScan.completedAt, findingsCount: completedScan.findingsCount })
      .where(eq(scans.id, scan.id));

    await logAudit('scan.completed', 'scan', scan.id, { findingsCount: scanFindings.length });
    return { scan: completedScan, findings: scanFindings };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const failedScan: Scan = {
      ...scan,
      status: 'failed',
      completedAt: new Date().toISOString(),
      error: errorMessage,
    };

    await db.update(scans)
      .set({ status: 'failed', completedAt: failedScan.completedAt, error: failedScan.error })
      .where(eq(scans.id, scan.id));

    await logAudit('scan.failed', 'scan', scan.id, { error: errorMessage });
    return { scan: failedScan, findings: [] };
  }
}

export async function getScans() {
  return db.select().from(scans).orderBy(scans.startedAt).all();
}

export async function getFindingsForScan(scanId: string) {
  return db.select().from(findings).where(eq(findings.scanId, scanId)).all();
}

export async function getAllFindings() {
  return db.select().from(findings).orderBy(findings.createdAt).all();
}

export async function getFindingById(findingId: string) {
  const rows = await db.select().from(findings).where(eq(findings.id, findingId)).all();
  return rows[0] || null;
}
