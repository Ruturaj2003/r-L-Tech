# Frontend Architecture Standard for Production

## Executive Summary

This document defines the architectural standard for a React-based  frontend designed for long-term maintainability, team scalability, and deterministic AI-assisted development.

**Core Philosophy: Boring is Better**

-   Predictability over flexibility
-   Explicit over implicit
-   Duplication over wrong abstraction
-   Convention over configuration

----------

## 1. Project Structure

### 1.1 Root Folder Layout

```
src/
├── features/              # Feature modules (business domains)
├── components/            # Shared UI components only
├── hooks/                 # Shared custom hooks
├── store/                 # Redux Toolkit store configuration
├── services/              # API clients and external integrations
├── utils/                 # Pure utility functions
├── types/                 # Shared TypeScript types
├── constants/             # App-wide constants
├── config/                # Environment and app configuration
└── App.tsx                # Root component

```

**Rules:**

-   **Never** put business logic in `components/`, `hooks/`, or `utils/`
-   **Never** import from `features/` into shared folders (one-way dependency)
-   **Always** keep features isolated from each other (no cross-feature imports)

----------

## 2. Feature Module Structure

Features are **self-contained business domains**. Each feature owns its complete vertical slice.

### 2.1 Feature Folder Template

```
features/
└── inventory/                    # Feature name (singular noun)
    ├── components/               # Feature-specific components
    │   ├── InventoryList.tsx
    │   ├── InventoryForm.tsx
    │   └── InventoryFilters.tsx
    ├── hooks/                    # Feature-specific hooks
    │   ├── useInventoryFilters.ts
    │   └── useInventoryValidation.ts
    ├── services/                 # Feature API calls
    │   └── inventoryApi.ts
    ├── store/                    # Feature Redux slices
    │   └── inventorySlice.ts
    ├── types/                    # Feature-specific types
    │   └── inventory.types.ts
    ├── utils/                    # Feature-specific utilities
    │   └── inventoryCalculations.ts
    └── index.ts                  # Public API (exports only)

```

### 2.2 Feature Boundaries

**DO:**

-   Keep all feature logic within its folder
-   Export only what's needed through `index.ts`
-   Treat each feature as a mini-application

**DON'T:**

-   Import directly from another feature's internals
-   Share components between features (promote to `src/components/` instead)
-   Let features know about each other's implementation details

### 2.3 Feature Index Pattern

```typescript
// features/inventory/index.ts
// Public API - only export what external code needs

export { default as InventoryPage } from './components/InventoryPage';
export { useInventoryQuery } from './hooks/useInventoryQuery';
export type { InventoryItem, InventoryFilters } from './types/inventory.types';

// Everything else stays private to the feature

```

----------

## 3. Component Architecture
### 3.1 Component Categories

| Category              | Location                                      | Purpose                          | Can Use                                   |
|-----------------------|-----------------------------------------------|----------------------------------|-------------------------------------------|
| **Shared UI**         | `src/components/`                             | Reusable, business-agnostic UI   | Only props, no business logic              |
| **Feature Components**| `features/{name}/components/`                | Feature-specific UI              | Feature hooks, services, store             |
| **Page Components**   | `features/{name}/components/{Name}Page.tsx`  | Route entry points               | Orchestrates feature logic                 |

### 3.2 Component File Naming

```
components/
├── Button.tsx              # PascalCase, singular
├── DataTable.tsx           # Compound words concatenated
├── Modal/                  # Folder if >1 file needed
│   ├── Modal.tsx
│   ├── Modal.styles.ts
│   └── index.ts

```

**Rules:**

-   One component per file (except related sub-components)
-   File name = export name
-   Use `index.ts` only when component has multiple files

### 3.3 Shared Component Template

```typescript
// src/components/DataTable.tsx
import { ReactNode } from 'react';

/**
 * Generic data table for displaying tabular data
 * @example
 * <DataTable
 *   columns={[{ key: 'name', header: 'Name' }]}
 *   data={items}
 * />
 */
export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  loading = false,
}: DataTableProps<T>) {
  // Only UI logic - no business logic, no API calls
  return (
    <table>
      {/* Implementation */}
    </table>
  );
}

```

**Shared Component Rules:**

-   **NEVER** import from `features/`, `store/`, or `services/`
-   **NEVER** contain business logic or data fetching
-   **ALWAYS** accept data via props
-   **ALWAYS** include JSDoc with example

### 3.4 Feature Component Template

```typescript
// features/inventory/components/InventoryList.tsx
import { DataTable } from '@/components/DataTable';
import { useInventoryQuery } from '../hooks/useInventoryQuery';
import { formatInventoryStatus } from '../utils/inventoryFormatters';
import type { InventoryItem } from '../types/inventory.types';

export function InventoryList() {
  // Data fetching via React Query hook
  const { data: items, isLoading } = useInventoryQuery();
  
  // Feature-specific logic
  const columns = [
    { key: 'sku', header: 'SKU' },
    { key: 'name', header: 'Product Name' },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: InventoryItem) => formatInventoryStatus(item.status)
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items ?? []}
      loading={isLoading}
    />
  );
}

```

### 3.5 Page Component Pattern

Page components are **orchestrators** - they compose feature components and manage routing concerns.

```typescript
// features/inventory/components/InventoryPage.tsx
import { InventoryList } from './InventoryList';
import { InventoryFilters } from './InventoryFilters';
import { PageLayout } from '@/components/PageLayout';

export default function InventoryPage() {
  return (
    <PageLayout title="Inventory Management">
      <InventoryFilters />
      <InventoryList />
    </PageLayout>
  );
}

```

**Page Component Rules:**

-   Default export (for lazy loading)
-   Suffix with `Page`
-   One page per route
-   Minimal logic - delegates to child components

----------

## 4. State Management Strategy


### 4.1 State Classification

| State Type              | Tool            | Location                     | Use Cases                                  |
|-------------------------|-----------------|------------------------------|---------------------------------------------|
| **Server State**        | React Query     | Feature services             | API data, caching                           |
| **Global Client State** | Redux Toolkit   | `store/` or feature slice    | Cross-feature shared state                  |
| **Local Client State**  | Redux Toolkit   | Feature slice                | Feature-specific complex state              |
| **UI State**            | React `useState`| Component                    | Transient UI (modals, dropdowns)            |


### 4.2 Decision Tree

```
Is this data from the server?
├─ YES → Use React Query
└─ NO → Is it shared across features?
    ├─ YES → Use Redux (global slice)
    └─ NO → Is it complex (>3 related values)?
        ├─ YES → Use Redux (feature slice)
        └─ NO → Use React useState

```

### 4.3 React Query Implementation

```typescript
// features/inventory/services/inventoryApi.ts
import { apiClient } from '@/services/apiClient';
import type { InventoryItem, CreateInventoryDTO } from '../types/inventory.types';

export const inventoryApi = {
  getAll: async (): Promise<InventoryItem[]> => {
    const response = await apiClient.get('/inventory');
    return response.data;
  },

  getById: async (id: string): Promise<InventoryItem> => {
    const response = await apiClient.get(`/inventory/${id}`);
    return response.data;
  },

  create: async (data: CreateInventoryDTO): Promise<InventoryItem> => {
    const response = await apiClient.post('/inventory', data);
    return response.data;
  },
};

// features/inventory/hooks/useInventoryQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../services/inventoryApi';

const QUERY_KEYS = {
  all: ['inventory'] as const,
  detail: (id: string) => ['inventory', id] as const,
};

export function useInventoryQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.all,
    queryFn: inventoryApi.getAll,
  });
}

export function useInventoryDetailQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => inventoryApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateInventoryMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
    },
  });
}

```

**React Query Rules:**

-   **ALWAYS** define query keys as constants
-   **ALWAYS** put API calls in `services/`
-   **ALWAYS** put hooks in `hooks/`
-   **NEVER** call API directly from components
-   **ALWAYS** invalidate related queries on mutation

### 4.4 Redux Toolkit Implementation

#### Global Store Setup

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Feature slices registered here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

```

#### Feature Slice Pattern

```typescript
// features/inventory/store/inventorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { InventoryFilters } from '../types/inventory.types';

interface InventoryState {
  filters: InventoryFilters;
  selectedIds: string[];
}

const initialState: InventoryState = {
  filters: {
    status: 'all',
    category: null,
    searchTerm: '',
  },
  selectedIds: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<InventoryFilters>) => {
      state.filters = action.payload;
    },
    toggleSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedIds.indexOf(id);
      if (index > -1) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(id);
      }
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
  },
});

export const { setFilters, toggleSelection, clearSelection } = inventorySlice.actions;
export default inventorySlice.reducer;

// Selectors
export const selectInventoryFilters = (state: RootState) => state.inventory.filters;
export const selectSelectedIds = (state: RootState) => state.inventory.selectedIds;

```

**Redux Rules:**

-   **ALWAYS** use Redux Toolkit (never plain Redux)
-   **ALWAYS** co-locate selectors with slice
-   **NEVER** put API calls in slices (use React Query)
-   **ONLY** use for client state that needs persistence or cross-component sharing

----------

## 5. Services Layer

### 5.1 API Client Setup

```typescript
// services/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    if (error.response?.status === 401) {
      // Handle auth errors
    }
    return Promise.reject(error);
  }
);

```

### 5.2 Feature Service Pattern

```typescript
// features/inventory/services/inventoryApi.ts
import { apiClient } from '@/services/apiClient';
import type { InventoryItem, CreateInventoryDTO, UpdateInventoryDTO } from '../types/inventory.types';

/**
 * Inventory API service
 * All server communication for inventory domain
 */
export const inventoryApi = {
  /**
   * Fetch all inventory items
   */
  getAll: async (): Promise<InventoryItem[]> => {
    const { data } = await apiClient.get('/inventory');
    return data;
  },

  /**
   * Fetch single inventory item
   */
  getById: async (id: string): Promise<InventoryItem> => {
    const { data } = await apiClient.get(`/inventory/${id}`);
    return data;
  },

  /**
   * Create new inventory item
   */
  create: async (dto: CreateInventoryDTO): Promise<InventoryItem> => {
    const { data } = await apiClient.post('/inventory', dto);
    return data;
  },

  /**
   * Update existing inventory item
   */
  update: async (id: string, dto: UpdateInventoryDTO): Promise<InventoryItem> => {
    const { data } = await apiClient.put(`/inventory/${id}`, dto);
    return data;
  },

  /**
   * Delete inventory item
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/inventory/${id}`);
  },
};

```

**Service Rules:**

-   **ALWAYS** use the shared `apiClient`
-   **ALWAYS** export plain async functions (not classes)
-   **ALWAYS** type request/response payloads
-   **NEVER** handle UI state in services
-   **ALWAYS** let errors propagate to React Query

----------

## 6. Custom Hooks

### 6.1 Shared Hooks

```typescript
// hooks/useDebounce.ts
import { useEffect, useState } from 'react';

/**
 * Debounces a value
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

```

### 6.2 Feature Hooks

```typescript
// features/inventory/hooks/useInventoryFilters.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, selectInventoryFilters } from '../store/inventorySlice';
import type { InventoryFilters } from '../types/inventory.types';

/**
 * Hook for managing inventory filters
 * Encapsulates filter state and update logic
 */
export function useInventoryFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectInventoryFilters);

  const updateFilters = useCallback(
    (newFilters: Partial<InventoryFilters>) => {
      dispatch(setFilters({ ...filters, ...newFilters }));
    },
    [dispatch, filters]
  );

  const resetFilters = useCallback(() => {
    dispatch(setFilters({
      status: 'all',
      category: null,
      searchTerm: '',
    }));
  }, [dispatch]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}

```

**Hook Rules:**

-   Prefix with `use`
-   **NEVER** put business logic in shared hooks
-   **ALWAYS** document parameters and return values
-   Feature hooks can use store/services; shared hooks cannot

----------

## 7. Utilities

### 7.1 Shared Utilities

```typescript
// utils/formatters.ts

/**
 * Format currency for display
 * @param amount - Amount in cents
 * @param currency - Currency code (default: USD)
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

/**
 * Format date for display
 * @param date - Date to format
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

```

### 7.2 Feature Utilities

```typescript
// features/inventory/utils/inventoryCalculations.ts
import type { InventoryItem } from '../types/inventory.types';

/**
 * Calculate total inventory value
 * @param items - Inventory items
 */
export function calculateTotalValue(items: InventoryItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.quantity * item.unitPrice);
  }, 0);
}

/**
 * Check if item is low stock
 * @param item - Inventory item
 */
export function isLowStock(item: InventoryItem): boolean {
  return item.quantity <= item.reorderPoint;
}

```

**Utility Rules:**

-   **ALWAYS** pure functions (no side effects)
-   **ALWAYS** JSDoc with examples
-   **NEVER** import React or hooks
-   **NEVER** access external state

----------

## 8. Type Definitions

### 8.1 Shared Types

```typescript
// types/common.types.ts

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

```

### 8.2 Feature Types

```typescript
// features/inventory/types/inventory.types.ts

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  reorderPoint: number;
  category: string;
  status: InventoryStatus;
  createdAt: string;
  updatedAt: string;
}

export type InventoryStatus = 'active' | 'discontinued' | 'out-of-stock';

export interface CreateInventoryDTO {
  sku: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  reorderPoint: number;
  category: string;
}

export interface UpdateInventoryDTO extends Partial<CreateInventoryDTO> {
  status?: InventoryStatus;
}

export interface InventoryFilters {
  status: InventoryStatus | 'all';
  category: string | null;
  searchTerm: string;
}

```

**Type Rules:**

-   **ALWAYS** define types/interfaces, never use `any`
-   **ALWAYS** suffix DTOs with `DTO`
-   **ALWAYS** use `type` for unions, `interface` for objects
-   **NEVER** export types from component files

----------

## 9. Naming Conventions


### 9.1 Files and Folders

| Type           | Convention                 | Example                                   |
|----------------|----------------------------|-------------------------------------------|
| Components     | PascalCase                 | `DataTable.tsx`, `UserProfile.tsx`         |
| Hooks          | camelCase with `use`       | `useAuth.ts`, `useInventoryQuery.ts`       |
| Services       | camelCase with `Api`       | `inventoryApi.ts`, `authApi.ts`            |
| Utilities      | camelCase                  | `formatters.ts`, `validators.ts`           |
| Types          | camelCase with `.types`    | `inventory.types.ts`, `common.types.ts`    |
| Redux Slices   | camelCase with `Slice`     | `inventorySlice.ts`, `authSlice.ts`        |


### 9.2 Variables and Functions

```typescript
// ✅ CORRECT
const userList = fetchUsers();
const isLoading = true;
const handleSubmit = () => {};
const formatCurrency = (amount: number) => {};

// ❌ WRONG
const UserList = fetchUsers();        // Not a component
const loading = true;                 // Ambiguous
const onSubmit = () => {};            // Use 'handle' prefix
const currencyFormatter = () => {};   // Use verb prefix

```

### 9.3 Constants

```typescript
// constants/api.constants.ts
export const API_ENDPOINTS = {
  INVENTORY: '/inventory',
  USERS: '/users',
} as const;

export const QUERY_KEYS = {
  INVENTORY: 'inventory',
  USERS: 'users',
} as const;

// ✅ CORRECT - SCREAMING_SNAKE_CASE for constants
export const MAX_UPLOAD_SIZE = 5_000_000;
export const DEFAULT_PAGE_SIZE = 20;

```

----------

## 10. Code Organization Rules

### 10.1 Import Order

```typescript
// 1. External dependencies
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal absolute imports (aliases)
import { Button } from '@/components/Button';
import { useAppDispatch } from '@/store/hooks';

// 3. Relative imports - types
import type { InventoryItem } from '../types/inventory.types';

// 4. Relative imports - code
import { inventoryApi } from '../services/inventoryApi';
import { formatCurrency } from '../utils/formatters';

// 5. Styles (if separate file)
import styles from './InventoryList.module.css';

```

### 10.2 Component File Structure

```typescript
// 1. Imports (as above)
import { useState } from 'react';

// 2. Types/Interfaces (if not in separate file)
interface ComponentProps {
  title: string;
  onSubmit: () => void;
}

// 3. Constants (component-scoped)
const MAX_ITEMS = 100;

// 4. Component
export function ComponentName({ title, onSubmit }: ComponentProps) {
  // 4a. Hooks
  const [value, setValue] = useState('');
  
  // 4b. Derived state
  const isValid = value.length > 0;
  
  // 4c. Event handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  // 4d. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 4e. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 5. Helper functions (prefer moving to utils/)
function helperFunction() {
  // ...
}

```

----------

## 11. Feature Development Workflow

### 11.1 Adding a New Feature

```bash
# 1. Create feature folder structure
features/
└── orders/
    ├── components/
    ├── hooks/
    ├── services/
    ├── store/
    ├── types/
    ├── utils/
    └── index.ts

```

```typescript
// 2. Define types first
// features/orders/types/orders.types.ts
export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

// 3. Create API service
// features/orders/services/ordersApi.ts
export const ordersApi = {
  getAll: async (): Promise<Order[]> => { /* ... */ },
  // ...
};

// 4. Create React Query hooks
// features/orders/hooks/useOrdersQuery.ts
export function useOrdersQuery() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
  });
}

// 5. Create Redux slice (if needed)
// features/orders/store/ordersSlice.ts
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: { /* ... */ },
});

// 6. Build components
// features/orders/components/OrdersList.tsx
export function OrdersList() {
  const { data } = useOrdersQuery();
  return <DataTable data={data} />;
}

// 7. Create page component
// features/orders/components/OrdersPage.tsx
export default function OrdersPage() {
  return <OrdersList />;
}

// 8. Export public API
// features/orders/index.ts
export { default as OrdersPage } from './components/OrdersPage';

```

### 11.2 Adding Shared Logic

**When to promote to shared:**

-   Used by 3+ features
-   Truly generic (no business logic)
-   Stable API (unlikely to change)

**Process:**

```typescript
// 1. Start in feature
features/inventory/utils/formatStatus.ts

// 2. When needed elsewhere, evaluate:
// - Is it generic? (YES: promote, NO: duplicate)
// - Does it have business logic? (YES: keep in feature, NO: promote)

// 3. Promote to shared with documentation
// utils/formatters.ts
/**
 * Format status badge display
 * Used by: inventory, orders, shipments
 */
export function formatStatus(status: string): string {
  // ...
}

```

### 11.3 Extending Existing Features

```typescript
// ✅ CORRECT - Add to feature
features/inventory/components/InventoryExport.tsx
features/inventory/hooks/useInventoryExport.ts

// ❌ WRONG - Don't scatter across codebase
components/InventoryExport.tsx  // Wrong location
hooks/useExport.ts              // Too generic

```

----------

## 12. Anti-Patterns and Prohibitions

### 12.1 Absolute Prohibitions

```typescript
// ❌ NEVER import between features
// features/orders/components/OrdersList.tsx
import { InventoryList } from '../../inventory/components/InventoryList'; // FORBIDDEN

// ✅ CORRECT - Promote to shared or compose at page level
import { DataTable } from '@/components/DataTable';

// ❌ NEVER put business logic in shared components
// components/ProductCard.tsx
export function ProductCard() {
  const { data } = useInventoryQuery(); // FORBIDDEN
  // ...
}

// ✅ CORRECT - Pass data via props
export function ProductCard({ product }: { product: Product }) {
  // ...
}

// ❌ NEVER use relative imports across feature boundaries
import { ordersApi } from '../orders/services/ordersApi'; // FORBIDDEN

// ❌ NEVER create circular dependencies
// features/inventory/utils/calculations.ts
import { useInventoryQuery } from '../hooks/useInventoryQuery'; // FORBIDDEN (hook imports service)

```

### 12.2 Code Smells

```typescript
// 🚩 RED FLAG - Generic names in features
features/inventory/utils/helpers.ts      // Too vague
features/inventory/hooks/useData.ts      // Too generic

// ✅ BETTER
features/inventory/utils/inventoryCalculations.ts
features/inventory/hooks/useInventoryData.ts

// 🚩 RED FLAG - God components
export function InventoryPage() {
  // 500 lines of code
  // Multiple API calls
  // Complex business logic
}

// ✅ BETTER - Split into focused components
export function InventoryPage() {
  return (
    <>
      <InventoryFilters />
      <InventoryList />
      <InventoryStats />
    </>
  );
}

// 🚩 RED FLAG - Prop drilling 3+ levels
<Parent>
  <Child onUpdate={handleUpdate}>
    <GrandChild onUpdate={handleUpdate}>
      <GreatGrandChild onUpdate={handleUpdate} />

// ✅ BETTER - Use context or Redux
const InventoryContext = createContext();

```

----------

## 13. Testing Standards

### 13.1 Test File Naming

```
features/inventory/
├── components/
│   ├── InventoryList.tsx
│   └── InventoryList.test.tsx        # Co-located with component
├── hooks/
│   ├── useInventoryQuery.ts
│   └── useInventoryQuery.test.ts
└── utils/
    ├── calculations.ts
    └── calculations.test.ts

```

### 13.2 Test Structure

```typescript
// features/inventory/components/InventoryList.test.tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InventoryList } from './InventoryList';

describe('InventoryList', () => {
  const queryClient = new QueryClient();
  
  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <InventoryList />
      </QueryClientProvider>
    );
  };

  it('displays loading state', () => {
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders inventory items', async () => {
    renderComponent();
    expect(await screen.findByText('Product 1')).toBeInTheDocument();
  });
});

```

----------

## 14. Path Aliases Configuration

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/features/*": ["src/features/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/services/*": ["src/services/*"],
      "@/store/*": ["src/store/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

```

**Usage:**

```typescript
//👍 PREFERRED - Use alias for cross-boundary imports import { Button } from '@/components/Button'; import { useAppDispatch } from '@/store/hooks';

// 👍 ACCEPTABLE - Use relative for same-feature imports import { inventoryApi } from '../services/inventoryApi'; import type { InventoryItem } from '../types/inventory.types';

```

---

## 15. Quick Reference Checklist

### Before Committing Code

- [ ] All files follow naming conventions
- [ ] No cross-feature imports
- [ ] Types defined for all public APIs
- [ ] Shared components have no business logic
- [ ] API calls only in `services/`
- [ ] React Query for server state
- [ ] Redux only for persistent client state
- [ ] Feature exports through `index.ts`
- [ ] JSDoc on public functions
- [ ] No `any` types
- [ ] Import order correct
- [ ] Tests co-located with code

### Before Creating Shared Code

- [ ] Used by 3+ features (or will be)
- [ ] Zero business logic
- [ ] Truly generic
- [ ] Documented with examples
- [ ] Clear API boundary

### Before Starting a Feature

- [ ] Feature folder structure created
- [ ] Types defined first
- [ ] API service stubbed
- [ ] Redux slice planned (if needed)
- [ ] Page component identified

---

## 16. AI Prompt Template

When working with AI tools, use this template:


```

I'm working in a production React ERP system following strict architectural standards.

CONTEXT:

-   Feature: [feature name]
-   Task: [what you're building]
-   Location: features/[feature-name]/[layer]/

STANDARDS:

-   React Query for ALL server state
-   Redux Toolkit ONLY for persistent client state
-   NO cross-feature imports
-   ALL API calls in services/
-   Types MUST be defined
-   Shared components = zero business logic

REQUIREMENT: [Your specific request]

Follow the project structure exactly. Generate complete, production-ready code.

```

**Example:**

```

CONTEXT:

-   Feature: inventory
-   Task: Add bulk update functionality
-   Location: features/inventory/

STANDARDS: [as above]

REQUIREMENT: Create a bulk update component that allows selecting multiple inventory items and updating their status. Include:

1.  Service function in inventoryApi.ts
2.  React Query mutation hook
3.  Component with selection logic
4.  Proper TypeScript types

```

---

## 17. Summary

This standard prioritizes:

1. **Predictability** - Same patterns everywhere
2. **Isolation** - Features don't know about each other
3. **Clarity** - Code location is obvious
4. **Scalability** - Patterns work at any scale
5. **Determinism** - AI produces consistent results

**Golden Rules:**
- Features are **isolated** (no imports between them)
- Shared code is **truly generic** (no business logic)
- Server state uses **React Query** (always)
- Client state uses **Redux** (only when needed)
- Components are **dumb** (data via props/hooks)
- Services are **pure** (just API calls)


