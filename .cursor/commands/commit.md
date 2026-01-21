---
description: Create a well-formatted git commit
---

# /commit [files...]

Create a conventional commit for staged or specified files.

## Arguments
- `files` (optional): Specific files to commit. If not provided, commits all staged changes.

## Steps

### 1. Check Current Status
// turbo
```bash
git status
```

### 2. Review Changes
// turbo
```bash
git diff --staged
```

If no staged changes, show unstaged:
// turbo
```bash
git diff
```

### 3. Stage Files
If specific files provided:
```bash
git add [file1] [file2] ...
```

If no files specified and nothing staged:
```bash
git add -A
```

### 4. Analyze Changes for Commit Type
Based on the changes, determine the commit type:

| Type | When to Use |
|------|-------------|
| `feat` | New feature, new component, new page |
| `fix` | Bug fix, error correction |
| `refactor` | Code restructuring without behavior change |
| `style` | Formatting, styling changes |
| `docs` | Documentation updates |
| `chore` | Dependencies, config, tooling |
| `test` | Adding or updating tests |

### 5. Create Commit Message
Format: `type: short description`

Examples:
- `feat: add FAQ block component`
- `fix: resolve mobile menu z-index issue`
- `refactor: extract common button styles`
- `docs: update Directus user guide`
- `chore: update dependencies`

### 6. Execute Commit
```bash
git commit -m "[type]: [description]"
```

### 7. Confirm Commit
// turbo
```bash
git log -1 --oneline
```

## Return Condition
Return when the commit is successfully created and confirmed.

## Output Format
Report:
```
✅ Committed: [commit hash]
📝 Message: [commit message]
📁 Files changed: [count]
```

## Multi-File Commit Guidelines
For larger changes, include a body:
```bash
git commit -m "feat: add booking form block

- Add BlockBooking interface to types.ts
- Create getBookingBlock fetch function
- Build BookingForm component with validation
- Wire up to homepage block renderer"
```

## Issue References
If fixing a GitHub issue, include reference:
```bash
git commit -m "fix: resolve image loading error

Fixes #123"
```
