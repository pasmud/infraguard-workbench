import { describe, it, expect } from 'vitest';
import { getMockFindings } from '../src/services/mock.ts';

describe('Scanner Service', () => {
  it('should return mock findings', () => {
    const findings = getMockFindings('test-scan-1');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].scanner).toBe('checkov');
    expect(findings[0].scanId).toBe('test-scan-1');
    expect(findings[0].severity).toBeDefined();
    expect(findings[0].complianceIds).toBeDefined();
  });

  it('should detect framework from file extension in mock data', () => {
    const findings = getMockFindings('test-scan-2');
    const tfFindings = findings.filter(f => f.framework === 'terraform');
    const k8sFindings = findings.filter(f => f.framework === 'kubernetes');
    const dockerFindings = findings.filter(f => f.framework === 'dockerfile');

    expect(tfFindings.length).toBeGreaterThan(0);
    expect(k8sFindings.length).toBeGreaterThan(0);
    expect(dockerFindings.length).toBeGreaterThan(0);
  });

  it('should include compliance IDs in mock findings', () => {
    const findings = getMockFindings('test-scan-3');
    for (const f of findings) {
      expect(Array.isArray(f.complianceIds)).toBe(true);
    }
  });
});
