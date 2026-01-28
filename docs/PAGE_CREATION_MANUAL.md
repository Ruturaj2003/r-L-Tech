# Complete Guide: Creating New Pages Following the OtherMaster Pattern

## 📚 Table of Contents
1. [Understanding the Architecture](#understanding-the-architecture)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Creation Guide](#step-by-step-creation-guide)
4. [File-by-File Breakdown](#file-by-file-breakdown)
5. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)
6. [Checklist](#checklist)

---

## Understanding the Architecture

### What is This Pattern?
This is a **CRUD (Create, Read, Update, Delete)** application pattern for managing data tables. Think of it as a template for creating pages that:
- Display data in a table
- Allow adding new records
- Allow editing existing records
- Allow viewing record details
- Allow deleting records

### The File Structure
```
YourFeature/
├── components/           # UI Components
│   ├── YourFeaturePage.tsx          # Main page (orchestrates everything)
│   ├── YourFeatureHeader.tsx        # Page title and Add button
│   ├── YourFeatureTable.tsx         # Data table display
│   ├── YourFeatureForm.tsx          # Form for Create/Edit/View/Delete
│   └── YourFeature.columns.tsx      # Table column definitions
├── hooks/                # Data fetching logic
│   ├── queryKeys.ts                 # Cache keys for React Query
│   ├── useYourFeaturesQuery.ts      # Fetch list of records
│   ├── useYourFeatureQuery.ts       # Fetch single record
│   ├── useYourFeatureMutations.ts   # Create/Update/Delete operations
│   └── useYourFeatureDropdown.ts    # Fetch dropdown options
├── schemas/              # Data validation
│   ├── yourFeature.schema.ts        # Define what data looks like
│   └── yourFeatureForm.schema.ts    # Define form validation rules
├── services/             # API calls (not shown in your files)
│   └── yourFeatureApi.ts            # Actual HTTP requests
└── types/                # TypeScript type definitions
    └── yourFeature.types.ts         # Custom types
```

---

## Prerequisites

### What You Need to Know
- **Basic JavaScript**: Variables, functions, objects, arrays
- **Basic TypeScript**: Types and interfaces (don't worry, we'll guide you)
- **React Basics**: Components, props, state (we'll explain as we go)

### Tools You Need Installed
- Node.js (v16 or higher)
- A code editor (VS Code recommended)
- Your project should already have these libraries:
  - React
  - React Hook Form
  - Zod (for validation)
  - TanStack React Query
  - TanStack React Table

### Understanding Key Concepts

#### 1. **Component**: A reusable piece of UI
```tsx
// This is a component - it returns HTML-like code (JSX)
function MyButton() {
  return <button>Click Me</button>;
}
```

#### 2. **Props**: Data passed to components
```tsx
// Props are like function parameters
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage: <Greeting name="John" />
```

#### 3. **State**: Data that can change
```tsx
// State is data that makes your page interactive
const [count, setCount] = useState(0); // count starts at 0
// setCount(5) would change count to 5
```

#### 4. **Schema**: Rules for your data
```tsx
// This says "name must be text and required"
const schema = z.object({
  name: z.string().min(1, "Name is required")
});
```

---

## Step-by-Step Creation Guide

Let's create a **Product Master** page as an example. Replace "Product" with whatever you're building.

---

### STEP 1: Create the Folder Structure

**Where to create**: Inside your `src/features/` directory

**Create these folders**:
```
src/features/inventory/productMaster/
├── components/
├── hooks/
├── schemas/
├── services/
└── types/
```

**How to create**:
- In VS Code: Right-click → New Folder
- Or use terminal: `mkdir -p src/features/inventory/productMaster/{components,hooks,schemas,services,types}`

---

### STEP 2: Define Your Data Structure (Schemas)

#### File 1: `schemas/productMaster.schema.ts`

**Purpose**: Define what a Product record looks like when you GET it from the API.

**Copy this template and modify**:

```typescript
import { z } from "zod";

/**
 * Product Master entity schema
 * This is what ONE product looks like from the API
 */
export const ProductMasterEntitySchema = z.object({
  // Primary key - unique ID for each product
  mTransNo: z.number(),
  
  // Your actual fields - CHANGE THESE
  productCode: z.string().min(1),
  productName: z.string().min(1),
  category: z.string().min(1),
  price: z.number(),
  
  // Status field (usually Y/N for Active/Inactive)
  status: z.enum(["Y", "N"]),
});

/**
 * Category dropdown option schema
 * For any dropdowns in your form
 */
export const ProductCategoryOptionSchema = z.object({
  categoryName: z.string().min(1),
});

/**
 * Delete reason dropdown option schema
 * Required for delete operation
 */
export const ProductDeleteReasonOptionSchema = z.object({
  mTransNo: z.number(),
  masterName: z.string().min(1),
});

// Export TypeScript types (auto-generated from schemas)
export type ProductMasterEntity = z.infer<typeof ProductMasterEntitySchema>;
export type ProductCategoryOption = z.infer<typeof ProductCategoryOptionSchema>;
export type ProductDeleteReasonOption = z.infer<typeof ProductDeleteReasonOptionSchema>;
```

**🎯 What to Change**:
1. Replace `ProductMaster` with your feature name
2. Replace the fields inside `.object({...})` with YOUR data fields
3. Keep `mTransNo` and `status` - these are standard
4. Create option schemas for any dropdowns you need

---

#### File 2: `schemas/productMasterForm.schema.ts`

**Purpose**: Define form validation rules and API request formats.

```typescript
import { z } from "zod";
import type { FORM_MODE } from "@/types/commonTypes";

/**
 * Product Master UI Form Schema
 * This validates the form in the browser
 */
export const getProductMasterFormSchema = (mode: FORM_MODE) =>
  z
    .object({
      // YOUR FORM FIELDS - CHANGE THESE
      productCode: z
        .string()
        .min(1, "Product Code is required")
        .max(20, "Maximum 20 characters"),
      
      productName: z
        .string()
        .min(1, "Product Name is required")
        .max(100, "Maximum 100 characters"),
      
      category: z.string().min(1, "Category is required"),
      
      price: z
        .number()
        .min(0, "Price must be positive")
        .max(999999, "Price too large"),
      
      lockStatus: z.enum(["Y", "N"]),
      
      // DELETE REASON - Keep this
      deleteReason: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // Make delete reason required in Delete mode
      if (mode === "Delete" && !data.deleteReason) {
        ctx.addIssue({
          path: ["deleteReason"],
          code: z.ZodIssueCode.custom,
          message: "Delete reason is required",
        });
      }
    });

export type ProductMasterFormData = z.infer<
  ReturnType<typeof getProductMasterFormSchema>
>;

/**
 * API Request for Create/Update
 * This is sent to the backend
 */
export const UpsertProductMasterRequestSchema = z.object({
  // STANDARD FIELDS - Usually don't change these
  mTransNo: z.number(),
  mCount: z.number().default(0),
  systemIP: z.string().default("0"),
  createdBy: z.number(),
  createdOn: z.string(), // ISO date string
  subscID: z.number(),
  status: z.enum(["Insert", "Update"]),
  
  // YOUR DATA FIELDS - Match the form schema
  productCode: z.string().min(1),
  productName: z.string().min(1),
  category: z.string().min(1),
  price: z.number(),
  lockStatus: z.enum(["Y", "N"]),
});

export type UpsertProductMasterRequest = z.infer<
  typeof UpsertProductMasterRequestSchema
>;

/**
 * API Request for Delete
 */
export const DeleteProductMasterRequestSchema = z.object({
  mTransNo: z.number(),
  userNo: z.number(),
  reason: z.string().min(1, "Delete reason is required"),
});

export type DeleteProductMasterRequest = z.infer<
  typeof DeleteProductMasterRequestSchema
>;
```

**🎯 What to Change**:
1. Inside `getProductMasterFormSchema`: Replace fields with YOUR form fields
2. Add validation rules: `.min()`, `.max()`, `.email()`, `.regex()`, etc.
3. In `UpsertProductMasterRequestSchema`: Match your form fields
4. Keep the standard fields (`mTransNo`, `createdBy`, etc.) unless your API is different

---

### STEP 3: Create API Service Layer

#### File: `services/productMasterApi.ts`

**Purpose**: Make HTTP requests to your backend.

```typescript
import axios from "axios";
import type {
  ProductMasterEntity,
  ProductCategoryOption,
  ProductDeleteReasonOption,
} from "../schemas/productMaster.schema";
import type {
  UpsertProductMasterRequest,
  DeleteProductMasterRequest,
} from "../schemas/productMasterForm.schema";

// CHANGE THIS to your actual API base URL
const API_BASE_URL = "/api/product-master";

export const productMasterApi = {
  /**
   * Get list of all products
   */
  async getList(subscID: number): Promise<ProductMasterEntity[]> {
    const response = await axios.get(`${API_BASE_URL}/list`, {
      params: { subscID },
    });
    return response.data;
  },

  /**
   * Get single product by ID
   */
  async getById(mTransNo: number): Promise<ProductMasterEntity> {
    const response = await axios.get(`${API_BASE_URL}/${mTransNo}`);
    return response.data;
  },

  /**
   * Create or Update product
   */
  async upsert(payload: UpsertProductMasterRequest): Promise<void> {
    await axios.post(`${API_BASE_URL}/upsert`, payload);
  },

  /**
   * Delete product
   */
  async delete(payload: DeleteProductMasterRequest): Promise<void> {
    await axios.post(`${API_BASE_URL}/delete`, payload);
  },

  /**
   * Get category options for dropdown
   */
  async getCategoryOptions(): Promise<ProductCategoryOption[]> {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  },

  /**
   * Get delete reason options
   */
  async getDeleteReasonOptions(subscID: number): Promise<ProductDeleteReasonOption[]> {
    const response = await axios.get(`${API_BASE_URL}/delete-reasons`, {
      params: { subscID },
    });
    return response.data;
  },
};
```

**🎯 What to Change**:
1. `API_BASE_URL`: Change to your actual backend endpoint
2. Method names: Match your backend API routes
3. Add/remove dropdown option methods as needed
4. Adjust URL paths to match your backend

---

### STEP 4: Create React Query Hooks

#### File 1: `hooks/queryKeys.ts`

**Purpose**: Define cache keys for React Query (for data caching).

```typescript
/**
 * React Query keys for Product Master
 * These help React Query know when to refresh data
 */
export const productMasterQueryKeys = {
  all: ["productMaster"] as const,
  list: () => [...productMasterQueryKeys.all, "list"] as const,
  detail: (mTransNo: number) => [
    ...productMasterQueryKeys.all,
    "detail",
    mTransNo,
  ] as const,
  categories: () => [...productMasterQueryKeys.all, "categories"] as const,
  deleteReasons: (subscID: number) =>
    [...productMasterQueryKeys.all, "deleteReasons", subscID] as const,
};
```

**🎯 What to Change**:
1. Replace `productMaster` with your feature name
2. Add keys for any additional dropdown or lookup queries

---

#### File 2: `hooks/useProductMastersQuery.ts`

**Purpose**: Fetch list of all products.

```typescript
import { useQuery } from "@tanstack/react-query";
import { productMasterApi } from "../services/productMasterApi";
import { productMasterQueryKeys } from "./queryKeys";
import type { ProductMasterEntity } from "../schemas";

export function useProductMastersQuery(subscID: number) {
  return useQuery<ProductMasterEntity[]>({
    queryKey: productMasterQueryKeys.list(),
    queryFn: () => productMasterApi.getList(subscID),
    enabled: subscID > 0, // Only run if subscID is valid
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
```

**🎯 What to Change**:
1. Replace `productMaster` with your feature name throughout
2. Adjust `enabled` condition if needed
3. Adjust `staleTime` (how long to cache data)

---

#### File 3: `hooks/useProductMasterQuery.ts`

**Purpose**: Fetch a single product by ID.

```typescript
import { useQuery } from "@tanstack/react-query";
import { productMasterApi } from "../services/productMasterApi";
import type { ProductMasterEntity } from "../schemas";
import { productMasterQueryKeys } from "./queryKeys";

export function useProductMasterQuery(mTransNo: number) {
  return useQuery<ProductMasterEntity>({
    queryKey: productMasterQueryKeys.detail(mTransNo),
    queryFn: () => productMasterApi.getById(mTransNo),
    enabled: mTransNo > 0, // Only run if ID is valid
  });
}
```

---

#### File 4: `hooks/useProductMasterMutations.ts`

**Purpose**: Create, update, and delete operations.

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productMasterApi } from "../services/productMasterApi";
import { productMasterQueryKeys } from "./queryKeys";
import type {
  UpsertProductMasterRequest,
  DeleteProductMasterRequest,
} from "../schemas/productMasterForm.schema";

/**
 * Hook for creating or updating products
 */
export function useUpsertProductMasterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertProductMasterRequest) =>
      productMasterApi.upsert(payload),
    onSuccess: () => {
      // Refresh the list after successful save
      queryClient.invalidateQueries({
        queryKey: productMasterQueryKeys.list(),
      });
    },
  });
}

/**
 * Hook for deleting products
 */
export function useDeleteProductMasterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteProductMasterRequest) =>
      productMasterApi.delete(payload),
    onSuccess: () => {
      // Refresh the list after successful delete
      queryClient.invalidateQueries({
        queryKey: productMasterQueryKeys.list(),
      });
    },
  });
}
```

---

#### File 5: `hooks/useProductMasterDropdown.ts`

**Purpose**: Fetch dropdown options.

```typescript
import { useQuery } from "@tanstack/react-query";
import { productMasterApi } from "../services/productMasterApi";
import { productMasterQueryKeys } from "./queryKeys";
import type {
  ProductCategoryOption,
  ProductDeleteReasonOption,
} from "../schemas";

export function useCategoriesQuery() {
  return useQuery<ProductCategoryOption[]>({
    queryKey: productMasterQueryKeys.categories(),
    queryFn: () => productMasterApi.getCategoryOptions(),
    staleTime: Infinity, // Cache forever (reference data doesn't change)
  });
}

export function useDeleteReasonsQuery(subscID: number) {
  return useQuery<ProductDeleteReasonOption[]>({
    queryKey: productMasterQueryKeys.deleteReasons(subscID),
    queryFn: () => productMasterApi.getDeleteReasonOptions(subscID),
    enabled: subscID > 0,
    staleTime: Infinity,
  });
}
```

**🎯 What to Change**:
1. Add a query function for each dropdown you need
2. Match the names to your actual dropdowns

---

### STEP 5: Create Table Column Definitions

#### File: `components/ProductMaster.columns.tsx`

**Purpose**: Define what columns appear in your table and how they look.

```typescript
import type { ColumnDef } from "@tanstack/react-table";
import type { ProductMasterEntity } from "../schemas";
import { Eye, Pencil, Trash } from "lucide-react";

export const createProductMasterColumns = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (row: ProductMasterEntity) => void;
  onEdit: (row: ProductMasterEntity) => void;
  onDelete: (row: ProductMasterEntity) => void;
}): ColumnDef<ProductMasterEntity>[] => [
  // Serial number column
  {
    id: "sl",
    header: "SL",
    cell: ({ row }) => row.index + 1,
    size: 60,
  },
  
  // YOUR DATA COLUMNS - CHANGE THESE
  {
    accessorKey: "productCode",
    header: "Code",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "productName",
    header: "Product Name",
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "category",
    header: "Category",
    enableColumnFilter: true,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return `$${value.toFixed(2)}`;
    },
  },
  
  // Status column with colored badge
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue<"Y" | "N">();
      return (
        <span
          className={
            value === "Y"
              ? "inline-flex rounded px-2 py-0.5 text-xs bg-success text-success-foreground"
              : "inline-flex rounded px-2 py-0.5 text-xs bg-muted text-muted-foreground"
          }
        >
          {value === "Y" ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  
  // Actions column (View, Edit, Delete buttons)
  {
    id: "actions",
    header: () => <div className="text-center w-full">Actions</div>,
    cell: ({ row }) => {
      const originalRow = row.original;
      return (
        <div className="flex items-center justify-center gap-2">
          <button
            title="View"
            onClick={() => onView(originalRow)}
            className="h-7 w-7 rounded-md flex items-center justify-center
                       bg-accent text-accent-foreground
                       focus:ring-2 focus:ring-ring"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            title="Edit"
            onClick={() => onEdit(originalRow)}
            className="h-7 w-7 rounded-md flex items-center justify-center
                       bg-accent text-primary
                       focus:ring-2 focus:ring-ring"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            title="Delete"
            onClick={() => onDelete(originalRow)}
            className="h-7 w-7 rounded-md flex items-center justify-center
                       text-destructive
                       focus:ring-2 focus:ring-ring"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      );
    },
  },
];
```

**🎯 What to Change**:
1. Replace the data columns with YOUR fields
2. Add custom `cell` formatters for dates, numbers, etc.
3. Enable/disable sorting and filtering per column
4. Keep the `sl` and `actions` columns as-is

**Understanding Column Properties**:
- `accessorKey`: Which field from your data to display
- `header`: Column title
- `enableSorting`: Can users click to sort?
- `enableColumnFilter`: Can users filter this column?
- `cell`: Custom display logic (format numbers, dates, etc.)

---

### STEP 6: Create the Form Component

#### File: `components/ProductMasterForm.tsx`

**Purpose**: The form for creating/editing/viewing/deleting records.

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { FormContainer } from "@/components/form/FormContainer";
import { FormField } from "@/components/form/FormField";
import {
  ControlledCombobox,
  ControlledInput,
  ControlledSelect,
} from "@/components/form/ControlledInputs";

import { getProductMasterFormSchema, type ProductMasterFormData } from "../schemas";
import type { FORM_MODE } from "@/types/commonTypes";
import type {
  DeleteReasonOption,
  CategoryOption,
} from "../types/productMaster.types";

import { DeleteReasonDialog } from "@/components/DeleteReasonDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface ProductMasterFormProps {
  mode: FORM_MODE;
  defaultValues: ProductMasterFormData;
  onSubmit: (data: ProductMasterFormData) => Promise<void>;
  setModalClose?: () => void;
  deleteReasonOptions?: DeleteReasonOption[];
  categoryOptions: CategoryOption[];
}

export default function ProductMasterForm({
  mode,
  defaultValues,
  onSubmit,
  setModalClose,
  deleteReasonOptions = [],
  categoryOptions,
}: ProductMasterFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductMasterFormData>({
    resolver: zodResolver(getProductMasterFormSchema(mode)),
    defaultValues,
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const handleClose = () => {
    if (isDirty && !isSubmitting) {
      setShowConfirmClose(true);
      return;
    }
    setModalClose?.();
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, mode]);

  const onInvalid = (errors: unknown) => {
    console.log("FORM ERRORS", errors);
  };

  return (
    <>
      <ConfirmDialog
        open={showConfirmClose}
        onOpenChange={setShowConfirmClose}
        title="Unsaved changes"
        description="You have unsaved changes. If you close now, your changes will be lost."
        confirmLabel="Discard changes"
        onConfirm={() => {
          setShowConfirmClose(false);
          setModalClose?.();
        }}
      />

      <FormContainer
        title="Product Master"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        isSubmitting={isSubmitting}
        onClose={handleClose}
        mode={mode}
        onDelete={() => setOpenDeleteDialog(true)}
      >
        {/* YOUR FORM FIELDS GO HERE */}
        <div className="grid grid-cols-2 gap-x-2">
          <FormField
            label="Product Code"
            name="productCode"
            required
            error={errors.productCode?.message}
          >
            <ControlledInput
              name="productCode"
              register={register}
              disabled={mode === "View" || mode === "Delete"}
              error={errors.productCode?.message}
              placeholder="Enter product code"
            />
          </FormField>

          <FormField
            label="Product Name"
            name="productName"
            required
            error={errors.productName?.message}
          >
            <ControlledInput
              name="productName"
              register={register}
              disabled={mode === "View" || mode === "Delete"}
              error={errors.productName?.message}
              placeholder="Enter product name"
            />
          </FormField>
        </div>

        <FormField
          label="Category"
          name="category"
          required
          error={errors.category?.message}
        >
          <ControlledCombobox<ProductMasterFormData, string>
            name="category"
            control={control}
            placeholder="Select Category"
            disabled={mode === "View" || mode === "Delete"}
            showClear={mode !== "View" && mode !== "Delete"}
            options={
              categoryOptions?.map((cat) => ({
                label: cat.categoryName,
                value: cat.categoryName,
              })) ?? []
            }
            error={errors.category?.message}
          />
        </FormField>

        <FormField
          label="Price"
          name="price"
          required
          error={errors.price?.message}
        >
          <ControlledInput
            name="price"
            register={register}
            type="number"
            disabled={mode === "View" || mode === "Delete"}
            error={errors.price?.message}
            placeholder="0.00"
          />
        </FormField>

        <FormField
          label="Lock Status"
          name="lockStatus"
          required
          error={errors.lockStatus?.message}
        >
          <ControlledSelect
            name="lockStatus"
            disabled={mode === "View" || mode === "Delete"}
            options={[
              { label: "No", value: "N" },
              { label: "Yes", value: "Y" },
            ]}
            control={control}
            error={errors.lockStatus?.message}
          />
        </FormField>

        {mode === "Delete" && (
          <DeleteReasonDialog<ProductMasterFormData, DeleteReasonOption>
            open={openDeleteDialog}
            onOpenChange={setOpenDeleteDialog}
            control={control}
            errors={errors}
            name="deleteReason"
            options={deleteReasonOptions}
            getLabel={(r) => r.masterName}
            getValue={(r) => String(r.mTransNo)}
            isSubmitting={isSubmitting}
            onConfirm={handleSubmit(onSubmit, onInvalid)}
          />
        )}
      </FormContainer>
    </>
  );
}
```

**🎯 What to Change**:
1. Replace all "Product" references with your feature name
2. Inside `<FormContainer>`: Replace form fields with YOUR fields
3. Match field types to your data:
   - Text → `<ControlledInput>`
   - Dropdown → `<ControlledSelect>` or `<ControlledCombobox>`
   - Date → `<ControlledDatePicker>` (if available)
   - Number → `<ControlledInput type="number">`
4. Update grid layout (2 columns, 3 columns, etc.)

**Form Field Components Explained**:

```typescript
// Simple text input
<ControlledInput
  name="fieldName"           // Must match schema
  register={register}        // Connect to form
  disabled={mode === "View"} // Read-only in view mode
  placeholder="Enter text"
/>

// Dropdown (simple)
<ControlledSelect
  name="fieldName"
  control={control}
  options={[
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
  ]}
/>

// Searchable dropdown
<ControlledCombobox
  name="fieldName"
  control={control}
  options={options}          // From your API
  placeholder="Search..."
/>
```

---

### STEP 7: Create Supporting Components

#### File 1: `components/ProductMasterHeader.tsx`

**Purpose**: Page title, search bar, and Add button.

```typescript
import { PageHeader } from "@/components/PageHeader";

interface ProductMasterHeaderProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  setModalOpen: () => void;
}

export const ProductMasterHeader = ({
  globalFilter,
  setGlobalFilter,
  setModalOpen,
}: ProductMasterHeaderProps) => {
  return (
    <PageHeader
      title="Product Master"
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      onActionClick={setModalOpen}
      actionLabel="Add +"
    />
  );
};
```

**🎯 What to Change**:
1. `title`: Change to your page title
2. `actionLabel`: Change button text if needed

---

#### File 2: `components/ProductMasterTable.tsx`

**Purpose**: Wrapper for the data table.

```typescript
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/DataTable";
import type { ProductMasterEntity } from "../schemas";

interface ProductMasterTableProps {
  columnData: ColumnDef<ProductMasterEntity>[];
  data: ProductMasterEntity[];
  isLoading: boolean;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export const ProductMasterTable = (props: ProductMasterTableProps) => {
  return (
    <DataTable<ProductMasterEntity>
      columns={props.columnData}
      data={props.data}
      isLoading={props.isLoading}
      globalFilter={props.globalFilter}
      setGlobalFilter={props.setGlobalFilter}
      ariaLabel="Product Master table"
    />
  );
};
```

**🎯 What to Change**:
1. Replace `ProductMaster` with your feature name
2. Update `ariaLabel` for accessibility

---

#### File 3: `components/ProductMasterForm.mapper.ts`

**Purpose**: Convert table row data to form default values.

```typescript
import type { FORM_MODE } from "@/types/commonTypes";
import type { ProductMasterEntity, ProductMasterFormData } from "../schemas";

export function mapRowToFormDefaults(
  mode: FORM_MODE,
  row: ProductMasterEntity | null
): ProductMasterFormData {
  if (mode === "Create" || !row) {
    return {
      productCode: "",
      productName: "",
      category: "",
      price: 0,
      lockStatus: "N",
      deleteReason: undefined,
    };
  }

  return {
    productCode: row.productCode,
    productName: row.productName,
    category: row.category,
    price: row.price,
    lockStatus: row.status, // Map status to lockStatus
    deleteReason: undefined,
  };
}
```

**🎯 What to Change**:
1. Match the return object to YOUR form fields
2. Set appropriate default values for Create mode
3. Map row fields to form fields correctly

---

### STEP 8: Create the Main Page Component

#### File: `components/ProductMasterPage.tsx`

**Purpose**: The main orchestrator - brings everything together.

```typescript
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@base-ui/react";

import { useProductMastersQuery } from "../hooks/useProductMastersQuery";
import {
  useDeleteProductMasterMutation,
  useUpsertProductMasterMutation,
} from "../hooks/useProductMasterMutations";
import {
  useDeleteReasonsQuery,
  useCategoriesQuery,
} from "../hooks/useProductMasterDropdown";

import { ProductMasterHeader } from "./ProductMasterHeader";
import { ProductMasterTable } from "./ProductMasterTable";
import ProductMasterForm from "./ProductMasterForm";
import { Modal } from "@/components/Modal";

import { createProductMasterColumns } from "./ProductMaster.columns";
import { mapRowToFormDefaults } from "./ProductMasterForm.mapper";

import type { FORM_MODE } from "@/types/commonTypes";
import type {
  DeleteProductMasterRequest,
  ProductMasterEntity,
  ProductMasterFormData,
  UpsertProductMasterRequest,
} from "../schemas";

const ProductMasterPage = () => {
  // CHANGE THIS: Your subscription ID source
  const subscID = 1;

  // Fetch data
  const {
    data = [],
    isLoading,
    error: masterDataError,
  } = useProductMastersQuery(subscID);

  const {
    data: categoryOptions = [],
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useCategoriesQuery();

  const {
    data: deleteReasonOptions = [],
    isLoading: isDeleteReasonLoading,
    error: deleteReasonError,
  } = useDeleteReasonsQuery(subscID);

  // Mutations
  const upsertProductMaster = useUpsertProductMasterMutation();
  const deleteProductMaster = useDeleteProductMasterMutation();

  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FORM_MODE>("View");
  const [selectedRow, setSelectedRow] = useState<ProductMasterEntity | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  /**
   * Handle form submission for Create/Edit/Delete
   */
  const handleFormSubmit = async (data: ProductMasterFormData) => {
    if ((formMode === "Edit" || formMode === "Delete") && !selectedRow) {
      toast.error("No record selected");
      return;
    }

    try {
      if (formMode === "Create") {
        const payload: UpsertProductMasterRequest = {
          createdBy: 1, // CHANGE THIS: Get from auth context
          createdOn: new Date().toISOString(),
          mCount: 0,
          subscID,
          mTransNo: 0,
          systemIP: "0.0.0.0",
          status: "Insert",
          ...data,
        };

        await upsertProductMaster.mutateAsync(payload);
        toast.success("Product created successfully");
      }

      if (formMode === "Edit" && selectedRow) {
        const payload: UpsertProductMasterRequest = {
          createdBy: 1, // CHANGE THIS: Get from auth context
          createdOn: new Date().toISOString(),
          mCount: 0,
          subscID,
          mTransNo: selectedRow.mTransNo,
          systemIP: "0.0.0.0",
          status: "Update",
          ...data,
        };

        await upsertProductMaster.mutateAsync(payload);
        toast.success("Product updated successfully");
      }

      if (formMode === "Delete" && selectedRow) {
        const payload: DeleteProductMasterRequest = {
          mTransNo: selectedRow.mTransNo,
          reason: data.deleteReason!,
          userNo: 1, // CHANGE THIS: Get from auth context
        };

        await deleteProductMaster.mutateAsync(payload);
        toast.success("Product deleted successfully");
      }

      setIsModalOpen(false);
    } catch (error) {
      const operation =
        formMode === "Create"
          ? "create"
          : formMode === "Edit"
            ? "update"
            : "delete";

      toast.error(`Failed to ${operation} product`, {
        description:
          error instanceof Error ? error.message : "Please try again",
      });

      console.error(`Error during ${operation}:`, error);
    }
  };

  /**
   * Table column configuration
   */
  const columns = createProductMasterColumns({
    onView: (row) => {
      setSelectedRow(row);
      setFormMode("View");
      setIsModalOpen(true);
    },
    onEdit: (row) => {
      setSelectedRow(row);
      setFormMode("Edit");
      setIsModalOpen(true);
    },
    onDelete: (row) => {
      setSelectedRow(row);
      setFormMode("Delete");
      setIsModalOpen(true);
    },
  });

  /**
   * Error state
   */
  if (masterDataError || categoryError || deleteReasonError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Failed to load data</h2>
          <p className="text-muted-foreground mb-4">
            {masterDataError?.message ||
              categoryError?.message ||
              deleteReasonError?.message ||
              "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex flex-col h-full">
        <ProductMasterHeader
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          setModalOpen={() => {
            setSelectedRow(null);
            setFormMode("Create");
            setIsModalOpen(true);
          }}
        />

        <Modal open={isModalOpen}>
          {isDeleteReasonLoading || isCategoryLoading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading form data...
              </p>
            </div>
          ) : (
            <ProductMasterForm
              mode={formMode}
              onSubmit={handleFormSubmit}
              defaultValues={mapRowToFormDefaults(formMode, selectedRow)}
              setModalClose={() => setIsModalOpen(false)}
              deleteReasonOptions={deleteReasonOptions}
              categoryOptions={categoryOptions}
            />
          )}
        </Modal>

        <ProductMasterTable
          columnData={columns}
          data={data}
          isLoading={isLoading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
    </div>
  );
};

export default ProductMasterPage;
```

**🎯 What to Change**:
1. Replace all `ProductMaster` references
2. Change `subscID` to your actual subscription source
3. Update `createdBy` and `userNo` to use your authentication system
4. Adjust toast messages to your feature name
5. Update the payload fields in `handleFormSubmit` to match YOUR data

---

### STEP 9: Create Types File (Optional but Recommended)

#### File: `types/productMaster.types.ts`

```typescript
import type {
  ProductCategoryOption,
  ProductDeleteReasonOption,
} from "../schemas";

// Re-export for convenience
export type { ProductCategoryOption as CategoryOption };
export type { ProductDeleteReasonOption as DeleteReasonOption };

// Add any custom types here
export interface ProductMasterFilters {
  category?: string;
  priceRange?: [number, number];
  status?: "Y" | "N";
}
```

---

### STEP 10: Add Route to Your App

#### In your router file (e.g., `App.tsx` or `routes.tsx`):

```typescript
import ProductMasterPage from "@/features/inventory/productMaster/components/ProductMasterPage";

// In your routes array:
{
  path: "/product-master",
  element: <ProductMasterPage />,
}
```

---

## Common Pitfalls and Solutions

### Problem 1: TypeScript Errors
**Error**: `Property 'xyz' does not exist on type...`
**Solution**: Make sure field names match exactly between:
- Schema definitions
- Form field names
- API response fields
- Table column accessorKeys

### Problem 2: Form Not Submitting
**Checklist**:
- [ ] Schema validation passing?
- [ ] All required fields filled?
- [ ] API endpoint correct?
- [ ] Check browser console for errors
- [ ] Check network tab for API response

### Problem 3: Data Not Refreshing
**Solution**: Check that `invalidateQueries` is called after mutations:
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: productMasterQueryKeys.list(),
  });
}
```

### Problem 4: Dropdown Not Showing Options
**Checklist**:
- [ ] API returning data? (Check network tab)
- [ ] Schema matching API response?
- [ ] Options mapped correctly in form?
```typescript
options={categoryOptions?.map((cat) => ({
  label: cat.categoryName,  // Match your API field
  value: cat.categoryName,  // Match your API field
})) ?? []}
```

### Problem 5: Modal Not Opening/Closing
**Solution**: Check state management:
```typescript
// Open modal
setIsModalOpen(true);

// Close modal
setIsModalOpen(false);

// In form
setModalClose={() => setIsModalOpen(false)}
```

---

## Checklist Before Testing

### Files Created
- [ ] `schemas/yourFeature.schema.ts`
- [ ] `schemas/yourFeatureForm.schema.ts`
- [ ] `services/yourFeatureApi.ts`
- [ ] `hooks/queryKeys.ts`
- [ ] `hooks/useYourFeaturesQuery.ts`
- [ ] `hooks/useYourFeatureQuery.ts`
- [ ] `hooks/useYourFeatureMutations.ts`
- [ ] `hooks/useYourFeatureDropdown.ts`
- [ ] `components/YourFeature.columns.tsx`
- [ ] `components/YourFeatureForm.tsx`
- [ ] `components/YourFeatureForm.mapper.ts`
- [ ] `components/YourFeatureHeader.tsx`
- [ ] `components/YourFeatureTable.tsx`
- [ ] `components/YourFeaturePage.tsx`
- [ ] `types/yourFeature.types.ts`

### Code Review
- [ ] All "YourFeature" placeholders replaced?
- [ ] API endpoints match backend?
- [ ] Field names consistent everywhere?
- [ ] Form validation rules make sense?
- [ ] Default values set correctly?
- [ ] Authentication context used (if available)?
- [ ] Route added to router?

### Testing Steps
1. [ ] Page loads without errors
2. [ ] Table displays data
3. [ ] Search/filter works
4. [ ] "Add" button opens modal
5. [ ] Create form submits successfully
6. [ ] View button shows read-only form
7. [ ] Edit button allows modifications
8. [ ] Edit form saves changes
9. [ ] Delete button shows confirmation
10. [ ] Delete removes record
11. [ ] Table refreshes after operations
12. [ ] Error messages display properly

---

## Quick Reference: File Purposes

| File | Purpose | When to Edit |
|------|---------|--------------|
| `*.schema.ts` | Data structure & validation | Always - define your data |
| `*Api.ts` | HTTP requests | Always - match your endpoints |
| `queryKeys.ts` | Cache management | Rarely - usually just rename |
| `useQuery` hooks | Fetch data | Rarely - just rename |
| `useMutations` hooks | Save/delete data | Rarely - just rename |
| `*.columns.tsx` | Table columns | Always - define what shows in table |
| `*Form.tsx` | Form UI | Always - create your form fields |
| `*Form.mapper.ts` | Data conversion | Always - map your data |
| `*Header.tsx` | Page header | Sometimes - customize title |
| `*Table.tsx` | Table wrapper | Rarely - usually works as-is |
| `*Page.tsx` | Main orchestrator | Sometimes - adjust logic |

---

## Tips for Success

1. **Start Simple**: Get the basic Create/List working first, then add Edit and Delete.

2. **Use the Browser Console**: Press F12 to see errors and network requests.

3. **Test the API First**: Use Postman or similar to verify your backend works before building the UI.

4. **Copy-Paste Carefully**: When copying code, use Find & Replace (Ctrl+H in VS Code) to change all occurrences of the feature name at once.

5. **One Field at a Time**: When adding form fields, add one, test it, then add the next.

6. **Match Types Exactly**: If your API returns `product_name`, but you want `productName` in the UI, you need to map it in the API service layer.

7. **Save Often**: Commit to Git frequently so you can roll back if something breaks.

8. **Ask for Help**: When stuck, share the specific error message and what you were trying to do.

---

## Next Steps

After successfully creating your first page:

1. **Add More Features**:
   - Bulk actions (delete multiple)
   - Export to Excel
   - Advanced filtering
   - Pagination

2. **Improve UX**:
   - Loading skeletons
   - Optimistic updates
   - Better error messages
   - Keyboard shortcuts

3. **Add Tests**:
   - Unit tests for utilities
   - Integration tests for forms
   - E2E tests for user flows

4. **Optimize Performance**:
   - Memoize expensive calculations
   - Virtualize large tables
   - Lazy load components

---

## Glossary

- **Schema**: Rules that define what data looks like and validation
- **Entity**: A single record (like one product)
- **Hook**: A React function that lets you use state and side effects
- **Query**: Fetching data from the server
- **Mutation**: Changing data on the server (create/update/delete)
- **Props**: Data passed from parent to child component
- **State**: Data that can change and cause re-renders
- **Payload**: The data you send to the API
- **Invalidate**: Tell React Query to refetch data because it's stale

---

## Need Help?

If you get stuck:

1. Check the browser console (F12) for error messages
2. Check the Network tab to see API requests/responses
3. Verify your schema matches your API
4. Make sure all imports are correct
5. Compare your code to the OtherMaster example
6. Ask a senior developer with specific error messages

Remember: Every developer copies code and modifies it. That's how we learn! 🚀
