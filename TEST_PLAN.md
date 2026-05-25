# InfraGuard Workbench - Test Plan

## Unit Tests (Vitest)

### Backend
- **Scanner Service Tests**
  - Mock Checkov JSON output parsing
  - Mock Trivy JSON output parsing
  - Mock fallback/demo mode generation
  - Error handling when scanners not found

- **Exception Service Tests**
  - CRUD operations for exceptions
  - Status transitions (proposed → approved/rejected)
  - Expiry date validation
  - Exception suppresses finding in dashboard

- **Export Service Tests**
  - Markdown report generation
  - JSON report generation
  - Report includes all required fields

- **Database Tests**
  - Migrations run successfully
  - CRUD operations on all entities
  - Foreign key constraints

### Frontend
- **Component Tests**
  - FindingsTable renders correctly
  - ExceptionModal form validation
  - ComplianceBadge displays correct colors
  - SeverityBadge shows correct styling

- **API Client Tests**
  - Correct endpoints called
  - Error handling

## Integration Tests
- Scan → Findings → Exception → Export flow
- Multiple scans accumulate correctly
- Exception approval updates finding display

## E2E Tests (Playwright)
1. **Demo Scan Flow**
   - Navigate to scan page
   - Click "Load Demo" button
   - Verify findings appear in dashboard
   - Verify severity badges render

2. **Exception Workflow**
   - Select a finding
   - Propose exception with reason and expiry
   - Approve exception
   - Verify finding is suppressed

3. **Export Report**
   - Generate Markdown report
   - Verify content includes findings
   - Generate JSON report
   - Verify JSON structure

4. **Compliance Filtering**
   - Filter findings by CIS framework
   - Verify only matching findings shown

## Test Data
- Demo IaC fixtures in `fixtures/` directory
- Terraform: misconfigured S3 bucket, open security group
- Kubernetes: privileged pod, no resource limits
- Dockerfile: root user, no cache cleanup

## Running Tests
```bash
# Backend tests
cd backend && npx vitest run

# Frontend tests
cd frontend && npx vitest run

# E2E tests
cd frontend && npx playwright test
```
