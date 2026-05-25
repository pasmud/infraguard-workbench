import { getAllFindings } from './scanner.ts';
import { getExceptions } from './exceptions.ts';

export async function generateMarkdownReport(): Promise<string> {
  const allFindings = await getAllFindings();
  const allExceptions = await getExceptions();

  let report = '# InfraGuard Workbench - Audit Report\n\n';
  report += `**Generated:** ${new Date().toISOString()}\n`;
  report += `**Total Findings:** ${allFindings.length}\n`;
  report += `**Total Exceptions:** ${allExceptions.length}\n\n`;

  report += '## Findings Summary\n\n';
  report += '| Severity | Count |\n';
  report += '|----------|-------|\n';

  const severityCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const f of allFindings) {
    if (f.severity in severityCounts) {
      severityCounts[f.severity as keyof typeof severityCounts]++;
    }
  }
  for (const [sev, count] of Object.entries(severityCounts)) {
    report += `| ${sev} | ${count} |\n`;
  }

  report += '\n## Findings Detail\n\n';
  for (const f of allFindings) {
    report += `### ${f.policyId}: ${f.policyName}\n`;
    report += `- **Scanner:** ${f.scanner}\n`;
    report += `- **File:** ${f.file}\n`;
    report += `- **Severity:** ${f.severity}\n`;
    report += `- **Resource:** ${f.resource}\n`;
    report += `- **Description:** ${f.description}\n`;
    report += `- **Remediation:** ${f.remediation}\n`;
    report += `- **Compliance:** ${f.complianceIds.join(', ') || 'None'}\n`;
    if (f.exceptionId) {
      const ex = allExceptions.find((e) => e.id === f.exceptionId);
      if (ex) {
        report += `- **Exception:** ${ex.status} (expires: ${ex.expiryDate})\n`;
      }
    }
    report += '\n';
  }

  if (allExceptions.length > 0) {
    report += '## Exceptions\n\n';
    for (const ex of allExceptions) {
      report += `### Exception ${ex.id}\n`;
      report += `- **Status:** ${ex.status}\n`;
      report += `- **Reason:** ${ex.reason}\n`;
      report += `- **Compensating Control:** ${ex.compensatingControl}\n`;
      report += `- **Expiry:** ${ex.expiryDate}\n`;
      report += `- **Proposed By:** ${ex.proposedBy}\n`;
      if (ex.approvedBy) report += `- **Approved By:** ${ex.approvedBy}\n`;
      report += '\n';
    }
  }

  return report;
}

export async function generateJsonReport(): Promise<string> {
  const allFindings = await getAllFindings();
  const allExceptions = await getExceptions();

  const report = {
    generatedAt: new Date().toISOString(),
    totalFindings: allFindings.length,
    totalExceptions: allExceptions.length,
    findings: allFindings.map((f) => ({
      ...f,
      complianceIds: typeof f.complianceIds === 'string'
        ? JSON.parse(f.complianceIds as string)
        : f.complianceIds,
    })),
    exceptions: allExceptions,
  };

  return JSON.stringify(report, null, 2);
}
