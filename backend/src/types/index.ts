export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ScannerType = 'checkov' | 'trivy' | 'mock';
export type ScanStatus = 'running' | 'completed' | 'failed';
export type ExceptionStatus = 'proposed' | 'approved' | 'rejected' | 'expired';
export type Framework = 'terraform' | 'kubernetes' | 'dockerfile' | 'helm';

export interface Scan {
  id: string;
  directory: string;
  scanner: ScannerType;
  status: ScanStatus;
  startedAt: string;
  completedAt: string | null;
  error: string | null;
  findingsCount: number;
}

export interface Finding {
  id: string;
  scanId: string;
  scanner: string;
  file: string;
  policyId: string;
  policyName: string;
  severity: Severity;
  resource: string;
  description: string;
  remediation: string;
  framework: Framework;
  complianceIds: string[];
  exceptionId: string | null;
  createdAt: string;
}

export interface Exception {
  id: string;
  findingId: string;
  status: ExceptionStatus;
  reason: string;
  compensatingControl: string;
  expiryDate: string;
  proposedBy: string;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string | null;
  createdAt: string;
}

export interface ScannerConfig {
  checkovAvailable: boolean;
  trivyAvailable: boolean;
  checkovVersion: string | null;
  trivyVersion: string | null;
}
