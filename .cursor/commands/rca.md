---
description: Root cause analysis for bug investigation
---

# /rca [issue-id]

Investigate a bug and document root cause analysis.

## Arguments
- `issue-id`: GitHub issue ID or bug description

## Steps

### 1. Create RCA Directory
// turbo
```bash
mkdir -p docs/rca
```

### 2. Fetch Issue Details (if GitHub issue)
If issue-id is a number, fetch from GitHub:
// turbo
```bash
gh issue view [issue-id]
```

### 3. Understand the Problem
Document:
- What is the expected behavior?
- What is the actual behavior?
- Steps to reproduce
- Error messages (if any)

### 4. Investigate Code
Based on the bug description:
1. Search for relevant files:
// turbo
```bash
grep -r "[search term]" --include="*.tsx" --include="*.ts" app/ components/ lib/
```

2. Read the affected files
3. Check recent git history:
// turbo
```bash
git log --oneline -10 -- [affected-file]
```

### 5. Identify Root Cause
Analyze:
- What code is causing the issue?
- When was it introduced?
- Why does it fail?

### 6. Create RCA Document
Create `docs/rca/issue-[issue-id].md`:

```markdown
# RCA: Issue #[issue-id]

## Issue Summary
[Brief description of the bug]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Root Cause
[Detailed explanation of why this happens]

### Affected Files
- `[file-path]` - [what's wrong]

### Code Analysis
[Code snippets showing the problem]

## Impact
- Severity: [High/Medium/Low]
- Affected area: [component/page/feature]

## Proposed Fix
[Detailed fix approach]

### Files to Modify
- `[file-path]` - [what to change]

### Fix Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Testing Strategy
- [ ] [Test case 1]
- [ ] [Test case 2]

## Prevention
[How to prevent similar issues in the future]
```

### 7. Confirm RCA Created
// turbo
```bash
cat docs/rca/issue-[issue-id].md
```

## Return Condition
Return when RCA document is created with:
- Clear root cause identified
- Specific fix approach documented
- Ready for `/implement-fix [issue-id]`

## Output Format
```
📋 RCA Complete: docs/rca/issue-[issue-id].md
🔍 Root Cause: [brief summary]
🛠️ Fix Approach: [brief summary]
📝 Ready for: /implement-fix [issue-id]
```
