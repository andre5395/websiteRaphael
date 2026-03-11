# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Repository Status

This is a **new, empty repository** (`andre5395/websiteRaphael`). No source files, dependencies, or build configuration exist yet. This file should be updated as the project evolves.

## Git Workflow

### Branch Naming
- AI-driven work must be done on branches prefixed with `claude/` and suffixed with the session ID
  - Example: `claude/claude-md-mmltr596i2v7exj7-ui4ks`
- Never push to `main` or `master` without explicit permission

### Push Protocol
Always use:
```bash
git push -u origin <branch-name>
```
On network failure, retry up to 4 times with exponential backoff: 2s → 4s → 8s → 16s.

### Commit Messages
Use clear, descriptive commit messages that explain *why* a change was made, not just *what* changed.

## Development Conventions (to be filled in)

As the project is built out, document here:

### Technology Stack
_To be determined. Update this section when dependencies are added._

### Directory Structure
_To be determined. Update this section as the project grows._

### Build & Scripts
_To be determined. Update this section once a `package.json` or equivalent is added._

### Testing
_To be determined. Update this section when a test framework is introduced._

### Linting & Formatting
_To be determined. Update this section when linting/formatting tools are configured._

### Environment Variables
_To be determined. Add `.env.example` patterns here when environment variables are introduced._

## AI Assistant Guidelines

- **Read before editing**: Always read a file before modifying it.
- **Minimal changes**: Only change what is directly required. Do not refactor, add comments, or clean up unrelated code.
- **No over-engineering**: Avoid adding features, abstractions, or error handling beyond what is asked.
- **Security**: Never introduce command injection, XSS, SQL injection, or other OWASP vulnerabilities.
- **No secrets**: Never commit `.env` files, credentials, or API keys.
- **Confirm before destructive actions**: Ask before force-pushing, resetting hard, deleting branches, or modifying shared infrastructure.

## Updating This File

When significant project changes occur (new framework added, directory structure established, scripts defined), update the relevant sections of this file to keep it accurate.
