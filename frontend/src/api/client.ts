const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export interface Finding {
  id: string;
  scanId: string;
  scanner: string;
  file: string;
  policyId: string;
  policyName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  resource: string;
  description: string;
  remediation: string;
  framework: string;
  complianceIds: string[];
  exceptionId: string | null;
  createdAt: string;
}

export interface Exception {
  id: string;
  findingId: string;
  status: string;
  reason: string;
  compensatingControl: string;
  expiryDate: string;
  proposedBy: string;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Scan {
  id: string;
  directory: string;
  scanner: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  error: string | null;
  findingsCount: number;
}

export interface ScannerConfig {
  checkovAvailable: boolean;
  trivyAvailable: boolean;
  checkovVersion: string | null;
  trivyVersion: string | null;
}

export const api = {
  health: () => request<{ status: string }>('/health'),

  scan: {
    run: (directory: string, scanner?: string) =>
      request<{ scan: Scan; findings: Finding[] }>('/scan', {
        method: 'POST',
        body: JSON.stringify({ directory, scanner }),
      }),
    demo: () =>
      request<{ scan: Scan; findings: Finding[] }>('/scan/demo', { method: 'POST' }),
    list: () => request<Scan[]>('/scan'),
    findings: (id: string) => request<Finding[]>(`/scan/${id}/findings`),
  },

  findings: {
    list: (params?: { severity?: string; scanner?: string; framework?: string; compliance?: string }) => {
      const query = new URLSearchParams();
      if (params?.severity) query.set('severity', params.severity);
      if (params?.scanner) query.set('scanner', params.scanner);
      if (params?.framework) query.set('framework', params.framework);
      if (params?.compliance) query.set('compliance', params.compliance);
      const qs = query.toString();
      return request<Finding[]>(`/findings${qs ? `?${qs}` : ''}`);
    },
    get: (id: string) => request<Finding>(`/findings/${id}`),
  },

  exceptions: {
    create: (data: { findingId: string; reason: string; compensatingControl: string; expiryDate: string; proposedBy: string }) =>
      request<Exception>('/exceptions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateStatus: (id: string, status: string, approvedBy?: string) =>
      request<Exception>(`/exceptions/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, approvedBy }),
      }),
    list: () => request<Exception[]>('/exceptions'),
    get: (id: string) => request<Exception>(`/exceptions/${id}`),
  },

  export: {
    markdown: () => `${API_BASE}/export/markdown`,
    json: () => `${API_BASE}/export/json`,
  },

  config: {
    get: () => request<ScannerConfig>('/config'),
  },
};
