import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/client';
import SeverityBadge from '../components/SeverityBadge';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [directory, setDirectory] = useState('');

  useEffect(() => {
    api.config.get().then((cfg) => dispatch({ type: 'SET_CONFIG', payload: cfg })).catch(() => {});
    api.findings.list().then((f) => dispatch({ type: 'SET_FINDINGS', payload: f })).catch(() => {});
    api.exceptions.list().then((e) => dispatch({ type: 'SET_EXCEPTIONS', payload: e })).catch(() => {});
  }, [dispatch]);

  const handleScan = async () => {
    if (!directory) return;
    setScanning(true);
    try {
      const result = await api.scan.run(directory);
      dispatch({ type: 'ADD_FINDINGS', payload: result.findings });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Scan failed' });
    } finally {
      setScanning(false);
    }
  };

  const handleDemo = async () => {
    setScanning(true);
    try {
      const result = await api.scan.demo();
      dispatch({ type: 'ADD_FINDINGS', payload: result.findings });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Demo failed' });
    } finally {
      setScanning(false);
    }
  };

  const severityCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const f of state.findings) {
    if (!f.exceptionId) severityCounts[f.severity]++;
  }

  const scannerStatus = state.config;
  const suppressedCount = state.exceptions.filter((e) => e.status === 'approved').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Run a Scan</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
            placeholder="Enter IaC directory path (e.g. ./fixtures)"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleScan}
            disabled={scanning || !directory}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {scanning ? 'Scanning...' : 'Scan'}
          </button>
          <button
            onClick={handleDemo}
            disabled={scanning}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
          >
            Load Demo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total Findings</div>
          <div className="text-3xl font-bold mt-1">{state.findings.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Open (No Exception)</div>
          <div className="text-3xl font-bold mt-1">
            {state.findings.filter((f) => !f.exceptionId).length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Suppressed</div>
          <div className="text-3xl font-bold mt-1">{suppressedCount}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Scanners Available</div>
          <div className="text-sm mt-1">
            {scannerStatus ? (
              <>
                <div>Checkov: {scannerStatus.checkovAvailable ? '✅' : '❌'}</div>
                <div>Trivy: {scannerStatus.trivyAvailable ? '✅' : '❌'}</div>
              </>
            ) : (
              <span className="text-gray-400">Checking...</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Active Findings by Severity</h2>
        <div className="space-y-3">
          {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <div key={sev} className="flex items-center gap-3">
              <SeverityBadge severity={sev} />
              <div className="flex-1 bg-gray-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    sev === 'CRITICAL' ? 'bg-red-500' :
                    sev === 'HIGH' ? 'bg-orange-500' :
                    sev === 'MEDIUM' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${state.findings.length ? (severityCounts[sev] / state.findings.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">{severityCounts[sev]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Findings</h2>
        <div className="space-y-2">
          {state.findings.slice(0, 10).map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <SeverityBadge severity={f.severity} />
                <span className="text-sm font-medium">{f.policyId}</span>
                <span className="text-sm text-gray-500 truncate max-w-[300px]">{f.policyName}</span>
              </div>
              <button
                onClick={() => navigate('/scan-results')}
                className="text-xs text-indigo-600 hover:underline"
              >
                View All
              </button>
            </div>
          ))}
          {state.findings.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No findings yet. Run a scan or load demo data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
