const severityColors: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-800 border-red-300',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  LOW: 'bg-gray-100 text-gray-600 border-gray-300',
};

export default function SeverityBadge({ severity }: { severity: string }) {
  const colors = severityColors[severity] || severityColors.LOW;
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${colors}`}>
      {severity}
    </span>
  );
}
