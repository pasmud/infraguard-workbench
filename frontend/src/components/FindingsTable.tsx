import type { Finding } from '../api/client';
import SeverityBadge from './SeverityBadge';
import ComplianceBadge from './ComplianceBadge';

interface FindingsTableProps {
  findings: Finding[];
  onProposeException: (finding: Finding) => void;
}

export default function FindingsTable({ findings, onProposeException }: FindingsTableProps) {
  if (findings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No findings to display. Run a scan to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Scanner</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Severity</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Policy ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Resource</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">File</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Compliance</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {findings.map((f) => (
            <tr key={f.id} className={`hover:bg-gray-50 ${f.exceptionId ? 'opacity-60 bg-gray-100' : ''}`}>
              <td className="px-4 py-3 text-sm">{f.scanner}</td>
              <td className="px-4 py-3"><SeverityBadge severity={f.severity} /></td>
              <td className="px-4 py-3">
                <div className="text-sm font-medium">{f.policyId}</div>
                <div className="text-xs text-gray-500 max-w-xs truncate">{f.policyName}</div>
              </td>
              <td className="px-4 py-3 text-sm font-mono">{f.resource}</td>
              <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{f.file}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {f.complianceIds.map((cid) => (
                    <ComplianceBadge key={cid} complianceId={cid} />
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                {!f.exceptionId && (
                  <button
                    onClick={() => onProposeException(f)}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-100 transition-colors"
                  >
                    Exception
                  </button>
                )}
                {f.exceptionId && (
                  <span className="text-xs text-gray-400 italic">Suppressed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
