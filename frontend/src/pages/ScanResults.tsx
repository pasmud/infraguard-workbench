import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import FindingsTable from '../components/FindingsTable';
import ExceptionModal from '../components/ExceptionModal';
import { api } from '../api/client';

export default function ScanResults() {
  const { state, dispatch } = useAppContext();
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterScanner, setFilterScanner] = useState('');
  const [filterFramework, setFilterFramework] = useState('');
  const [selectedFinding, setSelectedFinding] = useState<typeof state.findings[0] | null>(null);

  const filteredFindings = useMemo(() => {
    let list = state.findings;
    if (filterSeverity) list = list.filter((f) => f.severity === filterSeverity);
    if (filterScanner) list = list.filter((f) => f.scanner === filterScanner);
    if (filterFramework) list = list.filter((f) => f.framework === filterFramework);
    return list;
  }, [state.findings, filterSeverity, filterScanner, filterFramework]);

  const handleProposeException = (finding: typeof state.findings[0]) => {
    setSelectedFinding(finding);
  };

  const handleSubmitException = async (data: { findingId: string; reason: string; compensatingControl: string; expiryDate: string; proposedBy: string }) => {
    try {
      const exception = await api.exceptions.create(data);
      dispatch({ type: 'ADD_EXCEPTION', payload: exception });
      dispatch({
        type: 'SET_FINDINGS',
        payload: state.findings.map((f) =>
          f.id === data.findingId ? { ...f, exceptionId: exception.id } : f
        ),
      });
      setSelectedFinding(null);
    } catch (err) {
      alert('Failed to create exception: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Scan Results</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-4">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
          <select
            value={filterScanner}
            onChange={(e) => setFilterScanner(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Scanners</option>
            <option value="checkov">Checkov</option>
            <option value="trivy">Trivy</option>
            <option value="mock">Mock</option>
          </select>
          <select
            value={filterFramework}
            onChange={(e) => setFilterFramework(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">All Frameworks</option>
            <option value="terraform">Terraform</option>
            <option value="kubernetes">Kubernetes</option>
            <option value="dockerfile">Dockerfile</option>
            <option value="helm">Helm</option>
          </select>
          <div className="text-sm text-gray-500 self-center ml-auto">
            {filteredFindings.length} of {state.findings.length} findings
          </div>
        </div>
      </div>

      <FindingsTable
        findings={filteredFindings}
        onProposeException={handleProposeException}
      />

      {selectedFinding && (
        <ExceptionModal
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          onSubmit={handleSubmitException}
        />
      )}
    </div>
  );
}
