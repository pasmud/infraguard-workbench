# InfraGuard Workbench

Infrastructure Security Scanning Workbench — scan IaC files for misconfigurations using Checkov and Trivy.

## Features

- **IaC Scanning**: Detect misconfigurations in Terraform, Kubernetes, Dockerfile, and Helm files
- **Dual Scanner Support**: Runs Checkov and Trivy; falls back to demo data if not installed
- **Findings Dashboard**: Sort, filter, and review security findings by severity
- **Exception Workflow**: Propose, approve, or reject exceptions with expiry dates
- **Compliance Mapping**: Findings mapped to CIS, NIST, PCI DSS, and Essential Eight frameworks
- **Audit Reports**: Export findings and exceptions as Markdown or JSON
- **Demo Mode**: Built-in fixtures with intentional misconfigurations for testing

## Quick Start

### Prerequisites

- Node.js 22+
- npm

### Option 1: Run Locally

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

The backend will detect a free port (preferring 43000-43999) and write it to `.env`.

### Option 2: Docker Compose

```bash
docker compose up --build
```

### Option 3: Install Scanners (Optional)

For real scanning (not just demo mode):

```bash
# Checkov
pip install checkov

# Trivy
# See: https://trivy.dev/docs/getting-started/installation/
```

## Usage

1. Open the web app (default: http://localhost:42000)
2. Click **Load Demo** to try with built-in misconfigurations, or enter an IaC directory path and click **Scan**
3. Review findings in the **Scan Results** page
4. Propose exceptions for accepted risks
5. View compliance mapping in the **Compliance** page
6. Export audit reports from the **Reports** page

## Project Structure

```
├── backend/          # Express API server
│   ├── src/
│   │   ├── routes/   # API route handlers
│   │   ├── services/ # Business logic
│   │   ├── db/       # SQLite + Drizzle ORM
│   │   └── types/    # TypeScript types
│   └── tests/
├── frontend/         # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/ # Reusable components
│   │   ├── api/      # API client
│   │   └── context/  # App state
│   └── tests/
├── fixtures/         # Demo IaC files with intentional misconfigurations
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

## Tech Stack

- **Frontend**: React 19, Vite 6, TypeScript, Tailwind CSS 4
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite with Drizzle ORM
- **Testing**: Vitest, Playwright
- **Container**: Docker, Docker Compose
- **CI**: GitHub Actions (lint, typecheck, tests, build)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/scan` | Run a scan on a directory |
| POST | `/api/scan/demo` | Load demo findings |
| GET | `/api/scan` | List scans |
| GET | `/api/findings` | List findings (filterable) |
| POST | `/api/exceptions` | Create exception |
| PUT | `/api/exceptions/:id/status` | Update exception status |
| GET | `/api/exceptions` | List exceptions |
| GET | `/api/export/markdown` | Export Markdown report |
| GET | `/api/export/json` | Export JSON report |
| GET | `/api/config` | Scanner availability config |

## Safety

- Local file scanning only — no cloud connections
- Read-only analysis — no infrastructure changes
- **Only scan systems you own or are authorized to test**

## License

MIT
