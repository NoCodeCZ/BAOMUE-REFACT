# Documentation

## Quick Start

- **[SETUP.md](SETUP.md)** - Get the project running
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Understand the system

---

## Workflow-Aligned Structure

This documentation is organized to align with the RPI (Research-Plan-Implement) task cycles:

### Task Cycle Folders

**Research Phase** → [`research/`](research/)
- Research documents created by `/research {feature-name}` command
- Compressed system behavior, patterns, and constraints
- Used in Medium and Complex task cycles

**Bug Fix Phase** → [`rca/`](rca/)
- Root Cause Analysis documents created by `/rca {issue-id}` command
- Investigation and fix approach documentation
- Used in Bug Fix workflow cycle

**Planning Phase** → [`../plans/`](../plans/) (root level)
- Implementation plans created by `/planning {feature-name}` command
- Includes code snippets, BEFORE/AFTER examples, exact line numbers
- Used in all task cycles

---

## Project Documentation

### Setup & Architecture
- [SETUP.md](SETUP.md) - Initial project setup
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture overview

### User Guides
- [USER_GUIDE.md](USER_GUIDE.md) - Content manager guide
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick lookup guide

### Collection Guides
- [COLLECTION_GUIDES/](COLLECTION_GUIDES/) - Directus collection-specific documentation
  - [Pages](COLLECTION_GUIDES/01_Pages_Guide.md)
  - [Services](COLLECTION_GUIDES/02_Services_Guide.md)
  - [Blog Posts](COLLECTION_GUIDES/03_Blog_Posts_Guide.md)
  - [Global Settings](COLLECTION_GUIDES/04_Global_Settings_Guide.md)
  - [Navigation](COLLECTION_GUIDES/05_Navigation_Guide.md)

### Administrator Guides
- [APPLY_CONFIGS_GUIDE.md](APPLY_CONFIGS_GUIDE.md) - Apply Directus collection configs
- [COLLECTION_SETUP_GUIDE.md](COLLECTION_SETUP_GUIDE.md) - Collection setup process
- [DIRECTUS_ORGANIZATION.md](DIRECTUS_ORGANIZATION.md) - Directus organization patterns
- [DIRECTUS_UI_ENHANCEMENTS.md](DIRECTUS_UI_ENHANCEMENTS.md) - UI improvements

### Migration Documentation
- [migration-guide.md](migration-guide.md) - Migration overview
- [migration-quick-start.md](migration-quick-start.md) - Quick migration steps
- [migration-phase2-next-steps.md](migration-phase2-next-steps.md) - Phase 2 migration

### Reference Data
- [snapshot.json](snapshot.json) - Directus schema snapshot

---

## Task Cycle Quick Reference

**Simple Task:** `/prime` → `/planning` → `/execute` → `/commit`
- Plan → `plans/`

**Medium Task:** `/prime` → `/research` → `/planning` → `/execute` → `/commit`
- Research → `docs/research/`, Plan → `plans/`

**Complex Task:** `/prime` → `/research` → `/planning` → `/execute` → `/review code` → `/commit`
- Full RPI cycle with all review gates

**Bug Fix:** `/prime` → `/rca` → `/implement-fix` → `/commit`
- RCA → `docs/rca/`

For detailed workflow information, see [`.cursor/commands/README.md`](../.cursor/commands/README.md).

---

## For Developers

See `CLAUDE.md` and `.claude/rules/sections/` for development patterns and guidelines.

See `reference/` (root level) for task-specific developer guides.
