# Research Documents

Research documents created during the **Research Phase** of the RPI workflow.

## Workflow

Created by: `/research {feature-name}`

```
/prime → /research {feature-name} → /review research {feature-name} → /planning → ...
```

## Purpose

Research documents serve as **compressed truth** about the system:
- Document actual code behavior (not assumptions)
- Identify key patterns and constraints
- Find similar implementations
- Create reusable knowledge artifacts
- Prevent AI from "making stuff up"

## When to Use

**Use research for:**
- Medium complexity features (new blocks, single features)
- Complex features (major refactors, multi-repo changes)
- Features requiring pattern understanding

**Skip research for:**
- Simple UI changes (button colors, text updates)
- Single-file modifications
- Trivial fixes

## Document Structure

Each research document should include:
1. **System Overview** - Current system behavior
2. **Relevant Files** - Files involved with their roles
3. **Patterns & Constraints** - Key patterns to follow
4. **Similar Implementations** - Existing code examples
5. **Dependencies** - What this feature depends on

## File Naming

- `{feature-name}.md` - Feature research (e.g., `directus-backend-sdk.md`)
- `{technology}-{topic}.md` - Technology research

## Current Documents

- `directus-backend-sdk.md` - Directus SDK integration patterns
- `directus-templates.md` - Directus template system research

