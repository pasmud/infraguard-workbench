import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const frameworks = [
  { id: 'CIS', name: 'CIS Benchmarks', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'NIST', name: 'NIST SP 800-53', color: 'bg-green-100 text-green-800 border-green-300' },
  { id: 'PCI', name: 'PCI DSS', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'ESSENTIAL', name: 'Essential Eight', color: 'bg-teal-100 text-teal-800 border-teal-300' },
];

export default function Compliance() {
  const { state } = useAppContext();
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  const frameworkData = useMemo(() => {
    const data: Record<string, { total: number; failed: number; suppressed: number; findings: typeof state.findings }> = {};

    for (const fw of frameworks) {
      const fwFindings = state.findings.filter((f) =>
        f.complianceIds.some((cid) => cid.startsWith(fw.id))
      );
      data[fw.id] = {
        total: fwFindings.length,
        failed: fwFindings.filter((f) => !f.exceptionId).length,
        suppressed: fwFindings.filter((f) => f.exceptionId).length,
        findings: fwFindings,
      };
    }

    return data;
  }, [state.findings]);

  const selectedData = selectedFramework ? frameworkData[selectedFramework] : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Compliance Mapping</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {frameworks.map((fw) => {
          const data = frameworkData[fw.id];
          return (
            <button
              key={fw.id}
              onClick={() => setSelectedFramework(selectedFramework === fw.id ? null : fw.id)}
              className={`bg-white rounded-lg border-2 p-4 text-left transition-all ${
                selectedFramework === fw.id ? 'border-indigo-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-sm">{fw.name}</h3>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total</span>
                  <span className="font-medium">{data.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Failed</span>
                  <span className="font-medium">{data.failed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Suppressed</span>
                  <span className="font-medium">{data.suppressed}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedData && selectedFramework && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            {frameworks.find((f) => f.id === selectedFramework)?.name} - Findings
          </h2>
          {selectedData.findings.length === 0 ? (
            <p className="text-sm text-gray-400">No findings mapped to this framework.</p>
          ) : (
            <div className="space-y-3">
              {selectedData.findings.map((f) => (
                <div key={f.id} className="border border-gray-200 rounded p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{f.policyId}</span>
                    <div className="flex gap-1">
                      {f.complianceIds
                        .filter((cid) => cid.startsWith(selectedFramework))
                        .map((cid) => (
                          <span
                            key={cid}
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              frameworks.find((fw) => fw.id === selectedFramework)?.color || ''
                            }`}
                          >
                            {cid}
                          </span>
                        ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{f.policyName}</p>
                  <p className="text-xs text-gray-400 mt-1">{f.file}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
