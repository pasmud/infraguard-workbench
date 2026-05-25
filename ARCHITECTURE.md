# InfraGuard Workbench - Architecture

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│  React + Vite + TypeScript + Tailwind CSS       │
│  (Port: dynamic 42000-42999)                    │
└──────────────────┬──────────────────────────────┘
                   │ HTTP REST API
                   ▼
┌─────────────────────────────────────────────────┐
│              Express Backend                     │
│  Node.js + TypeScript                            │
│  (Port: dynamic 43000-43999)                    │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Scanner  │  │Exception │  │   Export      │  │
│  │ Module   │  │ Module   │  │   Module      │  │
│  └────┬─────┘  └────┬─────┘  └──────┬────────┘  │
│       │              │               │           │
│  ┌────▼─────┐  ┌────▼─────┐  ┌──────▼────────┐  │
│  │Checkov   │  │ SQLite   │  │ Markdown/JSON  │  │
│  │Integration│  │ Drizzle  │  │ Report Gen     │  │
│  └──────────┘  │ ORM      │  └───────────────┘  │
│  ┌──────────┐  └──────────┘                     │
│  │Trivy     │                                    │
│  │Integration│                                   │
│  └──────────┘                                    │
│  ┌──────────┐                                    │
│  │Mock/     │                                    │
│  │Demo Mode │                                    │
│  └──────────┘                                    │
└─────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend (React SPA)
- **Pages:** Dashboard, Scan Results, Exceptions, Compliance, Reports, Settings
- **Components:** Navbar, Sidebar, FindingsTable, ExceptionModal, ComplianceBadge, ExportButton
- **State:** React Context for scan results and exceptions
- **Routing:** React Router v6

### Backend (Express API)
- `GET /api/health` - Health check
- `POST /api/scan` - Trigger scan on a directory
- `GET /api/findings` - List findings (with filters)
- `POST /api/exceptions` - Create exception
- `GET /api/exceptions` - List exceptions
- `PUT /api/exceptions/:id` - Update exception status
- `GET /api/export/markdown` - Export Markdown report
- `GET /api/export/json` - Export JSON report
- `GET /api/config` - Get scanner availability

### Data Flow
1. User submits directory path → Backend runs Checkov/Trivy (or mock)
2. Results parsed into unified schema → Stored in SQLite
3. Frontend polls `/api/findings` → Renders dashboard
4. User proposes exception → Stored in SQLite → Finding suppressed
5. User exports → Backend generates report from DB

## Directory Structure
```
infraguard-workbench/
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── api/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── backend/               # Express + TypeScript
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── db/
│   │   └── types/
│   ├── package.json
│   └── tsconfig.json
├── fixtures/              # Demo IaC files
│   ├── terraform/
│   ├── kubernetes/
│   └── docker/
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── README.md
├── STATUS.md
└── status.json
```

## Port Management
- Backend: Detect free port in range 43000-43999
- Frontend: Detect free port in range 42000-42999
- Ports written to `.env` file at startup
