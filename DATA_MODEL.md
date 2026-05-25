# InfraGuard Workbench - Data Model

## Entities

### Scan
```typescript
interface Scan {
  id: string;                    // UUID
  directory: string;             // Scanned directory path
  scanner: 'checkov' | 'trivy' | 'mock';
  status: 'running' | 'completed' | 'failed';
  startedAt: string;             // ISO timestamp
  completedAt: string | null;    // ISO timestamp
  error: string | null;          // Error message if failed
  findingsCount: number;
}
```

### Finding
```typescript
interface Finding {
  id: string;                    // UUID
  scanId: string;                // FK to Scan
  scanner: string;               // 'checkov' | 'trivy' | 'mock'
  file: string;                  // Relative file path
  policyId: string;              // e.g. CKV_AWS_18
  policyName: string;            // Human-readable name
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  resource: string;              // Affected resource name
  description: string;           // Issue description
  remediation: string;           // How to fix
  framework: string;             // 'terraform' | 'kubernetes' | 'dockerfile'
  complianceIds: string[];       // e.g. ['CIS-1.2', 'PCI-3.4']
  exceptionId: string | null;    // FK to Exception if suppressed
  createdAt: string;             // ISO timestamp
}
```

### Exception
```typescript
interface Exception {
  id: string;                    // UUID
  findingId: string;             // FK to Finding
  status: 'proposed' | 'approved' | 'rejected' | 'expired';
  reason: string;                // Why exception is needed
  compensatingControl: string;   // Mitigating measures
  expiryDate: string;            // ISO date (when exception expires)
  proposedBy: string;            // Who proposed it
  approvedBy: string | null;     // Who approved it
  approvedAt: string | null;     // ISO timestamp
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

### AuditLog
```typescript
interface AuditLog {
  id: string;                    // UUID
  action: string;                // e.g. 'exception.created', 'exception.approved'
  entityType: string;            // 'finding' | 'exception' | 'scan'
  entityId: string;              // Related entity ID
  details: string;               // JSON string with details
  createdAt: string;             // ISO timestamp
}
```

## SQLite Schema (Drizzle ORM)

### Table: scans
| Column       | Type    | Notes                |
|-------------|---------|----------------------|
| id          | text PK | UUID                 |
| directory   | text    | NOT NULL             |
| scanner     | text    | NOT NULL             |
| status      | text    | NOT NULL             |
| started_at  | text    | NOT NULL             |
| completed_at| text    | nullable             |
| error       | text    | nullable             |
| findings_count | int | default 0            |

### Table: findings
| Column        | Type    | Notes                |
|--------------|---------|----------------------|
| id           | text PK | UUID                 |
| scan_id      | text FK | scans.id             |
| scanner      | text    | NOT NULL             |
| file         | text    | NOT NULL             |
| policy_id    | text    | NOT NULL             |
| policy_name  | text    | NOT NULL             |
| severity     | text    | NOT NULL             |
| resource     | text    | NOT NULL             |
| description  | text    | NOT NULL             |
| remediation  | text    | NOT NULL             |
| framework    | text    | NOT NULL             |
| compliance_ids | text  | JSON array string    |
| exception_id | text FK | exceptions.id (nullable) |
| created_at   | text    | NOT NULL             |

### Table: exceptions
| Column               | Type    | Notes                |
|---------------------|---------|----------------------|
| id                  | text PK | UUID                 |
| finding_id          | text FK | findings.id          |
| status              | text    | NOT NULL             |
| reason              | text    | NOT NULL             |
| compensating_control| text    | NOT NULL             |
| expiry_date         | text    | NOT NULL             |
| proposed_by         | text    | NOT NULL             |
| approved_by         | text    | nullable             |
| approved_at         | text    | nullable             |
| created_at          | text    | NOT NULL             |
| updated_at          | text    | NOT NULL             |

### Table: audit_logs
| Column      | Type    | Notes                |
|------------|---------|----------------------|
| id         | text PK | UUID                 |
| action     | text    | NOT NULL             |
| entity_type| text    | NOT NULL             |
| entity_id  | text    | NOT NULL             |
| details    | text    | nullable             |
| created_at | text    | NOT NULL             |
