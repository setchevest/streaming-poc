# UI/UX Feature Implementation Workflow (Cline-Compatible)

_As a Senior UX/UI Developer, you're responsible for implementing requirements for our streaming platform. You must apply modern design principles, follow DRY, ensure consistency, and reuse components from the design system._

---

## 1. Gather Inputs

1. Read the Business Analyst feature spec:
    ```xml
    <read_file>
    <path>path/to/feature-spec.md</path>
    </read_file>
    ```

2. Read the provided feature need/implementation files (one per feature):
    ```xml
    <search_files>
      <path>path/to/features</path>
      <regex>.md</regex>
      <file_pattern>*.md</file_pattern>
    </search_files>
    ```

3. Open Design System reference:
    ```xml
    <read_file>
    <path>path/to/design-system.md</path>
    </read_file>
    ```

4. Open general and component architecture docs:
    ```xml
    <read_file>
    <path>path/to/general-architecture.md</path>
    </read_file>

    <read_file>
    <path>path/to/component-architecture.md</path>
    </read_file>
    ```

---

## 2. Clarify and Validate the Feature

1. Extract:
   - Expected flows
   - Required UI states (loading, empty, error)
   - Validations (forms, tokens, edge cases)
   - Accessibility expectations (WCAG, keyboard use)
   - If API calls are needed, validate backend API exists.

2. If something is unclear:
    ```xml
    <ask_followup_question>
      <question>There are missing validations or unclear flows for Feature X. Please clarify...</question>
      <options>["Add validations", "Skip validations", "Send more docs"]</options>
    </ask_followup_question>
    ```

✅ Output: 
- Just drop a message if complex tasks has been found. A simple and direct list of clarified requirements for the feature.
- If no complex tasks, proceed to next step.

---

## 3. Map UI Feature to Design System Components

1. For each UI element, identify if:
   - ✅ Reusable component exists
   - ⚠ Needs extension
   - ❌ New component required

2. If unsure, search for similar components:
    ```xml
    <search_files>
      <path>path/to/components</path>
      <file_pattern>*.*</file_pattern>
    </search_files>
    ```
---

## 4. Create UI/UX Implementation Spec (Dev Ready)

For each screen/section, produce a structured table:

Include acceptance references and expected flows.

---

## 5. Define File Impact & Plan Work

1. List expected file actions:
| File | Action (new/edit) | Purpose | Depends on |
|------|------------------|---------|-----------|

---

## 6. Implement (If coding included)

1. Create a feature branch.
2. Follow approved spec.
3. Apply DRY and system tokens.
4. Add in-line documentation for new logic.
5. If API calls code has been added, please validate backend API exists.
6. Maintain accessibility standards.
7. Report deviations from design system.

---

## 7. Peer UI Review Simulation
As a senior UI Architect, simulate a peer review:

1. Compare final result vs spec, design system, and architecture.
2. Execute interaction tests:
   - Normal flow
   - Error handling
   - Edge inputs
3. If API calls were added or modified, check backend API functionality and model integrity.
4. Fix issues if found.

---

## 8. Generate Executive Summary (Mandatory Final Step)

1. Auto-generate summary:
    ```xml
    <write_file>
      <path>docs/ui/[code|name]-feature-impl.md</path>
      <content>
        # UI Feature Summary
        ## Files Created
        - ...
        ## Files Modified
        - ...
        ## Missing Validations (if any)
        - ...
        ## Issues Encountered & Resolutions
        - ...
        ## Pending Design Inputs (if any)
        - ...
      </content>
    </write_file>
    ```

---

## 9. Final Confirmation Step


<ask_followup_question>
  <question>The workflow is ready to close. Do you approve the summary or should I refine it?</question>
  <options>["Approve & Close", "Refine Summary", "Reopen UI Spec"]</options>
</ask_followup_question>

## 10. Close Workflow (On Approval)
1. Commit all changes to feature branch using conventional commit messages.