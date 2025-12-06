---
description: Human review checkpoints for research, plans, and code
---

# /review [type] [artifact-name]

Human review checkpoints at high-leverage points in the development process. Reviewing research and plans prevents catastrophic errors before implementation.

## Arguments
- `type`: Type of artifact to review - `research`, `plan`, or `code`
- `artifact-name`: Name of the artifact (feature name, issue ID, etc.)

## Review Types

### 1. Research Review (`/review research [feature-name]`)
**When**: After `/research` completes
**Why**: Catch misunderstandings of system behavior before planning
**Impact**: Highest leverage - prevents entire wrong direction

### 2. Plan Review (`/review plan [feature-name]`)
**When**: After `/planning` completes, before `/execute`
**Why**: Catch flawed plans before generating hundreds of wrong lines of code
**Impact**: High leverage - prevents wasted implementation effort

### 3. Code Review (`/review code [feature-name]`)
**When**: After `/execute` completes
**Why**: Catch bugs and ensure quality
**Impact**: Lower leverage - easier to fix, but still important

## Steps

### Review Type: Research

#### 1. Read Research Document
Read `docs/research/[feature-name].md`

Also verify it references project-specific patterns:
- Block architecture (if applicable)
- Directus integration patterns
- ISR configuration
- Component patterns (Server vs Client)

#### 2. Verify Research Quality
Check that research document contains:
- [ ] Clear system overview
- [ ] Relevant files identified
- [ ] Key patterns documented
- [ ] Dependencies mapped
- [ ] Similar implementations found
- [ ] Based on actual code (not assumptions)

#### 3. Check for Gaps
Identify any missing information:
- [ ] Are all relevant files covered?
- [ ] Are patterns accurately documented?
- [ ] Are constraints identified?
- [ ] Are similar implementations relevant?

#### 4. Document Review Feedback
Create or update `docs/research/[feature-name].md` with review section:

```markdown
## Review Status

- [ ] Research reviewed by: [reviewer]
- [ ] Review date: [date]
- [ ] Status: ✅ Approved / ⚠️ Needs Revision / ❌ Rejected

### Review Feedback
[Any feedback, corrections, or additional findings]

### Questions Resolved
- [ ] [Question 1]
- [ ] [Question 2]

### Additional Notes
[Any additional context or corrections]
```

#### 5. Decision Point
- **✅ Approved**: Proceed to `/planning [feature-name]`
- **⚠️ Needs Revision**: Update research based on feedback, then re-review
- **❌ Rejected**: Regenerate research with corrections

### Review Type: Plan

#### 1. Read Plan Document
Read `plans/[feature-name].md`

Also verify it includes project-specific requirements:
- ISR configuration (`export const revalidate = 60`)
- Image handling (`getFileUrl()`)
- Server/Client component decisions
- Block registration in Schema (if new block)
- Tailwind-only styling

#### 2. Verify Plan Quality
Check that plan contains:
- [ ] Clear description and user story
- [ ] Current system behavior documented (if modifying)
- [ ] Exact file paths (no ambiguity)
- [ ] Code snippets showing BEFORE/AFTER
- [ ] Line numbers for modifications
- [ ] Validation commands for each step
- [ ] Testing strategy
- [ ] Clear rationale for each change

#### 3. Verify Plan Correctness
Check:
- [ ] Does plan align with research findings?
- [ ] Are code snippets correct?
- [ ] Will changes achieve the goal?
- [ ] Are all dependencies considered?
- [ ] Is testing strategy adequate?
- [ ] Does it follow block architecture (if applicable)?
- [ ] Does it include ISR configuration?
- [ ] Does it use getFileUrl() for images?
- [ ] Does it follow Server Component patterns?
- [ ] Is Block interface registered in Schema (if new block)?

#### 4. Check for Issues
Look for:
- [ ] Missing steps
- [ ] Incorrect assumptions
- [ ] Incomplete code snippets
- [ ] Missing validations
- [ ] Potential side effects

#### 5. Document Review Feedback
Add review section to `plans/[feature-name].md`:

```markdown
## Review Status

- [ ] Plan reviewed by: [reviewer]
- [ ] Review date: [date]
- [ ] Status: ✅ Approved / ⚠️ Needs Revision / ❌ Rejected

### Review Feedback
[Any feedback, corrections, or suggestions]

### Approved Changes
- [x] Task 1: [description]
- [x] Task 2: [description]

### Requested Revisions
- [ ] Task 3: [what needs to change]

### Additional Notes
[Any additional context or concerns]
```

#### 6. Decision Point
- **✅ Approved**: Proceed to `/execute [feature-name]`
- **⚠️ Needs Revision**: Update plan based on feedback, then re-review
- **❌ Rejected**: Regenerate plan with corrections

### Review Type: Code

#### 1. Check Implementation Status
// turbo
```bash
# Check if implementation is complete
git status
git diff
```

#### 2. Read Plan to Understand Intent
Read `plans/[feature-name].md` to understand what was intended.

#### 3. Verify Implementation Matches Plan
Check:
- [ ] All tasks from plan were completed
- [ ] Code matches plan's proposed changes
- [ ] All validations passed
- [ ] Testing was performed

#### 4. Review Code Quality
Check:
- [ ] Follows project conventions
- [ ] TypeScript types are correct
- [ ] No obvious bugs
- [ ] Handles edge cases
- [ ] Error handling is appropriate

#### 5. Test in Browser
// turbo
```bash
npm run dev
```

Verify:
- [ ] Feature works as expected
- [ ] No console errors
- [ ] No regressions
- [ ] Responsive design works

#### 6. Document Review Feedback
Add review section to plan or create review document:

```markdown
## Code Review Status

- [ ] Code reviewed by: [reviewer]
- [ ] Review date: [date]
- [ ] Status: ✅ Approved / ⚠️ Needs Changes / ❌ Rejected

### Review Feedback
[Any feedback, bugs found, or suggestions]

### Issues Found
- [ ] [Issue 1: description]
- [ ] [Issue 2: description]

### Approved
- [x] Implementation matches plan
- [x] Code quality is good
- [x] Feature works correctly
```

#### 7. Decision Point
- **✅ Approved**: Proceed to `/commit`
- **⚠️ Needs Changes**: Fix issues, then re-review
- **❌ Rejected**: Major changes needed, update plan and re-implement

## Return Condition
Return when:
1. Review is complete
2. Feedback is documented
3. Decision (approved/needs revision/rejected) is clear
4. Next steps are identified

## Output Format

### Research Review
```
🔍 Research Review: docs/research/[feature-name].md
✅ Quality: [assessment]
📝 Feedback: [summary]
🎯 Decision: ✅ Approved / ⚠️ Needs Revision / ❌ Rejected
📝 Next: [next step]
```

### Plan Review
```
📋 Plan Review: plans/[feature-name].md
✅ Quality: [assessment]
📝 Feedback: [summary]
🎯 Decision: ✅ Approved / ⚠️ Needs Revision / ❌ Rejected
📝 Next: [next step]
```

### Code Review
```
💻 Code Review: [feature-name]
✅ Implementation: [assessment]
📝 Feedback: [summary]
🎯 Decision: ✅ Approved / ⚠️ Needs Changes / ❌ Rejected
📝 Next: [next step]
```

## Tips
1. **Review early**: Research and plan reviews have highest leverage
2. **Be specific**: Point to exact lines, files, or sections
3. **Check alignment**: Ensure each phase aligns with previous phase
4. **Test assumptions**: Verify code snippets and patterns are correct
5. **Document decisions**: Clear feedback helps future iterations

