import { useAppContext } from '../context/AppContext';
import { api } from '../api/client';

export default function Exceptions() {
  const { state, dispatch } = useAppContext();

  const handleApprove = async (id: string) => {
    try {
      const updated = await api.exceptions.updateStatus(id, 'approved', 'Admin');
      dispatch({ type: 'UPDATE_EXCEPTION', payload: updated });
    } catch (err) {
      alert('Failed to approve exception');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const updated = await api.exceptions.updateStatus(id, 'rejected', 'Admin');
      dispatch({ type: 'UPDATE_EXCEPTION', payload: updated });
    } catch (err) {
      alert('Failed to reject exception');
    }
  };

  const statusColors: Record<string, string> = {
    proposed: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Exception Workflow</h1>

      {state.exceptions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          <p className="text-lg">No exceptions proposed yet.</p>
          <p className="text-sm mt-2">Go to Scan Results and click "Exception" on a finding to propose one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Finding</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Compensating Control</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Expiry</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Proposed By</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {state.exceptions.map((ex) => (
                <tr key={ex.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{ex.findingId.slice(0, 16)}...</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColors[ex.status] || ''}`}>
                      {ex.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm max-w-[200px] truncate">{ex.reason}</td>
                  <td className="px-4 py-3 text-sm max-w-[200px] truncate">{ex.compensatingControl}</td>
                  <td className="px-4 py-3 text-sm">{ex.expiryDate}</td>
                  <td className="px-4 py-3 text-sm">{ex.proposedBy}</td>
                  <td className="px-4 py-3 text-sm">
                    {ex.status === 'proposed' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(ex.id)}
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(ex.id)}
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {ex.status !== 'proposed' && (
                      <span className="text-xs text-gray-400">No actions needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
