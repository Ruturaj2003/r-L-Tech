# Visual Guide: How Everything Connects

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTIONS                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ProductMasterPage.tsx                        │
│                    (Main Orchestrator)                           │
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐        │
│  │   Header    │  │    Table     │  │  Modal (Form)   │        │
│  └─────────────┘  └──────────────┘  └─────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
         │                   │                    │
         │                   │                    │
    [Add Click]         [Load Data]         [Submit Form]
         │                   │                    │
         ▼                   ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        REACT QUERY HOOKS                          │
│                                                                   │
│  useProductMastersQuery  │  useUpsertMutation  │  useDeleteMutation
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      productMasterApi.ts                         │
│                       (HTTP Requests)                            │
│                                                                   │
│   getList()  │  getById()  │  upsert()  │  delete()             │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                          BACKEND API                             │
│                       (Your Server)                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DATABASE                                │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Component Hierarchy

```
ProductMasterPage (Main Container)
│
├── ProductMasterHeader
│   ├── Search Input (global filter)
│   └── Add Button → Opens Modal
│
├── Modal (Conditional)
│   └── ProductMasterForm
│       ├── Form Fields (Product Code, Name, etc.)
│       ├── Submit Button
│       └── DeleteReasonDialog (if Delete mode)
│
└── ProductMasterTable
    └── DataTable
        ├── Column Headers
        ├── Data Rows
        └── Action Buttons (View, Edit, Delete)
```

## 📊 State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     LOCAL STATE (useState)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  isModalOpen ────────────► Controls modal visibility             │
│  formMode ───────────────► "Create"|"Edit"|"View"|"Delete"      │
│  selectedRow ────────────► Currently selected table row          │
│  globalFilter ───────────► Search/filter text                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  SERVER STATE (React Query)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Product List ───────────► Cached, auto-refetches                │
│  Dropdown Options ────────► Cached forever (staleTime: Infinity) │
│  Mutations ───────────────► Trigger cache invalidation           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔀 User Action → Code Flow

### Scenario 1: User Clicks "Add +"

```
1. User clicks "Add +" button
   ↓
2. ProductMasterHeader onClick fires
   ↓
3. setModalOpen() in ProductMasterPage
   ↓
4. State changes:
   - setSelectedRow(null)      // No row selected
   - setFormMode("Create")     // Create mode
   - setIsModalOpen(true)      // Show modal
   ↓
5. Modal opens with ProductMasterForm
   ↓
6. Form renders with empty default values
   ↓
7. User fills form and clicks "Save"
   ↓
8. handleFormSubmit() runs
   ↓
9. Creates payload with status: "Insert"
   ↓
10. useUpsertProductMasterMutation fires
   ↓
11. API call: POST /api/product-master/upsert
   ↓
12. On success:
    - Invalidates query cache
    - Table auto-refetches
    - Modal closes
    - Toast notification shows
```

### Scenario 2: User Clicks "Edit" on a Row

```
1. User clicks Edit button on row
   ↓
2. onEdit(row) callback fires
   ↓
3. State changes:
   - setSelectedRow(row)       // Store row data
   - setFormMode("Edit")       // Edit mode
   - setIsModalOpen(true)      // Show modal
   ↓
4. Modal opens with ProductMasterForm
   ↓
5. mapRowToFormDefaults(row) converts row → form values
   ↓
6. Form renders pre-filled with row data
   ↓
7. User modifies fields and clicks "Save"
   ↓
8. handleFormSubmit() runs
   ↓
9. Creates payload with:
   - status: "Update"
   - mTransNo: selectedRow.mTransNo
   - ...modified data
   ↓
10. useUpsertProductMasterMutation fires
   ↓
11. API call: POST /api/product-master/upsert
   ↓
12. On success:
    - Cache invalidated
    - Table refetches
    - Modal closes
    - Toast shows "Updated successfully"
```

### Scenario 3: User Clicks "Delete" on a Row

```
1. User clicks Delete button
   ↓
2. onDelete(row) callback fires
   ↓
3. State changes:
   - setSelectedRow(row)
   - setFormMode("Delete")
   - setIsModalOpen(true)
   ↓
4. Form renders in Delete mode (read-only)
   ↓
5. User clicks "Delete" button
   ↓
6. setOpenDeleteDialog(true)
   ↓
7. DeleteReasonDialog appears
   ↓
8. User selects reason and confirms
   ↓
9. handleFormSubmit() runs
   ↓
10. Creates delete payload with reason
   ↓
11. useDeleteProductMasterMutation fires
   ↓
12. API call: POST /api/product-master/delete
   ↓
13. On success:
    - Cache invalidated
    - Table refetches
    - Modal closes
    - Toast shows "Deleted successfully"
```

## 📋 Form Mode Behavior Matrix

| Mode   | Fields          | Save Button | Delete Button | Close Behavior          |
|--------|-----------------|-------------|---------------|-------------------------|
| Create | Editable        | ✅ "Save"   | ❌            | Warn if unsaved changes |
| Edit   | Editable        | ✅ "Save"   | ❌            | Warn if unsaved changes |
| View   | Read-only       | ❌          | ❌            | Close immediately       |
| Delete | Read-only       | ❌          | ✅ "Delete"   | Close immediately       |

## 🗂️ File Dependency Tree

```
ProductMasterPage.tsx
│
├── IMPORTS ───────────────────────────────────────────
│   ├── React, useState
│   ├── useProductMastersQuery          [hooks/]
│   ├── useUpsertMutation               [hooks/]
│   ├── useDeleteMutation               [hooks/]
│   ├── useCategoriesQuery              [hooks/]
│   ├── useDeleteReasonsQuery           [hooks/]
│   ├── ProductMasterHeader             [components/]
│   ├── ProductMasterTable              [components/]
│   ├── ProductMasterForm               [components/]
│   ├── createProductMasterColumns      [components/]
│   ├── mapRowToFormDefaults            [components/]
│   ├── Types from schemas              [schemas/]
│   └── Modal, toast, icons             [@/components]
│
└── USES ──────────────────────────────────────────────
    │
    ├── ProductMasterHeader.tsx
    │   └── Renders: Title, Search, Add button
    │
    ├── ProductMasterTable.tsx
    │   ├── USES: DataTable component
    │   └── Renders: Table with columns and data
    │
    ├── ProductMasterForm.tsx
    │   ├── USES: React Hook Form, Zod
    │   ├── USES: Form components (Input, Select, etc.)
    │   └── Renders: Form based on mode
    │
    └── ProductMaster.columns.tsx
        └── Defines: Column structure
```

## 🔑 Key Patterns to Remember

### Pattern 1: Query Invalidation
```typescript
// After ANY mutation (create/update/delete)
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: productMasterQueryKeys.list(),
  });
}

// This tells React Query: "Data is stale, refetch it"
```

### Pattern 2: Conditional Rendering
```typescript
{mode === "Delete" && (
  <DeleteReasonDialog ... />
)}

// Only show delete dialog in Delete mode
```

### Pattern 3: Form Default Values
```typescript
// Create mode
if (mode === "Create") {
  return { field1: "", field2: 0, ... };
}

// Edit/View/Delete mode
return {
  field1: row.field1,
  field2: row.field2,
  ...
};
```

### Pattern 4: Error Handling
```typescript
try {
  await mutation.mutateAsync(payload);
  toast.success("Success!");
} catch (error) {
  toast.error("Failed!", {
    description: error.message
  });
}
```

## 🎨 Styling Conventions

### Tailwind Classes Used
- `grid grid-cols-2 gap-x-2` → Two-column form layout
- `flex items-center justify-center gap-2` → Action button row
- `h-7 w-7 rounded-md` → Icon button sizing
- `bg-accent text-accent-foreground` → View button colors
- `text-destructive` → Delete button color
- `inline-flex rounded px-2 py-0.5 text-xs` → Status badge

### Component Class Pattern
```typescript
className={
  condition
    ? "class-if-true"
    : "class-if-false"
}
```

## 📱 Responsive Considerations

Current pattern is **desktop-first**. For mobile:

1. Change `grid-cols-2` to `grid-cols-1` on small screens:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
```

2. Stack action buttons vertically:
```typescript
<div className="flex flex-col md:flex-row gap-2">
```

3. Make table horizontally scrollable:
```typescript
<div className="overflow-x-auto">
  <DataTable ... />
</div>
```

## 🧪 Testing Checklist

### Unit Tests
- [ ] Schema validation works
- [ ] Mapper converts data correctly
- [ ] Column formatters display properly

### Integration Tests
- [ ] Form submission calls correct mutation
- [ ] Cache invalidation triggers refetch
- [ ] Error states display properly

### E2E Tests
- [ ] User can create a record
- [ ] User can edit a record
- [ ] User can delete a record
- [ ] Search/filter works
- [ ] Validation prevents bad data

## 🚀 Performance Optimization

### Current Optimizations
1. **Query Caching**: React Query caches API responses
2. **Stale Time**: Dropdown data cached forever
3. **Enabled Guards**: Queries only run when conditions met

### Future Optimizations
1. **Memoization**: Use `useMemo` for expensive calculations
2. **Virtualization**: For tables with 1000+ rows
3. **Debouncing**: For search input
4. **Lazy Loading**: For modal and form components

```typescript
// Example: Debounced search
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  setGlobalFilter(debouncedSearch);
}, [debouncedSearch]);
```

## 📖 Further Learning Resources

### React Concepts
- **State Management**: `useState`, `useEffect`
- **Props**: Passing data between components
- **Conditional Rendering**: `{condition && <Component />}`

### TypeScript
- **Types vs Interfaces**: When to use each
- **Generic Types**: `<T>` in hooks and functions
- **Type Inference**: Let TS figure out types

### React Query
- **Queries**: Fetching data
- **Mutations**: Changing data
- **Cache Invalidation**: When to refetch
- **Query Keys**: How caching works

### React Hook Form
- **register**: Connect input to form
- **control**: For complex inputs (dropdowns)
- **handleSubmit**: Form submission
- **formState**: Validation errors, dirty state

### Zod Validation
- **Schema Definition**: `.string()`, `.number()`, `.enum()`
- **Validation Rules**: `.min()`, `.max()`, `.regex()`
- **Custom Validation**: `.superRefine()`

---

**Remember**: You don't need to understand everything at once. Focus on:
1. Getting it working first
2. Understanding the pattern
3. Modifying for your needs
4. Optimizing later

Good luck! 🎉
