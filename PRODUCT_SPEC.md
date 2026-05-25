# InfraGuard Workbench - Product Specification

## Overview
InfraGuard Workbench is a local-first web application for scanning Infrastructure as Code (IaC) files against security misconfiguration policies. It provides a dashboard for reviewing findings, managing exceptions, mapping to compliance frameworks, and exporting audit reports.

## Core Features

### 1. IaC Directory Scanner
- User enters a local folder path containing IaC files
- Auto-detects: Terraform (.tf), Kubernetes YAML (.yml/.yaml), Dockerfile, docker-compose.yml, Helm charts
- Runs Checkov if installed; falls back to demo/mocked findings
- Runs Trivy if installed; falls back to demo/mocked findings
- Combines and deduplicates results from both scanners

### 2. Findings Dashboard
- Tabular view with columns: Scanner, File, Policy ID, Severity, Resource, Description, Remediation
- Sortable by severity, scanner, framework
- Filterable by scanner type, severity level, compliance framework
- Severity badges: CRITICAL (red), HIGH (orange), MEDIUM (yellow), LOW (grey)

### 3. Exception Workflow
- Propose exception on a finding (reason, compensating control, expiry date)
- Exception states: proposed, approved, rejected, expired
- Approved exceptions suppress findings from dashboard
- Exception audit log with timestamps and user attribution

### 4. Compliance Mapping
- Findings tagged with compliance frameworks: CIS, NIST, PCI DSS, Essential Eight
- Filter and group findings by framework
- Compliance coverage summary per framework

### 5. Audit Export
- Export findings + exceptions as Markdown report
- Export findings + exceptions as JSON
- Includes scan metadata: timestamp, directory, scanner versions

### 6. Demo Mode
- Built-in demo IaC fixtures with intentional misconfigurations
- One-click "Load Demo" button on scan page
- Demonstrates all features without requiring Checkov/Trivy

## Non-Goals (v1)
- No cloud account connections
- No automatic infrastructure changes
- No CI/CD pipeline integration (future)
- No runtime container scanning

## Target Users
- Platform engineers reviewing IaC before deployment
- Security engineers auditing infrastructure configurations
- Compliance teams verifying policy adherence
- Developers learning secure IaC practices
