

# Theme Token System

## Scope

This document defines the **only allowed theme tokens** and their **correct usage** across the application.

All UI styling must use these tokens.

---

## Global Rules

* Components **must not** use raw colors
* Components **must not** reference Tailwind color palettes
* Components **must not** invent new tokens
* Tokens are selected by **semantic meaning**, not appearance
* Visual changes are handled **only in the theme layer**

---

## Token Groups

---

## 1. Brand & Action Tokens

Used for **user actions, emphasis, and state**.

### `primary`

**Use when**

* The action is the main or default action
* The state represents “selected” or “active”

**Examples**

* Primary button: `Save`, `Submit`, `Create`
* Active navigation item
* Selected tab
* Selected table row
* Confirm action in dialogs

---

### `primary-foreground`

**Use when**

* Text or icons are rendered on a `primary` background

**Examples**

* Button label text
* Icons inside primary buttons

---

### `secondary`

**Use when**

* Action is optional or alternative
* Should not compete with the primary action

**Examples**

* `Cancel` button
* Secondary CTA next to primary
* Less prominent toolbar actions

---

### `secondary-foreground`

Text or icons rendered on `secondary`.

---

### `accent`

**Use when**

* Highlighting without strong emphasis
* UI feedback that is not an action

**Examples**

* Hover background on table rows
* Active filter chip background
* Hover state for list items
* Non-critical highlights

---

### `accent-foreground`

Text or icons rendered on `accent`.

---

## 2. Layout & Surface Tokens

Used for **structural layout**, not actions.

### `background`

**Use when**

* Styling the application or page root

**Examples**

* App shell background
* Page background

**Do not use**

* Cards
* Panels
* Sections

---

### `foreground`

**Use when**

* Default text on `background`

**Examples**

* Page body text
* Default labels

---

### `card`

**Use when**

* Content is visually elevated above background

**Examples**

* Cards
* Panels
* Modals
* Settings sections
* Dashboards widgets

---

### `card-foreground`

Text or icons rendered inside cards.

---

### `muted`

**Use when**

* Surface needs reduced emphasis

**Examples**

* Disabled rows
* Empty state containers
* Secondary panels
* Read-only sections

---

### `muted-foreground`

**Use when**

* Text should be visible but de-emphasized

**Examples**

* Helper text
* Descriptions
* Placeholder text
* Disabled labels
* Metadata (timestamps, IDs)

---

## 3. Border & Focus Tokens

Used for **structure and accessibility only**.

### `border`

**Use when**

* Separating UI regions

**Examples**

* Card borders
* Section dividers
* Table grid lines
* Sidebar separators

---

### `input`

**Use when**

* Styling form control borders

**Examples**

* Input fields
* Select dropdowns
* Textareas

**Do not use**

* Layout borders
* Cards or sections

---

### `ring`

**Use when**

* Focus indicators are required

**Examples**

* Keyboard focus outline on inputs
* Button focus state
* Accessible navigation focus

**Rule**

* Must never be replaced or overridden

---

## 4. Semantic Feedback Tokens

Used for **system meaning**, not decoration.

### `success`

**Use when**

* Action completed successfully
* State represents healthy or valid

**Examples**

* Success alerts
* “Saved successfully” messages
* Active / valid status indicators

---

### `success-foreground`

Text or icons on success background.

---

### `warning`

**Use when**

* Attention is required
* Action is allowed but risky

**Examples**

* Unsaved changes warning
* Approaching limits
* Incomplete configuration

---

### `warning-foreground`

Text or icons on warning background.

---

### `destructive`

**Use when**

* Action is dangerous or irreversible
* State represents failure or error

**Examples**

* Delete actions
* Remove user
* Error banners
* Failed operations

---

### `destructive-foreground`

Text or icons on destructive background.

---

## Decision Table

| Scenario                     | Token              |
| ---------------------------- | ------------------ |
| Main action button           | `primary`          |
| Cancel / alternative action  | `secondary`        |
| Row hover / subtle highlight | `accent`           |
| App/page background          | `background`       |
| Card / panel surface         | `card`             |
| Helper or placeholder text   | `muted-foreground` |
| Disabled surface             | `muted`            |
| Borders and dividers         | `border`           |
| Input borders                | `input`            |
| Focus outline                | `ring`             |
| Success message/state        | `success`          |
| Warning message/state        | `warning`          |
| Delete / error               | `destructive`      |

---

## Non-Negotiable Rules

* Never select tokens by visual preference
* Never use `destructive` because it “looks red”
* Never adjust meaning to fit color
* If meaning is wrong, the token is wrong

---


## Component → Token Mapping

This section defines **exact token usage per component**.
Components must not deviate from this mapping.

---

## Button

### Primary Button

**Tokens**

* Background: `primary`
* Text/Icon: `primary-foreground`
* Focus: `ring`

**Examples**

* Save
* Submit
* Create
* Confirm

---

### Secondary Button

**Tokens**

* Background: `secondary`
* Text/Icon: `secondary-foreground`
* Focus: `ring`

**Examples**

* Cancel
* Back
* Optional actions

---

### Destructive Button

**Tokens**

* Background: `destructive`
* Text/Icon: `destructive-foreground`
* Focus: `ring`

**Examples**

* Delete
* Remove
* Reset data

---

### Ghost / Text Button

**Tokens**

* Text/Icon: `foreground`
* Hover background: `accent`
* Focus: `ring`

**Examples**

* Inline actions
* Toolbar text buttons

---

## Input (Text, Number, Email, Password)

**Tokens**

* Background: `background`
* Border: `input`
* Text: `foreground`
* Placeholder: `muted-foreground`
* Focus ring: `ring`
* Disabled background: `muted`
* Disabled text: `muted-foreground`

**Examples**

* Form fields
* Search inputs

---

## Select / Dropdown

**Tokens**

* Trigger background: `background`
* Trigger border: `input`
* Trigger text: `foreground`
* Placeholder: `muted-foreground`
* Menu background: `card`
* Menu text: `card-foreground`
* Hover option background: `accent`
* Focus ring: `ring`

---

## Checkbox / Radio / Switch

**Unchecked**

* Border: `input`
* Background: `background`

**Checked**

* Background: `primary`
* Icon: `primary-foreground`

**Disabled**

* Background: `muted`
* Border/Text: `muted-foreground`

**Focus**

* Ring: `ring`

---

## Card

**Tokens**

* Background: `card`
* Text: `card-foreground`
* Border (optional): `border`

**Examples**

* Dashboard widgets
* Settings sections
* Summary panels

---

## Modal / Dialog

**Tokens**

* Overlay: `background`
* Container background: `card`
* Text: `card-foreground`
* Border: `border`
* Focus ring: `ring`

**Buttons**

* Follow Button mappings exactly

---

## Table

### Table Container

**Tokens**

* Background: `card`
* Border: `border`
* Text: `card-foreground`

---

### Table Header

**Tokens**

* Background: `muted`
* Text: `muted-foreground`
* Border: `border`

---

### Table Row

**Default**

* Background: `card`
* Text: `card-foreground`

**Hover**

* Background: `accent`

**Selected**

* Background: `primary`
* Text: `primary-foreground`

**Disabled**

* Background: `muted`
* Text: `muted-foreground`

---

## Badge / Chip

### Default

**Tokens**

* Background: `muted`
* Text: `muted-foreground`

---

### Accent

**Tokens**

* Background: `accent`
* Text: `accent-foreground`

---

### Success

**Tokens**

* Background: `success`
* Text: `success-foreground`

---

### Warning

**Tokens**

* Background: `warning`
* Text: `warning-foreground`

---

### Destructive

**Tokens**

* Background: `destructive`
* Text: `destructive-foreground`

---

## Alert

### Success Alert

**Tokens**

* Background: `success`
* Text: `success-foreground`

---

### Warning Alert

**Tokens**

* Background: `warning`
* Text: `warning-foreground`

---

### Error Alert

**Tokens**

* Background: `destructive`
* Text: `destructive-foreground`

---

## Tabs

### Tab List

**Tokens**

* Border bottom: `border`

---

### Tab (Inactive)

**Tokens**

* Text: `muted-foreground`
* Hover background: `accent`

---

### Tab (Active)

**Tokens**

* Background: `primary`
* Text: `primary-foreground`

---

## Tooltip

**Tokens**

* Background: `card`
* Text: `card-foreground`
* Border: `border`

---

## Empty State

**Tokens**

* Container background: `muted`
* Title text: `foreground`
* Description text: `muted-foreground`
* Action button: follow Button mapping

---

## Status Indicators (Inline)

**Success**

* Background: `success`
* Text/Icon: `success-foreground`

**Warning**

* Background: `warning`
* Text/Icon: `warning-foreground`

**Error**

* Background: `destructive`
* Text/Icon: `destructive-foreground`

---

## Review Rules

* Component implementations must match this mapping exactly
* Deviations require design approval
* Visual correctness does not override semantic correctness
* Token misuse is a blocking review issue

---


