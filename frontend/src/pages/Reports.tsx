import { api } from '../api/client';
import { useAppContext } from '../context/AppContext';

export default function Reports() {
  const { state } = useAppContext();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Audit Reports</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-2">Export Audit Report</h2>
        <p className="text-sm text-gray-500 mb-6">
          Download a comprehensive audit report including all findings, exceptions, and compliance mapping.
        </p>
        <div className="flex gap-4">
          <a
            href={api.export.markdown()}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
            download
          >
            <span>📄</span> Download Markdown Report
          </a>
          <a
            href={api.export.json()}
            className="px-5 py-2.5 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
            download
          >
            <span>📋</span> Download JSON Report
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total Findings</div>
          <div className="text-2xl font-bold">{state.findings.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Open Findings</div>
          <div className="text-2xl font-bold">
            {state.findings.filter((f) => !f.exceptionId).length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Exceptions</div>
          <div className="text-2xl font-bold">{state.exceptions.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Scanners Used</div>
            <div className="font-medium">
              {[...new Set(state.findings.map((f) => f.scanner))].join(', ') || 'None'}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Frameworks</div>
            <div className="font-medium">
              {[...new Set(state.findings.map((f) => f.framework))].join(', ') || 'None'}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Compliance Frameworks</div>
            <div className="font-medium">
              {[...new Set(state.findings.flatMap((f) => f.complianceIds.map((c) => c.split('-')[0])))].join(', ') || 'None'}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Findings with Exceptions</div>
            <div className="font-medium">{state.exceptions.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
