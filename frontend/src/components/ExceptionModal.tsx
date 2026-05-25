import { useState } from 'react';
import type { Finding } from '../api/client';

interface ExceptionModalProps {
  finding: Finding;
  onClose: () => void;
  onSubmit: (data: { findingId: string; reason: string; compensatingControl: string; expiryDate: string; proposedBy: string }) => void;
}

export default function ExceptionModal({ finding, onClose, onSubmit }: ExceptionModalProps) {
  const [reason, setReason] = useState('');
  const [compensatingControl, setCompensatingControl] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [proposedBy, setProposedBy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ findingId: finding.id, reason, compensatingControl, expiryDate, proposedBy });
  };

  const isValid = reason && compensatingControl && expiryDate && proposedBy;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Propose Exception</h2>
          <p className="text-sm text-gray-500 mt-1">
            {finding.policyId}: {finding.policyName}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Exception</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows={3}
              placeholder="Why is this exception needed?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compensating Control</label>
            <textarea
              value={compensatingControl}
              onChange={(e) => setCompensatingControl(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows={2}
              placeholder="What mitigations are in place?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposed By</label>
            <input
              type="text"
              value={proposedBy}
              onChange={(e) => setProposedBy(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Your name or email"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Exception
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
