# Core Libraries Used in This Project

This document defines the **core libraries**, their **single responsibility**, and **strict usage rules**.  
Each library exists for **one clear purpose**. Overlap is intentional avoided.

---

## react-router-dom

**Purpose:** Routing (page-level only)

Handles client-side navigation and URL-based page rendering.  
Used strictly for defining routes and layouts, not for state or data handling.

### Why it exists

- Declarative routing
- URL-driven navigation
- Lazy loading and nested routes
- Clear separation between pages and features

### Rules

- Used only at the page/layout level
- No business logic in routes
- No data fetching inside route definitions
- Pages orchestrate features, they do not implement logic

---

## axios

**Purpose:** API client

Responsible for making HTTP requests to the backend.  
Chosen for its simplicity, interceptors, and predictable API.

### Why it exists

- Clean request/response handling
- Request/response interceptors (auth, errors)
- Better control than `fetch` for real-world applications
- Centralized API configuration

### Rules

- All HTTP calls go through `apiClient`
- No direct `fetch` usage
- No API calls inside components
- Errors are allowed to propagate (handled by React Query)

---

## @tanstack/react-query

**Purpose:** Server state

Manages all **server-derived data**: fetching, caching, syncing, and background updates.  
Redux is **not** used for server data.

### Why it exists

- Automatic caching and re-fetching
- Built-in loading and error states
- Background synchronization
- Stale data control
- Eliminates manual async state management

### Rules

- All server data uses React Query
- Query keys must be defined as constants
- API calls are delegated to `services/`
- Components never call APIs directly
- Mutations must invalidate related queries

---

## @reduxjs/toolkit

**Purpose:** Client state

Handles **persistent or cross-component client-side state**  
(e.g. auth flags, UI preferences, selections).

### Why it exists

- Predictable state container
- Simplified Redux setup
- Centralized client-only state
- Easy debugging and inspection

### Rules

- Redux is NOT used for server data
- Redux slices contain no API calls
- Feature-specific state lives in feature slices
- Global state lives in `store/`
- Use only when state is shared or persistent

---

## react-redux

**Purpose:** Redux bindings for React

Connects Redux state and actions to React components.

### Why it exists

- Provides `Provider`, `useSelector`, and `useDispatch`
- Enables efficient React–Redux integration
- Typed hooks for safety and consistency

### Rules

- Use typed hooks (`useAppDispatch`, `useAppSelector`)
- No direct store access in components
- Redux logic stays outside UI components

---

## tailwindcss

**Purpose:** Styling system

Tailwind is the **only styling solution** used in the project.  
It provides utility-first, explicit, and predictable styling.

### Why it exists

- Eliminates custom CSS sprawl
- Keeps styling colocated with components
- Encourages consistency through utilities
- Avoids runtime CSS-in-JS overhead
- Scales well with component-based architecture

### Rules

- No CSS-in-JS libraries
- No inline `<style>` blocks
- Minimal custom CSS files
- Styling is applied via class names
- Tailwind handles **appearance only**, not behavior

---

## shadcn/ui

**Purpose:** Shared UI primitives

shadcn/ui provides **accessible, unopinionated UI components** generated directly into the codebase.  
These components act as **dumb building blocks**.

### Why it exists

- Accessibility by default
- Full ownership of component code
- No runtime dependency or abstraction
- Composable with Tailwind
- Zero vendor lock-in

### Rules (Strict)

- Components live in `src/components/ui/`
- No business logic inside shadcn components
- No imports from:
  - `features/`
  - `services/`
  - `store/`
- Components accept data and handlers only via props
- Feature behavior is implemented by wrapping shadcn components inside feature components

shadcn/ui defines **how UI looks**, never **what the app does**.

---

## zod

**Purpose:** Runtime data validation at boundaries

Zod is used to **validate untrusted data at runtime**.  
TypeScript alone is insufficient because it does not exist at runtime.

### Why it exists

- Prevents invalid data from entering the system
- Catches backend contract changes early
- Provides a single source of truth for data shape
- Enables safe data transformation

### Primary use cases

- Environment variable validation
- API request validation (before sending)
- API response validation (after receiving)
- Form input validation
- Validation of persisted client data (e.g. `localStorage`)

### Rules (Strict)

- Zod is used **only at boundaries**
- Zod schemas live in:
  - `src/config/` (environment)
  - `features/*/schemas/` (feature boundaries)
  - `src/schemas/` (shared validators)
- Zod is not used inside UI components
- Zod is not used for internal function parameters
- Types are derived from schemas using `z.infer`

Zod guards **entry points**, not internal logic.

---

## State & Responsibility Summary

| Concern             | Library / Tool        |
| ------------------- | --------------------- |
| Routing             | react-router-dom      |
| API calls           | axios                 |
| Server state        | @tanstack/react-query |
| Client state        | @reduxjs/toolkit      |
| React–Redux binding | react-redux           |
| Styling             | tailwindcss           |
| UI primitives       | shadcn/ui             |
| Runtime validation  | zod                   |

---

## Final Rules of Thumb

- Navigation → React Router
- HTTP → Axios
- Server data → React Query
- Client/UI state → Redux Toolkit
- Styling → Tailwind
- UI building blocks → shadcn/ui
- Runtime validation → Zod

Each tool has **one job**.

---
