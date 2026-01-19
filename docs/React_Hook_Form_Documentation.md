# React Hook Form Integration Guide

**Prerequisite:** This document extends the [Frontend Architecture Standard](core-architecture.md). All rules from that document apply.

---

## Table of Contents
1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [Integration with Architecture](#integration-with-architecture)
4. [Basic Form Pattern](#basic-form-pattern)
5. [Form Component Structure](#form-component-structure)
6. [Validation with Zod](#validation-with-zod)
7. [Reusable Form Components](#reusable-form-components)
8. [Form State Management](#form-state-management)
9. [Common Patterns](#common-patterns)
10. [Error Handling](#error-handling)
11. [Testing Forms](#testing-forms)
12. [Quick Reference](#quick-reference)

---

## Overview

### Purpose
React Hook Form handles all form state and validation in feature components. This guide shows how to integrate it following the architecture standard.

### Key Principles
- Forms live in `features/{name}/components/`
- Validation schemas live in `features/{name}/schemas/`
- Form logic stays in feature components (never in shared components)
- Use Zod for validation (runtime + compile-time safety)

---

## Installation & Setup

```bash
npm install react-hook-form
npm install zod @hookform/resolvers
```

**That's it.** No global configuration needed.

---

## Integration with Architecture

### Where Forms Fit

```
features/
└── inventory/
    ├── components/
    │   ├── InventoryForm.tsx          # ← Form component here
    │   ├── InventoryCreateForm.tsx
    │   └── InventoryEditForm.tsx
    ├── schemas/
    │   ├── inventory.schema.ts         # ← Zod schemas here
    │   └── inventoryForm.schema.ts
    ├── hooks/
    │   └── useInventoryMutations.ts    # ← Form submission logic
    ├── services/
    │   └── inventoryApi.ts             # ← API calls
    └── types/
        └── inventory.types.ts          # ← Types (derived from schemas)
```

**Rules:**
- **NEVER** put forms in `src/components/` (not shared)
- **ALWAYS** put forms in feature folders
- **ALWAYS** use Zod schemas for validation
- **ALWAYS** submit through React Query mutations

---

## Basic Form Pattern

### Step 1: Define Schema

```typescript
// features/inventory/schemas/inventoryForm.schema.ts
import { z } from 'zod';

export const CreateInventoryFormSchema = z.object({
  sku: z.string()
    .min(3, 'SKU must be at least 3 characters')
    .max(20, 'SKU cannot exceed 20 characters')
    .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens'),
  
  name: z.string()
    .min(1, 'Name is required')
    .max(200, 'Name cannot exceed 200 characters')
    .trim(),
  
  description: z.string()
    .max(1000, 'Description cannot exceed 1000 characters')
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
});

export type CreateInventoryFormData = z.infer<typeof CreateInventoryFormSchema>;
```

### Step 2: Create Form Component

```typescript
// features/inventory/components/InventoryCreateForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateInventoryFormSchema, type CreateInventoryFormData } from '../schemas/inventoryForm.schema';
import { useCreateInventoryMutation } from '../hooks/useInventoryMutations';

export function InventoryCreateForm() {
  const createMutation = useCreateInventoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateInventoryFormData>({
    resolver: zodResolver(CreateInventoryFormSchema),
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

  const onSubmit = async (data: CreateInventoryFormData) => {
    try {
      await createMutation.mutateAsync(data);
      reset(); // Clear form on success
    } catch (error) {
      // Error handling (mutation handles error state)
      console.error('Failed to create inventory:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="sku">SKU *</label>
        <input
          id="sku"
          type="text"
          {...register('sku')}
          aria-invalid={!!errors.sku}
        />
        {errors.sku && (
          <span role="alert" className="error">
            {errors.sku.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="name">Product Name *</label>
        <input
          id="name"
          type="text"
          {...register('name')}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <span role="alert" className="error">
            {errors.name.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <span role="alert" className="error">
            {errors.description.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="quantity">Quantity *</label>
        <input
          id="quantity"
          type="number"
          {...register('quantity', { valueAsNumber: true })}
          aria-invalid={!!errors.quantity}
        />
        {errors.quantity && (
          <span role="alert" className="error">
            {errors.quantity.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="unitPrice">Unit Price *</label>
        <input
          id="unitPrice"
          type="number"
          step="0.01"
          {...register('unitPrice', { valueAsNumber: true })}
          aria-invalid={!!errors.unitPrice}
        />
        {errors.unitPrice && (
          <span role="alert" className="error">
            {errors.unitPrice.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="reorderPoint">Reorder Point *</label>
        <input
          id="reorderPoint"
          type="number"
          {...register('reorderPoint', { valueAsNumber: true })}
          aria-invalid={!!errors.reorderPoint}
        />
        {errors.reorderPoint && (
          <span role="alert" className="error">
            {errors.reorderPoint.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="category">Category *</label>
        <input
          id="category"
          type="text"
          {...register('category')}
          aria-invalid={!!errors.category}
        />
        {errors.category && (
          <span role="alert" className="error">
            {errors.category.message}
          </span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Inventory Item'}
      </button>
    </form>
  );
}
```

### Step 3: Create Mutation Hook

```typescript
// features/inventory/hooks/useInventoryMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../services/inventoryApi';
import type { CreateInventoryFormData } from '../schemas/inventoryForm.schema';

export function useCreateInventoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryFormData) => inventoryApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch inventory list
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
```

---

## Form Component Structure

### Standard Pattern (Always Use This)

```typescript
// features/{feature}/components/{Feature}Form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, type FormData } from '../schemas/{feature}Form.schema';
import { use{Feature}Mutation } from '../hooks/use{Feature}Mutations';

export function {Feature}Form() {
  // 1. Get mutation hook
  const mutation = use{Feature}Mutation();

  // 2. Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // All form fields with default values
    },
  });

  // 3. Submit handler
  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync(data);
      reset();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  // 4. Render form
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

**Rules:**
- **ALWAYS** follow this exact structure
- **ALWAYS** use `handleSubmit` wrapper
- **ALWAYS** handle errors with try/catch
- **ALWAYS** disable submit button when submitting
- **ALWAYS** reset form on success (if appropriate)

---

## Validation with Zod

### Integration Pattern

```typescript
// 1. Define schema
import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;

// 2. Use in form
const form = useForm<LoginFormData>({
  resolver: zodResolver(LoginFormSchema), // ← Connects Zod to RHF
});
```

### Cross-Field Validation

```typescript
// features/inventory/schemas/inventoryForm.schema.ts
export const InventoryFormSchema = z.object({
  quantity: z.number().int().min(0),
  reorderPoint: z.number().int().min(0),
}).refine(
  (data) => data.quantity >= data.reorderPoint,
  {
    message: 'Initial quantity must be at least equal to reorder point',
    path: ['quantity'], // Which field gets the error
  }
);
```

### Conditional Validation

```typescript
export const ProductFormSchema = z.object({
  type: z.enum(['simple', 'composite']),
  sku: z.string().min(3),
  components: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  // Composite products must have components
  if (data.type === 'composite' && (!data.components || data.components.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Composite products must have at least one component',
      path: ['components'],
    });
  }
});
```

---

## Reusable Form Components

### Shared Form Field (for Feature Use)

```typescript
// features/inventory/components/FormField.tsx
import { useFormContext } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password';
  required?: boolean;
  placeholder?: string;
}

export function FormField({
  name,
  label,
  type = 'text',
  required = false,
  placeholder,
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
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
        })}
      />
      {errorMessage && (
        <span id={`${name}-error`} role="alert" className="error">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
```

### Usage with FormProvider

```typescript
// features/inventory/components/InventoryCreateForm.tsx
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from './FormField';
import { CreateInventoryFormSchema, type CreateInventoryFormData } from '../schemas/inventoryForm.schema';

export function InventoryCreateForm() {
  const mutation = useCreateInventoryMutation();

  const methods = useForm<CreateInventoryFormData>({
    resolver: zodResolver(CreateInventoryFormSchema),
    defaultValues: {
      sku: '',
      name: '',
      quantity: 0,
      unitPrice: 0,
      reorderPoint: 0,
      category: '',
    },
  });

  const onSubmit = async (data: CreateInventoryFormData) => {
    try {
      await mutation.mutateAsync(data);
      methods.reset();
    } catch (error) {
      console.error('Failed to create inventory:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField name="sku" label="SKU" required />
        <FormField name="name" label="Product Name" required />
        <FormField name="quantity" label="Quantity" type="number" required />
        <FormField name="unitPrice" label="Unit Price" type="number" required />
        <FormField name="reorderPoint" label="Reorder Point" type="number" required />
        <FormField name="category" label="Category" required />

        <button type="submit" disabled={methods.formState.isSubmitting}>
          {methods.formState.isSubmitting ? 'Creating...' : 'Create Item'}
        </button>
      </form>
    </FormProvider>
  );
}
```

**Rules:**
- Use `FormProvider` when you have reusable field components
- Reusable field components live in **feature folder**, not shared `components/`
- If needed by 3+ features, promote to `src/components/` (but this is rare)

---

## Form State Management

### Default Values

```typescript
// Static defaults
const form = useForm<FormData>({
  defaultValues: {
    name: '',
    quantity: 0,
    isActive: true,
  },
});

// Async defaults (for edit forms)
const { data: item } = useInventoryDetailQuery(id);

const form = useForm<FormData>({
  defaultValues: {
    name: '',
    quantity: 0,
  },
});

// Update form when data loads
useEffect(() => {
  if (item) {
    form.reset({
      name: item.name,
      quantity: item.quantity,
    });
  }
}, [item, form]);
```

### Resetting Forms

```typescript
// Reset to default values
form.reset();

// Reset to specific values
form.reset({
  name: 'New Name',
  quantity: 10,
});

// Reset after successful submission
const onSubmit = async (data: FormData) => {
  await mutation.mutateAsync(data);
  form.reset(); // Clear form
};
```

### Watching Values

```typescript
const form = useForm<FormData>();

// Watch single field
const quantity = form.watch('quantity');

// Watch multiple fields
const [quantity, reorderPoint] = form.watch(['quantity', 'reorderPoint']);

// Watch all fields
const allValues = form.watch();

// Use in component
return (
  <div>
    <input {...form.register('quantity', { valueAsNumber: true })} />
    <p>Current quantity: {quantity}</p>
  </div>
);
```

### Manual Validation

```typescript
// Trigger validation for specific field
await form.trigger('email');

// Trigger validation for all fields
await form.trigger();

// Set custom error
form.setError('sku', {
  type: 'manual',
  message: 'SKU already exists',
});

// Clear errors
form.clearErrors('sku');
form.clearErrors(); // Clear all
```

---

## Common Patterns

### Pattern 1: Create Form

```typescript
// features/inventory/components/InventoryCreateForm.tsx
export function InventoryCreateForm({ onSuccess }: { onSuccess?: () => void }) {
  const mutation = useCreateInventoryMutation();

  const form = useForm<CreateInventoryFormData>({
    resolver: zodResolver(CreateInventoryFormSchema),
    defaultValues: {
      sku: '',
      name: '',
      quantity: 0,
    },
  });

  const onSubmit = async (data: CreateInventoryFormData) => {
    try {
      await mutation.mutateAsync(data);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Create failed:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Fields */}
      <button type="submit" disabled={form.formState.isSubmitting}>
        Create
      </button>
    </form>
  );
}
```

### Pattern 2: Edit Form

```typescript
// features/inventory/components/InventoryEditForm.tsx
interface InventoryEditFormProps {
  id: string;
  onSuccess?: () => void;
}

export function InventoryEditForm({ id, onSuccess }: InventoryEditFormProps) {
  const { data: item, isLoading } = useInventoryDetailQuery(id);
  const mutation = useUpdateInventoryMutation();

  const form = useForm<UpdateInventoryFormData>({
    resolver: zodResolver(UpdateInventoryFormSchema),
    defaultValues: {
      sku: '',
      name: '',
      quantity: 0,
    },
  });

  // Load existing data into form
  useEffect(() => {
    if (item) {
      form.reset({
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        reorderPoint: item.reorderPoint,
        category: item.category,
      });
    }
  }, [item, form]);

  const onSubmit = async (data: UpdateInventoryFormData) => {
    try {
      await mutation.mutateAsync({ id, ...data });
      onSuccess?.();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Fields */}
      <button type="submit" disabled={form.formState.isSubmitting}>
        Update
      </button>
    </form>
  );
}
```

### Pattern 3: Multi-Step Form

```typescript
// features/inventory/components/InventoryMultiStepForm.tsx
export function InventoryMultiStepForm() {
  const [step, setStep] = useState(1);
  const mutation = useCreateInventoryMutation();

  const form = useForm<CreateInventoryFormData>({
    resolver: zodResolver(CreateInventoryFormSchema),
    mode: 'onChange', // Validate on change for multi-step
  });

  const onSubmit = async (data: CreateInventoryFormData) => {
    try {
      await mutation.mutateAsync(data);
      form.reset();
      setStep(1);
    } catch (error) {
      console.error('Create failed:', error);
    }
  };

  const nextStep = async () => {
    // Validate current step fields
    const isValid = await form.trigger(['sku', 'name']); // Step 1 fields
    if (isValid) {
      setStep(2);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {step === 1 && (
        <>
          <input {...form.register('sku')} />
          {form.formState.errors.sku && <span>{form.formState.errors.sku.message}</span>}
          
          <input {...form.register('name')} />
          {form.formState.errors.name && <span>{form.formState.errors.name.message}</span>}
          
          <button type="button" onClick={nextStep}>
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input type="number" {...form.register('quantity', { valueAsNumber: true })} />
          {form.formState.errors.quantity && <span>{form.formState.errors.quantity.message}</span>}
          
          <button type="button" onClick={() => setStep(1)}>
            Back
          </button>
          <button type="submit" disabled={form.formState.isSubmitting}>
            Create
          </button>
        </>
      )}
    </form>
  );
}
```

### Pattern 4: Form with File Upload

```typescript
// features/inventory/components/InventoryImageForm.tsx
export function InventoryImageForm() {
  const mutation = useCreateInventoryMutation();

  const form = useForm<CreateInventoryWithImageFormData>({
    resolver: zodResolver(CreateInventoryWithImageFormSchema),
  });

  const onSubmit = async (data: CreateInventoryWithImageFormData) => {
    try {
      const formData = new FormData();
      formData.append('sku', data.sku);
      formData.append('name', data.name);
      
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      await mutation.mutateAsync(formData);
      form.reset();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('sku')} />
      
      <input
        type="file"
        accept="image/*"
        {...form.register('image')}
      />
      
      <button type="submit">Upload</button>
    </form>
  );
}

// Schema
const CreateInventoryWithImageFormSchema = z.object({
  sku: z.string().min(3),
  name: z.string().min(1),
  image: z.instanceof(FileList).optional(),
});
```

### Pattern 5: Select/Dropdown Fields

```typescript
// In form component
<select {...form.register('category')}>
  <option value="">Select category...</option>
  <option value="electronics">Electronics</option>
  <option value="furniture">Furniture</option>
  <option value="supplies">Supplies</option>
</select>

// Dynamic options from API
const { data: categories } = useCategoriesQuery();

<select {...form.register('category')}>
  <option value="">Select category...</option>
  {categories?.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>
```

### Pattern 6: Checkbox Fields

```typescript
// Single checkbox
<label>
  <input
    type="checkbox"
    {...form.register('isActive')}
  />
  Active
</label>

// Checkbox group
<div>
  <label>
    <input
      type="checkbox"
      value="email"
      {...form.register('notifications')}
    />
    Email
  </label>
  <label>
    <input
      type="checkbox"
      value="sms"
      {...form.register('notifications')}
    />
    SMS
  </label>
</div>

// Schema
const FormSchema = z.object({
  isActive: z.boolean(),
  notifications: z.array(z.string()),
});
```

---

## Error Handling

### Display Errors

```typescript
// Field error
{errors.fieldName && (
  <span role="alert" className="error">
    {errors.fieldName.message}
  </span>
)}

// All errors at top of form
{Object.keys(errors).length > 0 && (
  <div role="alert" className="error-summary">
    <p>Please fix the following errors:</p>
    <ul>
      {Object.entries(errors).map(([field, error]) => (
        <li key={field}>{error.message as string}</li>
      ))}
    </ul>
  </div>
)}
```

### Server Errors

```typescript
const onSubmit = async (data: FormData) => {
  try {
    await mutation.mutateAsync(data);
  } catch (error) {
    // Server returned field-specific errors
    if (error.response?.data?.errors) {
      const serverErrors = error.response.data.errors;
      
      Object.entries(serverErrors).forEach(([field, message]) => {
        form.setError(field as keyof FormData, {
          type: 'server',
          message: message as string,
        });
      });
    } else {
      // General error
      form.setError('root', {
        type: 'server',
        message: 'An error occurred. Please try again.',
      });
    }
  }
};

// Display root error
{errors.root && (
  <div role="alert" className="error">
    {errors.root.message}
  </div>
)}
```

---

## Testing Forms

### Component Test

```typescript
// features/inventory/components/InventoryCreateForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InventoryCreateForm } from './InventoryCreateForm';

describe('InventoryCreateForm', () => {
  const queryClient = new QueryClient();

  const renderForm = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <InventoryCreateForm />
      </QueryClientProvider>
    );
  };

  it('displays validation errors on submit', async () => {
    const user = userEvent.setup();
    renderForm();

    const submitButton = screen.getByRole('button', { name: /create/i });
    await user.click(submitButton);

    expect(await screen.findByText(/sku must be at least 3 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/sku/i), 'ITEM-001');
    await user.type(screen.getByLabelText(/product name/i), 'Test Item');
    await user.type(screen.getByLabelText(/quantity/i), '10');
    await user.type(screen.getByLabelText(/unit price/i), '19.99');
    await user.type(screen.getByLabelText(/reorder point/i), '5');
    await user.type(screen.getByLabelText(/category/i), 'Electronics');

    const submitButton = screen.getByRole('button', { name: /create/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    renderForm();

    const skuInput = screen.getByLabelText(/sku/i);
    await user.type(skuInput, 'ITEM-001');
    
    // Fill other required fields...

    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(skuInput).toHaveValue('');
    });
  });
});
```

---

## Quick Reference

### Essential Imports

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
```

### Form Initialization

```typescript
const {
  register,           // Register inputs
  handleSubmit,       // Form submission wrapper
  formState,          // Form state (errors, isSubmitting, etc.)
  reset,              // Reset form
  watch,              // Watch field values
  trigger,            // Manual validation
  setError,           // Set custom errors
  clearErrors,        // Clear errors
} = useForm<FormData>({
  resolver: zodResolver(FormSchema),
  defaultValues: { /* ... */ },
});
```

### Register Input

```typescript
// Text input
<input {...register('fieldName')} />

// Number input
<input type="number" {...register('fieldName', { valueAsNumber: true })} />

// Checkbox
<input type="checkbox" {...register('fieldName')} />

// Select
<select {...register('fieldName')}>
  <option value="">Select...</option>
</select>
```

### Display Errors

```typescript
{errors.fieldName && (
  <span role="alert">{errors.fieldName.message}</span>
)}
```

### Submit Handler

```typescript
const onSubmit = async (data: FormData) => {
  try {
    await mutation.mutateAsync(data);
    reset();
  } catch (error) {
    console.error(error);
  }
};

<form onSubmit={handleSubmit(onSubmit)}>
```

### Common FormState Properties

```typescript
formState.errors          // Validation errors
formState.isSubmitting    // Currently submitting
formState.isValid         // All fields valid
formState.isDirty         // Form modified
formState.dirtyFields     // Which fields modified
```

---

## Checklist

### Before Creating a Form

- [ ] Schema defined in `features/{name}/schemas/`
- [ ] Types inferred from schema with `z.infer`
- [ ] Mutation hook created in `features/{name}/hooks/`
- [ ] API service ready in `features/{name}/services/`

### Form Component Checklist

- [ ] Uses `useForm` with `zodResolver`
- [ ] Has `defaultValues` for all fields
-  [ ] Uses `handleSubmit` wrapper
- [ ] Displays validation errors
- [ ] Disables submit button when submitting
- [ ] Handles success (reset or redirect)
- [ ] Handles errors (display to user)

### Accessibility Checklist

- [ ] All inputs have associated labels
- [ ] Error messages use `role="alert"`
- [ ] Inputs have `aria-invalid` when errors present
- [ ] Required fields marked with `*` and `aria-label="required"`

.