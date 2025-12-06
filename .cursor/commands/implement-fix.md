---
description: Implement fix from RCA document
---

# /implement-fix [issue-id]

Implement a bug fix based on the RCA document.

## Arguments
- `issue-id`: The issue ID (matches RCA filename)

## Steps

### 1. Read RCA Document
Read `docs/rca/issue-[issue-id].md` to understand:
- Root cause
- Proposed fix
- Files to modify
- Testing strategy

### 2. Verify Prerequisites
// turbo
```bash
npm install
```

### 3. Implement Fix
Follow the fix steps from the RCA document:
1. Make each change as specified
2. Validate after each file change:
// turbo
```bash
npx tsc --noEmit
```

### 4. Run Validation
// turbo
```bash
npm run lint && npx tsc --noEmit && npm run build
```

### 5. Test the Fix
// turbo
```bash
npm run dev
```

Verify in browser that:
- [ ] Bug is fixed
- [ ] No regressions introduced
- [ ] Feature works as expected

### 6. Update RCA Document
Add completion status to `docs/rca/issue-[issue-id].md`:
```markdown
---
## Resolution
- [x] Fix implemented
- [x] All tests passed
- [x] Verified in browser
- Fixed: [date]
- Commit: [will be added after commit]
---
```

## Return Condition
Return when:
1. Fix is implemented per RCA
2. All validation commands pass
3. Bug is verified fixed in browser

## Output Format
```
✅ Fix Implemented: Issue #[issue-id]
📁 Files Modified:
  - [file1]
  - [file2]
✅ Validations Passed: lint, types, build
✅ Bug Verified Fixed
📝 Ready for: /commit
   Suggested message: fix: [description] (Fixes #[issue-id])
```

## Error Handling
If fix doesn't work:
1. Report what failed
2. Suggest updates to RCA
3. Ask for guidance before retrying
