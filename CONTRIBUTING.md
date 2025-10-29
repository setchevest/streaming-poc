# Contributing Guide

Thank you for contributing to the Streaming Platform! This document provides guidelines for contributing code, documentation, and other improvements to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Git Workflow](#git-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

Be respectful and constructive in all interactions. We welcome contributors of all backgrounds and experience levels.

## Getting Started

1. Fork the repository (if applicable)
2. Clone your fork or the repository
3. Create a feature branch (see [Git Workflow](#git-workflow))
4. Make your changes
5. Commit with meaningful messages (see [Commit Messages](#commit-messages))
6. Push and create a pull request

## Development Setup

### Prerequisites

- Docker and Docker Compose (for local development)
- Node.js 18+ (for frontend/backend development)
- PostgreSQL client tools (for database debugging)

### Local Development

```bash
# Start all services
./quick_start.sh

# Or manually start Docker services
docker-compose up -d --build

# Frontend development
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev

# Backend development (in another terminal)
cd backend
npm run dev
```

For more details, see [Development Commands](./CLAUDE.md#development-commands) in CLAUDE.md.

## Git Workflow

### Branch Strategy

Always create a feature branch before making changes:

```bash
# Create and switch to a new feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/your-bug-fix

# Or for documentation
git checkout -b docs/your-documentation-change
```

**Branch Naming Convention:**
- `feature/` - New features (e.g., `feature/event-search`)
- `fix/` - Bug fixes (e.g., `fix/rtmp-auth-bug`)
- `refactor/` - Code refactoring (e.g., `refactor/api-middleware`)
- `docs/` - Documentation (e.g., `docs/api-endpoints`)

Use lowercase, hyphens for word separation, and be descriptive.

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - A new feature
- `fix` - A bug fix
- `refactor` - Code refactoring (no feature changes or bug fixes)
- `docs` - Documentation updates
- `test` - Adding or updating tests
- `perf` - Performance improvements
- `style` - Code style changes (formatting, missing semicolons, etc.)
- `chore` - Build, dependencies, or tooling changes

**Scopes** (affected component):
- `streaming` - RTMP/HLS streaming pipeline
- `api` - Backend API endpoints
- `frontend` - Frontend UI/UX
- `ui` - UI components specifically
- `database` - Database schema or queries
- `transcoder` - FFmpeg/HLS transcoding
- `infra` - Kubernetes/Docker deployment
- `docs` - Documentation

**Examples:**

```
feat(streaming): add multi-bitrate HLS support

refactor(frontend): extract video player to separate component

fix(api): resolve stream key validation issue

docs(readme): update deployment instructions

test(api): add integration tests for RTMP auth endpoint
```

**Commit Message Guidelines:**
- Keep the first line under 50 characters
- Use imperative mood ("add" not "added" or "adds")
- Use lowercase for the description
- No period at the end of the subject line
- If needed, add a blank line followed by a detailed body
- Reference issues if applicable (e.g., "Closes #123")

### Making Changes

1. Create a feature branch from `main`
2. Make changes in logical, atomic commits
3. Each commit should represent a single logical change
4. Test your changes locally before pushing
5. Push to your branch
6. Create a pull request with a clear description

```bash
# Create branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat(scope): add new feature"

# Push to remote
git push origin feature/my-feature
```

## Coding Standards

### Backend (Node.js/Express)

- Use consistent indentation (2 spaces)
- Use `const`/`let` instead of `var`
- Use ES6+ features (arrow functions, template literals, destructuring)
- Add JSDoc comments for public functions
- Handle errors gracefully
- Validate input data

### Frontend (Next.js/React/TypeScript)

- Use TypeScript for type safety
- Follow React best practices (hooks, functional components)
- Use descriptive component names
- Add PropTypes or TypeScript interfaces
- Style with Tailwind CSS following the design system
- Ensure accessibility (ARIA labels, semantic HTML)

### General

- Use consistent naming conventions (camelCase for variables/functions, PascalCase for classes/components)
- Keep functions focused and single-purpose
- Add comments for complex logic
- Avoid magic numbers (use named constants)
- Keep lines under 100 characters when reasonable

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Full test suite (if available)
npm run test:all
```

### Test Coverage

- Write tests for new features
- Include unit tests and integration tests
- Aim for meaningful coverage (not just line coverage)
- Test error cases and edge cases

### Manual Testing

For streaming features:

```bash
# Test API health
curl http://localhost:8000/health

# Create test event
curl -X POST http://localhost:8000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","description":"Testing","sport":"football"}'

# List events
curl http://localhost:8000/api/events
```

## Pull Request Process

### Before Creating a PR

1. **Test locally**: Ensure your changes work and don't break existing functionality
2. **Run linters**: Follow code style guidelines
3. **Check tests**: Ensure all tests pass
4. **Review your own code**: Catch obvious issues before review
5. **Keep it focused**: Separate unrelated changes into different PRs

### Creating a PR

1. Push your branch to the repository
2. Create a pull request with a clear title and description
3. Reference any related issues (e.g., "Closes #123")
4. Include screenshots or demos for UI changes
5. Describe:
   - What changes were made and why
   - How to test the changes
   - Any breaking changes or migration steps

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Changes
- List specific changes made
- Keep it clear and concise

## Testing
- How to test these changes
- Commands or steps to follow
- Any edge cases tested

## Breaking Changes
- Note any breaking changes
- Migration steps if needed

## Screenshots (if applicable)
- Add UI changes here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass locally
```

### Review Process

- At least one approval before merging
- Address all review comments
- Push updates and request re-review if needed
- Ensure CI/CD checks pass

## Reporting Issues

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Docker version, etc.)
- Logs or error messages
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of the requested feature
- Use case and motivation
- Proposed solution (if any)
- Alternative approaches considered

---

Thank you for contributing to the Streaming Platform!
