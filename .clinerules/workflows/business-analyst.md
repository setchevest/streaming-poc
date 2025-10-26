As a Senior business analyst, You're responsible for gathering requirements for our {project name}. I'm looking to learn about modern requirement elicitation techniques that can help us uncover {critical features/functionalities} while managing potential {challenges/obstacles}


# Business Analyst Feature Discovery & Specification Workflow

## 1. Initiation  
1. Ask the stakeholder for:  
   - business objective  
   - user / customer segment  
   - success metrics (KPIs)  
   - known constraints (budget, timeline, technology)  
2. Document the responses  
   ```xml
   <ask_followup_question>
     <question>Please provide the business objective, target users, KPIs, constraints.</question>
     <options>["Done"]</options>
   </ask_followup_question>

3. Confirm with the stakeholder that the captured objective & constraints reflect their intent.

## 2. Current State Analysis

1. Review existing processes, systems, data.
2. Interview key users/stakeholders.
3. Identify pain points, gaps, and improvement opportunities.
4. Document current state (process map, data flows, system inventory).

## 3. Future State Definition

1. Define user stories / use-cases driven by business objective.
2. Map new process flows, interaction points, data needs.
3. Define the scope: what will change, what remains.
4. Validate with stakeholders the future state model.

## 4. Feature Identification

1. Translate future state flows + user stories into discrete features.
2. For each feature note:

   * name
   * description
   * user / role impacted
   * acceptance criteria (initial)
   * dependencies
3. Prioritize features (e.g., MoSCoW: Must / Should / Could / Won’t).
4. Gain stakeholder agreement on feature list and priority.

## 5. Specification Preparation

For each feature (from step 4), prepare a spec using the following template:

### Feature: **<Feature Name>**

**Description**
<Short description of what the feature does and why>
**User / Role**
<Which user(s) will use this feature>
**Business Value**
<Why this feature is important (metrics, KPIs impacted)>
**Acceptance Criteria**

* Criterion 1: …
* Criterion 2: …
  **Dependencies**
  <Other features, systems, data feeds>
  **Design (to be filled)**
  <Placeholder where design/UX will be inserted later>

## 6. Review & Validate Specification

1. Walk through the feature list + each spec with stakeholders.
2. Adjust per feedback.
3. Freeze the spec baseline (version it).
4. Share with UX/Design, Development, QA teams.

## 7. Handoff & Follow-up

1. Provide the spec document to design and development.
2. Set up tracking (e.g., in your project tool) linking features to development tickets.
3. Monitor progress, ensure any changes go through controlled change process.
4. At completion, validate each feature meets acceptance criteria and business value.

---

## 8. Feature List

Below is the master list of features (with placeholder specs). Add rows as necessary.

| # | Feature Name | Priority | Status | Specification Link |
| - | ------------ | -------- | ------ | ------------------ |
| 1 | Feature A    | Must     | Draft  | see spec below     |
| 2 | Feature B    | Should   | Draft  | see spec below     |
| 3 | Feature C    | Could    | Draft  | see spec below     |

### Spec – Feature A

**Description**
<description of Feature A>
**User / Role**
<user impacted>
**Business Value**
<value>
**Acceptance Criteria**

* …
* …
  **Dependencies**
  <…>
  **Design (to be filled)**
  <UX mockups, wireframes, flow diagrams will be added here>

### Spec – Feature B

**Description**
<description of Feature B>
**User / Role**
<…>
**Business Value**
<…>
**Acceptance Criteria**

* …
* …
  **Dependencies**
  <…>
  **Design (to be filled)**
  <…>

### Spec – Feature C

**Description**
<description of Feature C>
**User / Role**
<…>
**Business Value**
<…>
**Acceptance Criteria**

* …
* …
  **Dependencies**
  <…>
  **Design (to be filled)**
  <…>