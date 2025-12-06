# Root Cause Analysis (RCA) Documents

RCA documents created during the **Bug Fix Workflow**.

## Workflow

Created by: `/rca {issue-id}`

```
/prime → /rca {issue-id} → /implement-fix {issue-id} → /commit
```

## Purpose

RCA documents document:
- What's broken and why
- Investigation process
- Root cause identification
- Fix approach
- Prevention strategies

## File Naming

- `issue-{id}.md` - For GitHub issues (e.g., `issue-123.md`)
- `bug-{description}.md` - For non-issue bugs (e.g., `bug-form-submission-error.md`)

## Document Structure

Each RCA document should include:
1. **Issue Summary** - What's broken?
2. **Root Cause** - Why did it break?
3. **Investigation** - How was it found?
4. **Fix Approach** - How will it be fixed?
5. **Prevention** - How to prevent recurrence?

## Current Documents

_No RCA documents yet. They will be created automatically by the `/rca` command._

