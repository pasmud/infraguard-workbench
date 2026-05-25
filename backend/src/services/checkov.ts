import { execSync } from 'child_process';
import type { Finding, ScannerType } from '../types/index.ts';

interface CheckovResult {
  check_type: string;
  results: {
    passed_checks: unknown[];
    failed_checks: Array<{
      file: string;
      check_id: string;
      check_name: string;
      severity: string;
      resource: string;
      guideline: string;
      bc_check_id?: string;
    }>;
  };
}

const COMPLIANCE_MAP: Record<string, string[]> = {
  CKV_AWS_18: ['CIS-3.3', 'PCI-1.2'],
  CKV_AWS_20: ['CIS-3.4', 'NIST-SI-12'],
  CKV_AWS_21: ['CIS-3.5', 'PCI-1.3'],
  CKV_AWS_23: ['CIS-3.6'],
  CKV_AWS_24: ['CIS-3.7', 'NIST-AC-3'],
  CKV2_AWS_6: ['CIS-3.8'],
  CKV_K8S_1: ['CIS-5.1', 'NIST-SC-4'],
  CKV_K8S_2: ['CIS-5.2'],
  CKV_K8S_3: ['CIS-5.3'],
  CKV_K8S_4: ['CIS-5.4'],
  CKV2_K8S_1: ['CIS-5.5'],
  CKV_DOCKER_1: ['PCI-4.2', 'NIST-CM-6'],
  CKV_DOCKER_2: ['CIS-4.1', 'NIST-SI-12'],
  CKV_DOCKER_3: ['CIS-4.2'],
};

function detectFramework(file: string): 'terraform' | 'kubernetes' | 'dockerfile' | 'helm' {
  if (file.endsWith('.tf')) return 'terraform';
  if (file.endsWith('.yaml') || file.endsWith('.yml')) return 'kubernetes';
  if (file.includes('Dockerfile')) return 'dockerfile';
  if (file.includes('Chart.yaml')) return 'helm';
  return 'terraform';
}

function mapSeverity(sev: string): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  const s = sev.toUpperCase();
  if (s === 'CRITICAL') return 'CRITICAL';
  if (s === 'HIGH') return 'HIGH';
  if (s === 'MEDIUM') return 'MEDIUM';
  return 'LOW';
}

export function isCheckovAvailable(): { available: boolean; version: string | null } {
  try {
    const out = execSync('checkov --version', { encoding: 'utf-8', timeout: 5000 });
    return { available: true, version: out.trim() };
  } catch {
    return { available: false, version: null };
  }
}

export function runCheckov(directory: string, scanId: string): Finding[] {
  const { available } = isCheckovAvailable();
  if (!available) {
    throw new Error('Checkov is not installed. Install with: pip install checkov');
  }

  const output = execSync(
    `checkov -d "${directory}" --output json --no-guide --quiet`,
    { encoding: 'utf-8', timeout: 120000, maxBuffer: 10 * 1024 * 1024 }
  );

  const parsed: CheckovResult[] = JSON.parse(output);
  const findings: Finding[] = [];
  const now = new Date().toISOString();

  for (const result of parsed) {
    const failed = result.results?.failed_checks || [];
    for (const check of failed) {
      const complianceIds = COMPLIANCE_MAP[check.check_id] || [];
      findings.push({
        id: `${scanId}-${check.check_id}-${findings.length}`,
        scanId,
        scanner: 'checkov' as ScannerType,
        file: check.file,
        policyId: check.check_id,
        policyName: check.check_name,
        severity: mapSeverity(check.severity),
        resource: check.resource,
        description: check.check_name,
        remediation: check.guideline || 'See Checkov documentation for remediation.',
        framework: detectFramework(check.file),
        complianceIds,
        exceptionId: null,
        createdAt: now,
      });
    }
  }

  return findings;
}
