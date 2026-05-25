import { execSync } from 'child_process';
import type { Finding, ScannerType } from '../types/index.ts';

interface TrivyResult {
  Results?: Array<{
    Target: string;
    MisconfSummary?: { Successes: number; Failures: number };
    Misconfigurations?: Array<{
      Type: string;
      ID: string;
      Title: string;
      Severity: string;
      Message: string;
      Resolution: string;
      CauseMetadata?: { Resource: string };
    }>;
  }>;
}

const COMPLIANCE_MAP: Record<string, string[]> = {
  'AVD-AWS-0137': ['CIS-3.3', 'PCI-1.2'],
  'AVD-AWS-0126': ['CIS-3.4', 'NIST-SI-12'],
  'AVD-AWS-0127': ['CIS-3.5', 'PCI-1.3'],
  'AVD-AWS-0020': ['CIS-3.6'],
  'AVD-AWS-0021': ['CIS-3.7', 'NIST-AC-3'],
  'AVD-KSV-0001': ['CIS-5.1', 'NIST-SC-4'],
  'AVD-KSV-0002': ['CIS-5.2'],
  'AVD-KSV-0003': ['CIS-5.3'],
  'AVD-KSV-0004': ['CIS-5.4'],
  'AVD-DS-0001': ['PCI-4.2', 'NIST-CM-6'],
  'AVD-DS-0002': ['CIS-4.1', 'NIST-SI-12'],
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

export function isTrivyAvailable(): { available: boolean; version: string | null } {
  try {
    const out = execSync('trivy --version', { encoding: 'utf-8', timeout: 5000 });
    const match = out.match(/version:\s*v?(\S+)/);
    return { available: true, version: match ? match[1] : 'unknown' };
  } catch {
    return { available: false, version: null };
  }
}

export function runTrivy(directory: string, scanId: string): Finding[] {
  const { available } = isTrivyAvailable();
  if (!available) {
    throw new Error('Trivy is not installed. See: https://trivy.dev/docs/getting-started/installation/');
  }

  const output = execSync(
    `trivy fs --scanners misconfig --format json --quiet "${directory}"`,
    { encoding: 'utf-8', timeout: 120000, maxBuffer: 10 * 1024 * 1024 }
  );

  const parsed: TrivyResult = JSON.parse(output);
  const findings: Finding[] = [];
  const now = new Date().toISOString();

  const results = parsed.Results || [];
  for (const result of results) {
    const misconfigs = result.Misconfigurations || [];
    for (const misconfig of misconfigs) {
      const complianceIds = COMPLIANCE_MAP[misconfig.ID] || [];
      findings.push({
        id: `${scanId}-${misconfig.ID}-${findings.length}`,
        scanId,
        scanner: 'trivy' as ScannerType,
        file: result.Target,
        policyId: misconfig.ID,
        policyName: misconfig.Title,
        severity: mapSeverity(misconfig.Severity),
        resource: misconfig.CauseMetadata?.Resource || 'unknown',
        description: misconfig.Message,
        remediation: misconfig.Resolution || 'See Trivy documentation.',
        framework: detectFramework(result.Target),
        complianceIds,
        exceptionId: null,
        createdAt: now,
      });
    }
  }

  return findings;
}
