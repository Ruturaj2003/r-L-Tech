# Core Libraries Used in This Project

---

## react-router-dom

**Purpose:** Routing (page-level only)

Handles client-side navigation and URL-based page rendering.  
Used strictly for defining routes and layouts, not for state or data handling.

Why it exists:

- Declarative routing
- URL-driven navigation
- Lazy loading and nested routes

---

## axios

**Purpose:** API client

Responsible for making HTTP requests to the backend.  
Chosen for its simplicity, interceptors, and predictable API.

Why it exists:

- Clean request/response handling
- Request/response interceptors (auth, errors)
- Better control than `fetch` for real-world apps

---

## @tanstack/react-query

**Purpose:** Server state

Manages all **server-derived data**: fetching, caching, syncing, and background updates.  
Redux is **not** used for server data.

Why it exists:

- Automatic caching and re-fetching
- Loading and error state management
- Background sync and stale data control
- Eliminates manual async state logic

---

## @reduxjs/toolkit

**Purpose:** Client state

Handles **global client-side state** that is not tied to the server  
(e.g. UI state, auth flags, preferences).

Why it exists:

- Predictable state container
- Simplified Redux setup (less boilerplate)
- Centralized client-only state

---

## react-redux

**Purpose:** Redux bindings for React

Connects Redux state and actions to React components.

Why it exists:

- Provides `Provider`, `useSelector`, and `useDispatch`
- Enables efficient React–Redux integration

---

## State Responsibility Summary

| Concern       | Library               |
| ------------- | --------------------- |
| Routing       | react-router-dom      |
| API calls     | axios                 |
| Server state  | @tanstack/react-query |
| Client state  | @reduxjs/toolkit      |
| React binding | react-redux           |

---

**Rule of thumb:**

- Server data → React Query
- Client/UI state → Redux
- Navigation → React Router
- HTTP → Axios
