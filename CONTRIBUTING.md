# Contributing to InfraGuard Workbench

Thank you for your interest in contributing! This document outlines the process for contributing to the project.

## Code of Conduct

By participating, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Open a new issue with a clear title and description
3. Include steps to reproduce, expected behavior, and actual behavior
4. Include screenshots if applicable
5. Include your environment details (OS, Node version, browser)

### Suggesting Features

1. Open a new issue with the "enhancement" label
2. Describe the feature and the problem it solves
3. Explain how it fits within the project's scope (defensive security tooling)

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the project conventions
4. Write or update tests as needed
5. Run linting and typechecking (`npm run lint && npm run typecheck`)
6. Ensure all tests pass (`npm test`)
7. Commit with a clear message describing the change
8. Push to your fork and open a pull request

## Development Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

### Docker

```bash
docker compose up --build
```

## Project Guidelines

- **Defensive tooling only**: No offensive, exploit, or destructive functionality
- **Local-first**: No cloud connections; scans run entirely on local files
- **TypeScript**: Use strict types; avoid `any`
- **Testing**: Cover new features with unit/integration tests
- **Security**: Follow security best practices; never commit secrets or keys

## Code Style

- TypeScript with strict mode
- React functional components with hooks
- Tailwind CSS for styling
- ESLint and Prettier for formatting

## Commit Messages

Use clear, concise commit messages. Follow the conventional commits format:

```
feat: add new scanner integration
fix: resolve false positive in CIS check
docs: update API endpoint documentation
test: add exception workflow tests
```

## Questions?

Open a discussion or issue on GitHub.
