
# Zod Integration Standard for Enterprise Applications

## Table of Contents

- [Overview](#overview)
- [Integration Strategy](#integration-strategy)
- [Schema Organization](#schema-organization)
- [Validation Patterns](#validation-patterns)
- [Form Integration](#form-integration)
- [API Integration](#api-integration)
- [Type Generation](#type-generation)
- [Error Handling](#error-handling)
- [Testing Schemas](#testing-schemas)
- [Migration Guide](#migration-guide)

----------

## Overview

### Purpose

This document extends the core frontend architecture standard with Zod-specific patterns for:

-   Runtime type validation
-   Form validation
-   API request/response validation
-   Type-safe data transformations

### When to Use Zod

```typescript
✅ USE ZOD FOR:
- Form input validation
- API request validation (before sending)
- API response validation (after receiving)
- User input sanitization
- Data transformations with validation
- Runtime type checking at boundaries

❌ DON'T USE ZOD FOR:
- Pure TypeScript types (use interfaces)
- Component prop validation (use TypeScript)
- Internal function parameters (use TypeScript)
- Already validated data (avoid double validation)

```

----------

## Integration Strategy

### Installation

```bash
npm install zod
npm install @hookform/resolvers  # For React Hook Form integration

```

### Project Structure with Zod

```
src/
├── features/
│   └── inventory/
│       ├── components/
│       ├── hooks/
│       ├── schemas/              # ← Zod schemas
│       │   ├── inventory.schema.ts
│       │   ├── inventoryForm.schema.ts
│       │   └── index.ts
│       ├── services/
│       ├── types/                # ← TypeScript types (derived from schemas)
│       │   └── inventory.types.ts
│       └── utils/
└── schemas/                      # ← Shared schemas only
    ├── common.schema.ts
    └── validation.schema.ts

```

**Rules:**

-   **ALWAYS** co-locate schemas with features
-   **ALWAYS** derive TypeScript types from schemas (single source of truth)
-   **NEVER** duplicate validation logic across schemas
-   **ALWAYS** export schemas through feature `index.ts`

----------

## Schema Organization

### 2.1 Naming Conventions

```typescript
// File naming: {domain}.schema.ts
inventory.schema.ts           // Domain entities
inventoryForm.schema.ts       // Form-specific schemas
inventoryApi.schema.ts        // API request/response schemas

// Schema naming: {Purpose}Schema
export const InventoryItemSchema = z.object({...});      // Entity
export const CreateInventorySchema = z.object({...});    // DTO
export const InventoryFormSchema = z.object({...});      // Form
export const InventoryFilterSchema = z.object({...});    // Filters

```

### 2.2 Feature Schema Template

```typescript
// features/inventory/schemas/inventory.schema.ts
import { z } from 'zod';

/**
 * Inventory item status enum
 */
export const InventoryStatusSchema = z.enum([
  'active',
  'discontinued',
  'out-of-stock',
]);

/**
 * Core inventory item schema
 * Used for API responses and data validation
 */
export const InventoryItemSchema = z.object({
  id: z.string().uuid(),
  sku: z.string()
    .min(3, 'SKU must be at least 3 characters')
    .max(20, 'SKU must not exceed 20 characters')
    .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens'),
  name: z.string()
    .min(1, 'Name is required')
    .max(200, 'Name must not exceed 200 characters')
    .trim(),
  description: z.string()
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional(),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
  unitPrice: z.number()
    .positive('Unit price must be positive')
    .multipleOf(0.01, 'Unit price must have at most 2 decimal places'),
  reorderPoint: z.number()
    .int('Reorder point must be a whole number')
    .min(0, 'Reorder point cannot be negative'),
  category: z.string()
    .min(1, 'Category is required'),
  status: InventoryStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * Schema for creating new inventory items
 * Omits auto-generated fields
 */
export const CreateInventorySchema = InventoryItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

/**
 * Schema for updating inventory items
 * All fields optional except those that shouldn't change
 */
export const UpdateInventorySchema = InventoryItemSchema.partial().required({
  id: true,
});

/**
 * Schema for inventory filters
 */
export const InventoryFilterSchema = z.object({
  status: InventoryStatusSchema.or(z.literal('all')),
  category: z.string().nullable(),
  searchTerm: z.string(),
  minQuantity: z.number().int().min(0).optional(),
  maxQuantity: z.number().int().min(0).optional(),
}).refine(
  (data) => {
    if (data.minQuantity !== undefined && data.maxQuantity !== undefined) {
      return data.minQuantity <= data.maxQuantity;
    }
    return true;
  },
  {
    message: 'Minimum quantity must be less than or equal to maximum quantity',
    path: ['minQuantity'],
  }
);

/**
 * Schema for bulk operations
 */
export const BulkUpdateInventorySchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'At least one item must be selected'),
  updates: UpdateInventorySchema.omit({ id: true }),
});

// Export inferred types
export type InventoryStatus = z.infer<typeof InventoryStatusSchema>;
export type InventoryItem = z.infer<typeof InventoryItemSchema>;
export type CreateInventory = z.infer<typeof CreateInventorySchema>;
export type UpdateInventory = z.infer<typeof UpdateInventorySchema>;
export type InventoryFilter = z.infer<typeof InventoryFilterSchema>;
export type BulkUpdateInventory = z.infer<typeof BulkUpdateInventorySchema>;

```

### 2.3 Form Schema Pattern

```typescript
// features/inventory/schemas/inventoryForm.schema.ts
import { z } from 'zod';
import { CreateInventorySchema } from './inventory.schema';

/**
 * Form-specific schema with client-side only validations
 * Extends API schema with UI requirements
 */
export const InventoryFormSchema = CreateInventorySchema.extend({
  // Add form-specific fields that don't go to API
  confirmDeletion: z.boolean().optional(),
  
  // Override with stricter client-side validation
  sku: z.string()
    .min(3, 'SKU must be at least 3 characters')
    .max(20, 'SKU must not exceed 20 characters')
    .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens')
    .refine(
      async (sku) => {
        // Example: async validation (debounced in practice)
        // return await checkSkuAvailability(sku);
        return true;
      },
      { message: 'SKU already exists' }
    ),
}).refine(
  (data) => {
    // Cross-field validation
    if (data.quantity < data.reorderPoint) {
      return false;
    }
    return true;
  },
  {
    message: 'Initial quantity should be at least equal to reorder point',
    path: ['quantity'],
  }
);

export type InventoryFormData = z.infer<typeof InventoryFormSchema>;

/**
 * Transform form data to API payload
 */
export function transformFormToApi(formData: InventoryFormData): CreateInventory {
  const { confirmDeletion, ...apiData } = formData;
  return CreateInventorySchema.parse(apiData);
}

```

### 2.4 API Schema Pattern

```typescript
// features/inventory/schemas/inventoryApi.schema.ts
import { z } from 'zod';
import { InventoryItemSchema } from './inventory.schema';

/**
 * API response schemas for validation
 */

// Single item response
export const InventoryItemResponseSchema = z.object({
  success: z.boolean(),
  data: InventoryItemSchema,
  message: z.string().optional(),
});

// List response
export const InventoryListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(InventoryItemSchema),
  message: z.string().optional(),
});

// Paginated response
export const InventoryPaginatedResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(InventoryItemSchema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    totalPages: z.number().int().min(0),
  }),
  message: z.string().optional(),
});

// Error response
export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }),
});

export type InventoryItemResponse = z.infer<typeof InventoryItemResponseSchema>;
export type InventoryListResponse = z.infer<typeof InventoryListResponseSchema>;
export type InventoryPaginatedResponse = z.infer<typeof InventoryPaginatedResponseSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;

```

----------

## Validation Patterns

### 3.1 Common Reusable Schemas

```typescript
// schemas/common.schema.ts
import { z } from 'zod';

/**
 * Reusable field validators
 */

// Email
export const EmailSchema = z.string()
  .email('Invalid email address')
  .toLowerCase()
  .trim();

// Phone (US format)
export const PhoneSchema = z.string()
  .regex(/^\+?1?\s*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/, 'Invalid phone number');

// URL
export const UrlSchema = z.string()
  .url('Invalid URL')
  .refine(
    (url) => url.startsWith('https://'),
    { message: 'URL must use HTTPS' }
  );

// Currency (stored as cents)
export const CurrencySchema = z.number()
  .int('Currency must be in cents')
  .min(0, 'Amount cannot be negative');

// Date string (ISO 8601)
export const DateStringSchema = z.string()
  .datetime({ message: 'Invalid date format' });

// Percentage (0-100)
export const PercentageSchema = z.number()
  .min(0, 'Percentage cannot be negative')
  .max(100, 'Percentage cannot exceed 100');

// Positive integer
export const PositiveIntSchema = z.number()
  .int('Must be a whole number')
  .positive('Must be positive');

// Non-negative integer
export const NonNegativeIntSchema = z.number()
  .int('Must be a whole number')
  .min(0, 'Cannot be negative');

// Trimmed non-empty string
export const NonEmptyStringSchema = z.string()
  .trim()
  .min(1, 'This field is required');

// UUID
export const UuidSchema = z.string()
  .uuid('Invalid ID format');

// Enum with custom error
export function createEnumSchema<T extends string>(
  values: readonly T[],
  errorMessage?: string
) {
  return z.enum(values as [T, ...T[]], {
    errorMap: () => ({ 
      message: errorMessage || `Must be one of: ${values.join(', ')}` 
    }),
  });
}

```

### 3.2 Schema Composition

```typescript
// features/inventory/schemas/inventory.schema.ts
import { z } from 'zod';
import { 
  UuidSchema, 
  NonEmptyStringSchema, 
  NonNegativeIntSchema,
  CurrencySchema,
  DateStringSchema,
} from '@/schemas/common.schema';

// ✅ CORRECT - Compose from reusable schemas
export const InventoryItemSchema = z.object({
  id: UuidSchema,
  sku: NonEmptyStringSchema
    .max(20, 'SKU must not exceed 20 characters')
    .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens'),
  name: NonEmptyStringSchema
    .max(200, 'Name must not exceed 200 characters'),
  quantity: NonNegativeIntSchema,
  unitPrice: CurrencySchema,
  reorderPoint: NonNegativeIntSchema,
  createdAt: DateStringSchema,
  updatedAt: DateStringSchema,
});

// ❌ WRONG - Repeating validation logic
export const InventoryItemSchema = z.object({
  id: z.string().uuid(),  // Duplicated
  sku: z.string().trim().min(1, 'Required'),  // Duplicated
  // ...
});

```

### 3.3 Conditional Validation

```typescript
// features/inventory/schemas/inventoryForm.schema.ts
import { z } from 'zod';

export const InventoryFormSchema = z.object({
  type: z.enum(['simple', 'composite']),
  sku: z.string().min(3),
  components: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  // Conditional requirement: composite items must have components
  if (data.type === 'composite' && (!data.components || data.components.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Composite items must have at least one component',
      path: ['components'],
    });
  }
});

// Alternative using discriminated unions (preferred when structure differs)
export const InventoryFormSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('simple'),
    sku: z.string().min(3),
  }),
  z.object({
    type: z.literal('composite'),
    sku: z.string().min(3),
    components: z.array(z.string()).min(1, 'At least one component required'),
  }),
]);

```

### 3.4 Async Validation (Use Sparingly)

```typescript
// features/inventory/schemas/inventoryForm.schema.ts
import { z } from 'zod';
import { checkSkuAvailability } from '../services/inventoryApi';

/**
 * Async validation for SKU uniqueness
 * WARNING: Use only with debouncing in forms
 */
export const InventoryFormSchema = z.object({
  sku: z.string()
    .min(3)
    .refine(
      async (sku) => {
        // This will be called on every validation
        // Must be debounced in the form component
        const isAvailable = await checkSkuAvailability(sku);
        return isAvailable;
      },
      { message: 'SKU already exists' }
    ),
});

// ✅ BETTER - Handle async validation separately in form
export const InventoryFormSchema = z.object({
  sku: z.string().min(3),
  // Sync validation only
});

// Then in component:
const checkSkuDebounced = useDebouncedCallback(
  async (sku: string) => {
    const isAvailable = await checkSkuAvailability(sku);
    if (!isAvailable) {
      form.setError('sku', { message: 'SKU already exists' });
    }
  },
  500
);

```

----------

## Form Integration

### 4.1 React Hook Form Integration

```typescript
// features/inventory/components/InventoryForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InventoryFormSchema, type InventoryFormData } from '../schemas/inventoryForm.schema';
import { transformFormToApi } from '../schemas/inventoryForm.schema';
import { useCreateInventoryMutation } from '../hooks/useInventoryMutations';

export function InventoryForm() {
  const createMutation = useCreateInventoryMutation();

  const form = useForm<InventoryFormData>({
    resolver: zodResolver(InventoryFormSchema),
    defaultValues: {
      sku: '',
      name: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      reorderPoint: 0,
      category: '',
    },
  });

  const onSubmit = async (data: InventoryFormData) => {
    try {
      // Transform and validate before sending
      const apiPayload = transformFormToApi(data);
      await createMutation.mutateAsync(apiPayload);
      form.reset();
    } catch (error) {
      // Error handling
      console.error('Submission failed:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="sku">SKU</label>
        <input
          id="sku"
          {...form.register('sku')}
          aria-invalid={!!form.formState.errors.sku}
        />
        {form.formState.errors.sku && (
          <span role="alert">{form.formState.errors.sku.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          {...form.register('quantity', { valueAsNumber: true })}
          aria-invalid={!!form.formState.errors.quantity}
        />
        {form.formState.errors.quantity && (
          <span role="alert">{form.formState.errors.quantity.message}</span>
        )}
      </div>

      {/* More fields... */}

      <button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Creating...' : 'Create Item'}
      </button>
    </form>
  );
}

```

### 4.2 Reusable Form Field Component

```typescript
// components/FormField.tsx
import { useFormContext } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export function FormField({ 
  name, 
  label, 
  type = 'text',
  placeholder,
  required = false,
}: FormFieldProps) {
  const { 
    register, 
    formState: { errors } 
  } = useFormContext();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span aria-label="required"> *</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...register(name, { 
          valueAsNumber: type === 'number',
          valueAsDate: type === 'date',
        })}
      />
      {errorMessage && (
        <span 
          id={`${name}-error`}
          role="alert" 
          className="error-message"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}

// Usage:
<FormProvider {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField name="sku" label="SKU" required />
    <FormField name="quantity" label="Quantity" type="number" required />
  </form>
</FormProvider>

```

----------

## API Integration

### 5.1 Service Layer with Validation

```typescript
// features/inventory/services/inventoryApi.ts
import { apiClient } from '@/services/apiClient';
import { 
  InventoryItemSchema,
  CreateInventorySchema,
  UpdateInventorySchema,
  type InventoryItem,
  type CreateInventory,
  type UpdateInventory,
} from '../schemas/inventory.schema';
import {
  InventoryItemResponseSchema,
  InventoryListResponseSchema,
} from '../schemas/inventoryApi.schema';

export const inventoryApi = {
  /**
   * Fetch all inventory items with response validation
   */
  getAll: async (): Promise<InventoryItem[]> => {
    const response = await apiClient.get('/inventory');
    
    // Validate response shape
    const validated = InventoryListResponseSchema.parse(response.data);
    
    return validated.data;
  },

  /**
   * Fetch single inventory item with validation
   */
  getById: async (id: string): Promise<InventoryItem> => {
    const response = await apiClient.get(`/inventory/${id}`);
    
    const validated = InventoryItemResponseSchema.parse(response.data);
    
    return validated.data;
  },

  /**
   * Create inventory item with request validation
   */
  create: async (data: CreateInventory): Promise<InventoryItem> => {
    // Validate request payload before sending
    const validatedPayload = CreateInventorySchema.parse(data);
    
    const response = await apiClient.post('/inventory', validatedPayload);
    
    // Validate response
    const validated = InventoryItemResponseSchema.parse(response.data);
    
    return validated.data;
  },

  /**
   * Update inventory item with validation
   */
  update: async (id: string, data: UpdateInventory): Promise<InventoryItem> => {
    const validatedPayload = UpdateInventorySchema.parse(data);
    
    const response = await apiClient.put(`/inventory/${id}`, validatedPayload);
    
    const validated = InventoryItemResponseSchema.parse(response.data);
    
    return validated.data;
  },
};

```

### 5.2 Safe Parsing with Error Handling

```typescript
// features/inventory/services/inventoryApi.ts
import { ZodError } from 'zod';

export const inventoryApi = {
  getAll: async (): Promise<InventoryItem[]> => {
    try {
      const response = await apiClient.get('/inventory');
      
      // Use safeParse for better error handling
      const result = InventoryListResponseSchema.safeParse(response.data);
      
      if (!result.success) {
        // Log validation errors for debugging
        console.error('API response validation failed:', result.error.format());
        
        // Throw with context
        throw new Error(
          `Invalid API response: ${result.error.errors.map(e => e.message).join(', ')}`
        );
      }
      
      return result.data.data;
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle Zod validation errors
        throw new Error('Data validation failed');
      }
      throw error;
    }
  },
};

```

### 5.3 Partial Validation for Filtering

```typescript
// features/inventory/hooks/useInventoryQuery.ts
import { useQuery } from '@tanstack/react-query';
import { InventoryFilterSchema, type InventoryFilter } from '../schemas/inventory.schema';

export function useInventoryQuery(filters?: Partial<InventoryFilter>) {
  // Validate filters before using
  const validatedFilters = filters 
    ? InventoryFilterSchema.partial().parse(filters)
    : undefined;

  return useQuery({
    queryKey: ['inventory', validatedFilters],
    queryFn: () => inventoryApi.getAll(validatedFilters),
  });
}

```

----------

## Type Generation

### 6.1 Single Source of Truth Pattern

```typescript
// features/inventory/schemas/inventory.schema.ts
import { z } from 'zod';

// ✅ CORRECT - Schema is the source of truth
export const InventoryItemSchema = z.object({
  id: z.string().uuid(),
  sku: z.string().min(3).max(20),
  name: z.string().min(1).max(200),
  quantity: z.number().int().min(0),
});

// Derive TypeScript type from schema
export type InventoryItem = z.infer<typeof InventoryItemSchema>;

// ❌ WRONG - Duplicating types
export interface InventoryItem {  // Don't do this
  id: string;
  sku: string;
  name: string;
  quantity: number;
}

export const InventoryItemSchema = z.object({...});  // Duplicate definition

```

### 6.2 Type Exports

```typescript
// features/inventory/types/inventory.types.ts

// Re-export types derived from schemas
export type {
  InventoryItem,
  CreateInventory,
  UpdateInventory,
  InventoryFilter,
  InventoryStatus,
} from '../schemas/inventory.schema';

// Add non-validated types here (UI-only, computed, etc.)
export interface InventoryStats {
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface InventoryTableRow extends InventoryItem {
  // Computed display fields
  displayStatus: string;
  totalValue: number;
}

```

### 6.3 Schema Transformations

```typescript
// features/inventory/schemas/inventory.schema.ts
import { z } from 'zod';

// Input schema (from API)
export const InventoryApiSchema = z.object({
  id: z.string(),
  sku: z.string(),
  unit_price: z.number(),  // snake_case from API
  created_at: z.string(),
});

// Transformed schema (for app use)
export const InventoryItemSchema = InventoryApiSchema.transform((data) => ({
  id: data.id,
  sku: data.sku,
  unitPrice: data.unit_price,  // Transform to camelCase
  createdAt: new Date(data.created_at),  // Parse date
}));

export type InventoryItem = z.infer<typeof InventoryItemSchema>;
// Type will be: { id: string; sku: string; unitPrice: number; createdAt: Date }

```

----------

## Error Handling

### 7.1 Formatted Error Messages

```typescript
// utils/zodErrorFormatter.ts
import { ZodError } from 'zod';

/**
 * Format Zod errors for display
 */
export function formatZodError(error: ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    formatted[path] = err.message;
  });
  
  return formatted;
}

/**
 * Get first error message for a field
 */
export function getFieldError(error: ZodError, fieldName: string): string | undefined {
  const fieldError = error.errors.find((err) => 
    err.path.join('.') === fieldName
  );
  
  return fieldError?.message;
}

/**
 * Convert Zod error to user-friendly format
 */
export function formatZodErrorForUser(error: ZodError): string {
  if (error.errors.length === 1) {
    return error.errors[0].message;
  }
  
  return `Validation failed: ${error.errors.length} errors found`;
}

```

### 7.2 Error Boundary for Validation

```typescript
// features/inventory/components/InventoryForm.tsx
import { ZodError } from 'zod';
import { formatZodError } from '@/utils/zodErrorFormatter';

export function InventoryForm() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (data: unknown) => {
    try {
      // Clear previous errors
      setValidationErrors({});
      
      // Validate
      const validated = InventoryFormSchema.parse(data);
      
      // Submit
      await createInventory(validated);
    } catch (error) {
      if (error instanceof ZodError) {
        // Display validation errors
        setValidationErrors(formatZodError(error));
      } else {
        // Handle other errors
        console.error('Submission failed:', error);
      }
    }
  };

  return (
    <form>
      {/* Render fields with errors */}
      <input name="sku" />
      {validationErrors.sku && (
        <span className="error">{validationErrors.sku}</span>
      )}
    </form>
  );
}

```

### 7.3 Custom Error Messages

```typescript
// features/inventory/schemas/inventory.schema.ts
import { z } from 'zod';

// ✅ CORRECT - Specific, actionable error messages
export const InventoryItemSchema = z.object({
  sku: z.string()
    .min(3, 'SKU must be at least 3 characters long')
    .max(20, 'SKU cannot exceed 20 characters')
    .regex(
      /^[A-Z0-9-]+$/, 
      'SKU can only contain uppercase letters, numbers, and hyphens'
    ),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
});

// ❌ WRONG - Generic, unhelpful errors
export const InventoryItemSchema = z.object({
  sku: z.string().min(3).max(20).regex(/^[A-Z0-9-]+$/),  // Uses default errors
  quantity: z.number().int().min(0),  // Uses default errors
});

// ✅ CORRECT - Custom error map for complex validation
export const InventoryItemSchema = z.object({
  quantity: z.number(),
  reorderPoint: z.number(),
}).refine(
  (data) => data.quantity >= data.reorderPoint,
  {
    message: 'Current quantity must be at least equal to the reorder point to prevent immediate restocking alerts',
    path: ['quantity'],
  }
);

```

----------

## Testing Schemas

### 8.1 Schema Unit Tests

```typescript
// features/inventory/schemas/inventory.schema.test.ts
import { describe, it, expect } from 'vitest';
import { 
  InventoryItemSchema,
  CreateInventorySchema,
  InventoryFilterSchema,
} from './inventory.schema';

describe('InventoryItemSchema', () => {
  it('validates a valid inventory item', () => {
    const validItem = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      sku: 'ITEM-001',
      name: 'Test Item',
      description: 'A test item',
      quantity: 10,
      unitPrice: 1999,
      reorderPoint:
5, category: 'Electronics', status: 'active', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', };


const result = InventoryItemSchema.safeParse(validItem);

expect(result.success).toBe(true);
if (result.success) {
  expect(result.data).toEqual(validItem);
}



});

it('rejects invalid SKU format', () => { const invalidItem = { id: '123e4567-e89b-12d3-a456-426614174000', sku: 'invalid sku', // Contains space and lowercase name: 'Test Item', quantity: 10, unitPrice: 1999, reorderPoint: 5, category: 'Electronics', status: 'active', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', };

const result = InventoryItemSchema.safeParse(invalidItem);

expect(result.success).toBe(false);
if (!result.success) {
  expect(result.error.errors[0].path).toEqual(['sku']);
  expect(result.error.errors[0].message).toContain('uppercase');
}


});

it('rejects negative quantity', () => { const invalidItem = { // ... other valid fields quantity: -5, };

const result = InventoryItemSchema.safeParse(invalidItem);

expect(result.success).toBe(false);
if (!result.success) {
  expect(result.error.errors[0].path).toEqual(['quantity']);
  expect(result.error.errors[0].message).toContain('negative');
}



});

it('handles optional description', () => { const itemWithoutDescription = { // ... required fields description: undefined, };


const result = InventoryItemSchema.safeParse(itemWithoutDescription);
expect(result.success).toBe(true);



}); });

describe('CreateInventorySchema', () => { it('omits auto-generated fields', () => { const createData = { sku: 'ITEM-001', name: 'Test Item', quantity: 10, unitPrice: 1999, reorderPoint: 5, category: 'Electronics', // id, status, createdAt, updatedAt should not be required };

const result = CreateInventorySchema.safeParse(createData);
expect(result.success).toBe(true);



});

it('rejects extra fields', () => { const dataWithExtra = { sku: 'ITEM-001', name: 'Test Item', quantity: 10, unitPrice: 1999, reorderPoint: 5, category: 'Electronics', id: '123', // Should not be allowed in create };


const result = CreateInventorySchema.strict().safeParse(dataWithExtra);
expect(result.success).toBe(false);



}); });

describe('InventoryFilterSchema', () => { it('validates cross-field constraints', () => { const invalidFilter = { status: 'active', category: null, searchTerm: '', minQuantity: 100, maxQuantity: 50, // Less than minQuantity };


const result = InventoryFilterSchema.safeParse(invalidFilter);

expect(result.success).toBe(false);
if (!result.success) {
  expect(result.error.errors[0].message).toContain('Minimum quantity');
}



}); });

```

### 8.2 Integration Tests with API

```typescript
// features/inventory/services/inventoryApi.test.ts
import { describe, it, expect, vi } from 'vitest';
import { inventoryApi } from './inventoryApi';
import { apiClient } from '@/services/apiClient';

vi.mock('@/services/apiClient');

describe('inventoryApi', () => {
  it('validates API response and returns data', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            sku: 'ITEM-001',
            name: 'Test Item',
            quantity: 10,
            unitPrice: 1999,
            reorderPoint: 5,
            category: 'Electronics',
            status: 'active',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      },
    };

    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const result = await inventoryApi.getAll();
    
    expect(result).toEqual(mockResponse.data.data);
  });

  it('throws error on invalid API response', async () => {
    const invalidResponse = {
      data: {
        success: true,
        data: [
          {
            id: 'invalid-uuid',  // Invalid UUID
            sku: 'ITEM-001',
            // Missing required fields
          },
        ],
      },
    };

    vi.mocked(apiClient.get).mockResolvedValue(invalidResponse);

    await expect(inventoryApi.getAll()).rejects.toThrow();
  });
});

```

----------

## Migration Guide

### 9.1 Adding Zod to Existing Feature

**Step 1: Create schemas folder**

```bash
mkdir -p features/inventory/schemas
touch features/inventory/schemas/inventory.schema.ts

```

**Step 2: Define schemas from existing types**

```typescript
// Before (types only)
// features/inventory/types/inventory.types.ts
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
}

// After (schema-first)
// features/inventory/schemas/inventory.schema.ts
import { z } from 'zod';

export const InventoryItemSchema = z.object({
  id: z.string().uuid(),
  sku: z.string().min(3).max(20),
  name: z.string().min(1).max(200),
  quantity: z.number().int().min(0),
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;

// features/inventory/types/inventory.types.ts
// Re-export from schema
export type { InventoryItem } from '../schemas/inventory.schema';

```

**Step 3: Add validation to API service**

```typescript
// features/inventory/services/inventoryApi.ts

// Before
export const inventoryApi = {
  getAll: async (): Promise<InventoryItem[]> => {
    const { data } = await apiClient.get('/inventory');
    return data;  // No validation
  },
};

// After
import { InventoryListResponseSchema } from '../schemas/inventoryApi.schema';

export const inventoryApi = {
  getAll: async (): Promise<InventoryItem[]> => {
    const { data } = await apiClient.get('/inventory');
    const validated = InventoryListResponseSchema.parse(data);
    return validated.data;  // Validated
  },
};

```

**Step 4: Add to forms**

```typescript
// Before
const form = useForm<InventoryFormData>({
  // No validation
});

// After
import { zodResolver } from '@hookform/resolvers/zod';
import { InventoryFormSchema } from '../schemas/inventoryForm.schema';

const form = useForm<InventoryFormData>({
  resolver: zodResolver(InventoryFormSchema),
});

```

### 9.2 Incremental Adoption Strategy

```
Phase 1: New Features Only
├── Create schemas for all new features
└── Leave existing features as-is

Phase 2: High-Risk Endpoints
├── Add validation to critical API endpoints
│   ├── Payment processing
│   ├── User authentication
│   └── Financial transactions
└── Validate responses, not requests initially

Phase 3: Forms
├── Add Zod to forms as they're updated
└── Focus on user-input forms first

Phase 4: Complete Migration
├── Migrate remaining features
└── Remove duplicate type definitions

```

### 9.3 Coexistence Pattern

```typescript
// Allow TypeScript types and Zod schemas to coexist during migration

// Legacy type (keep for now)
// types/inventory.types.ts
export interface InventoryItem {
  id: string;
  sku: string;
}

// New schema (add alongside)
// schemas/inventory.schema.ts
export const InventoryItemSchema = z.object({
  id: z.string().uuid(),
  sku: z.string().min(3),
});

export type InventoryItemValidated = z.infer<typeof InventoryItemSchema>;

// Usage - gradually migrate from InventoryItem to InventoryItemValidated

```

----------

## Quick Reference

### Schema Checklist

-   [ ] Schema file named `{domain}.schema.ts`
-   [ ] Schema constant named `{Purpose}Schema`
-   [ ] Types inferred with `z.infer<typeof Schema>`
-   [ ] Custom error messages for all validations
-   [ ] JSDoc comments on exported schemas
-   [ ] Reuse common validators from `schemas/common.schema.ts`
-   [ ] Cross-field validation using `.refine()` or `.superRefine()`
-   [ ] Export through feature `index.ts`

### Form Integration Checklist

-   [ ] Use `zodResolver` with React Hook Form
-   [ ] Separate form schema from API schema if needed
-   [ ] Transform function to convert form data to API payload
-   [ ] Proper error display for each field
-   [ ] Async validation debounced (if used)

### API Integration Checklist

-   [ ] Request payload validated before sending
-   [ ] Response validated after receiving
-   [ ] Use `.safeParse()` with error handling
-   [ ] Log validation errors in development
-   [ ] Proper TypeScript types from schemas

### Testing Checklist

-   [ ] Test valid data passes
-   [ ] Test each validation rule rejects invalid data
-   [ ] Test edge cases (empty strings, null, undefined)
-   [ ] Test cross-field validations
-   [ ] Test error messages are correct

----------

## Common Patterns

### Pattern: Required vs Optional

```typescript
// All fields required
const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

// Some fields optional
const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),  // Optional
});

// Make all fields optional
const PartialUserSchema = UserSchema.partial();

// Make specific fields required from partial
const UserUpdateSchema = UserSchema.partial().required({
  id: true,  // ID always required for updates
});

```

### Pattern: Nullable vs Optional

```typescript
// Optional: field can be missing
z.string().optional()  // string | undefined

// Nullable: field must be present but can be null
z.string().nullable()  // string | null

// Both
z.string().nullable().optional()  // string | null | undefined

// Neither (use for required fields)
z.string()  // string

```

### Pattern: Default Values

```typescript
const ConfigSchema = z.object({
  pageSize: z.number().int().positive().default(20),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  enableNotifications: z.boolean().default(true),
});

// Usage
const config = ConfigSchema.parse({});
// Result: { pageSize: 20, sortOrder: 'asc', enableNotifications: true }

```

### Pattern: Array Validation

```typescript
// Array of strings
z.array(z.string())

// Non-empty array
z.array(z.string()).min(1, 'At least one item required')

// Array with max length
z.array(z.string()).max(10, 'Cannot exceed 10 items')

// Array with both constraints
z.array(z.string())
  .min(1, 'At least one item required')
  .max(10, 'Cannot exceed 10 items')

// Array of objects
z.array(InventoryItemSchema)

```

----------

This Zod integration standard ensures:

-   **Type safety** at runtime and compile time
-   **Validation** at API boundaries (requests/responses)
-   **Consistent** error messages across the application
-   **Single source of truth** for types and validation
-   **Testable** validation logic

Use Zod strategically at **boundaries** (forms, APIs) while keeping **internal** logic in pure TypeScript.
```