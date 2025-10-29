# Claude Code Slash Commands

This directory contains custom slash commands for the streaming platform project.

## Available Commands

### `/ui-feature`

**Purpose**: Implement UI/UX features following a structured 10-step workflow with design system compliance.

**When to use**:
- Adding new pages or components to the frontend
- Implementing user-facing features
- Need to ensure design system consistency
- Require comprehensive documentation of changes

**What it does**:
1. Gathers requirements from specs and design system docs
2. Validates feature flows, states, and accessibility requirements
3. Maps feature to existing components (reuse vs. create new)
4. Creates detailed implementation specification
5. Plans file changes and dependencies
6. Implements the feature with proper error handling
7. Performs automated peer review simulation
8. Generates executive summary documentation
9. Gets user approval before finalizing
10. Handles git workflow with conventional commits

**Example usage**:
```
/ui-feature

Then provide:
- Feature name: "Live chat sidebar"
- Spec path: docs/specs/live-chat.md
- Goal: Full implementation
```

**Output**:
- Implemented feature code (TypeScript, React, Tailwind)
- Executive summary in `docs/ui/[feature-name]-implementation.md`
- Git commit with conventional format (optional)

## Creating New Commands

To add a new slash command:

1. Create a new `.md` file in this directory
2. Add a frontmatter description:
   ```markdown
   ---
   description: Brief description of the command
   ---
   ```
3. Write the command prompt/instructions
4. Test by invoking with `/command-name`

See [Claude Code documentation](https://docs.claude.com/claude-code) for more details.
