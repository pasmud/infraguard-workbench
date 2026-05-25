# Research Notes: InfraGuard Workbench

## IaC Scanning Landscape (May 2026)

### Checkov (v3.2.527)
- **Maintainer:** Palo Alto Networks (Prisma Cloud), acquired Bridgecrew in 2021
- **Language:** Python (`pip install checkov`)
- **Coverage:** Terraform, CloudFormation, Kubernetes, Helm, Dockerfile, Bicep, ARM, Serverless, Kustomize, OpenAPI, Ansible, GitHub Actions, and more
- **Policies:** ~1,400+ built-in policies across AWS, Azure, GCP, K8s
- **Custom policies:** Python + YAML
- **Output formats:** CLI, JSON, SARIF, JUnit XML, CSV, CycloneDX, GitHub Markdown
- **Key features:** Graph-based cross-resource checks, variable resolution, inline suppression (`# checkov:skip=`), compliance framework mapping (CIS, NIST, PCI DSS, SOC 2, HIPAA)
- **Precision:** ~91% precision on IaC scanning
- **Speed:** ~9.8s for 1k files (pre-commit)

### Trivy (v0.70.0)
- **Maintainer:** Aqua Security
- **Language:** Go (single binary)
- **Coverage:** Container images, filesystems, git repos, VM images, Kubernetes, IaC (Terraform, CF, K8s, Helm, Dockerfile, Bicep)
- **Scanners:** Vulnerability, misconfiguration, secret, license, SBOM
- **Custom policies:** Rego (OPA)
- **Output formats:** JSON, SARIF, table, CycloneDX, SPDX
- **Key features:** All-in-one scanner (container + IaC), tfsec checks merged in, fast performance
- **Precision:** ~86% on IaC scanning
- **Speed:** ~6.1s for 1k files

### Market Notes (2026)
- tfsec: Deprecated (no new features; checks migrated to Trivy)
- Terrascan: Archived by Tenable (Nov 2025, read-only)
- KICS: Active (Checkmarx), ~2,400 rules but lower precision
- Snyk IaC: Commercial with limited free tier

### Recommendation for InfraGuard Workbench
- Integrate both Checkov and Trivy for maximum coverage
- Provide fallback demo/mocked mode when tools aren't installed
- Leverage Checkov's JSON output for parsing and display
- Leverage Trivy's `trivy fs --scanners misconfig` for IaC scanning
- Compliance mapping: CIS, NIST, PCI DSS, Essential Eight (AU)

## Common IaC Misconfigurations

### Terraform
- Public S3 buckets, open security groups (0.0.0.0/0), unencrypted RDS/EBS
- IAM wildcard permissions, no MFA on privileged roles
- Missing CloudTrail, VPC flow logs, backup policies
- No versioning on S3, short log retention

### Kubernetes
- Privileged containers, root user, no read-only root filesystem
- No resource limits, hostNetwork/IPC/PID
- Default ServiceAccount, no NetworkPolicy
- Missing Pod Security Standards

### Dockerfile
- `USER root` (or no USER)
- Pinning to `:latest` tag
- Installing without cache cleanup
- ADD of remote tarballs without verification

## Key Design Insights
- JSON output from both scanners is the most practical for programmatic ingestion
- Compliance mapping via tags on individual findings
- Exception workflow requires: proposed → approved, with expiry, reason, compensating control
- Audit trail is essential for compliance reporting
- Demo fixtures should have intentional, documented misconfigurations
