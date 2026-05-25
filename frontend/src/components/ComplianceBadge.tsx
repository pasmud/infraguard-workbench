const frameworkColors: Record<string, string> = {
  'CIS': 'bg-blue-100 text-blue-800',
  'NIST': 'bg-green-100 text-green-800',
  'PCI': 'bg-purple-100 text-purple-800',
  'ESSENTIAL': 'bg-teal-100 text-teal-800',
};

function getFrameworkPrefix(id: string): string {
  if (id.startsWith('CIS')) return 'CIS';
  if (id.startsWith('NIST')) return 'NIST';
  if (id.startsWith('PCI')) return 'PCI';
  if (id.startsWith('ESSENTIAL')) return 'ESSENTIAL';
  return 'CIS';
}

export default function ComplianceBadge({ complianceId }: { complianceId: string }) {
  const prefix = getFrameworkPrefix(complianceId);
  const color = frameworkColors[prefix] || frameworkColors.CIS;
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {complianceId}
    </span>
  );
}
