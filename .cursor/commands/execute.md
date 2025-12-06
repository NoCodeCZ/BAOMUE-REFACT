---
description: Execute implementation from a plan file
---

# /execute [feature-name]

Implement a feature by following the plan created by `/planning`.

## Arguments
- `feature-name`: Name of the feature (matches plan filename)

## Steps

### 1. Read the Plan
Read `plans/[feature-name].md` to understand all tasks.

### 2. Verify Prerequisites
Before starting, confirm:
- [ ] Plan file exists and is readable
- [ ] All files to modify exist (or paths are valid for new files)
- [ ] Dependencies are installed

// turbo
```bash
npm install
```

### 3. Execute Tasks In Order
**IMPORTANT**: Execute every task from the plan in sequence. Do NOT skip steps.

For each task:
1. Read the task instructions
2. Make the required changes
3. Run the task's validation command
4. Only proceed to next task if validation passes

### 4. Run Incremental Validation
After modifying TypeScript files:
// turbo
```bash
npx tsc --noEmit
```

After creating/modifying components:
// turbo
```bash
npm run lint
```

### 5. Complete All Plan Tasks
Continue until all tasks in the plan are complete.

### 6. Run Final Validation
// turbo
```bash
npm run lint && npx tsc --noEmit && npm run build
```

### 7. Test in Browser
// turbo
```bash
npm run dev
```

Open http://localhost:3000 and verify the feature works as expected.

### 8. Mark Plan Complete
Add completion status to the plan file:
```markdown
---
## Completion Status
- [x] All tasks completed
- [x] All validations passed
- [x] Feature tested in browser
- Completed: [date]
---
```

## Return Condition
Return when:
1. All tasks from the plan are implemented
2. All validation commands pass (`npm run lint`, `npx tsc --noEmit`, `npm run build`)
3. Feature is verified working at localhost:3000

## Output Format
Report:
- ✅ Tasks completed: [list]
- ✅ Validations passed: lint, types, build
- ✅ Feature verified: [description]
- 📝 Ready for `/commit`

## Error Handling
If any task fails:
1. Stop execution
2. Report the error
3. Suggest fix or ask for guidance
4. Do NOT proceed to next task until resolved
