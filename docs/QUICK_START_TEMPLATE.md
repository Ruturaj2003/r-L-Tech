# Quick Start Template: Fill in the Blanks

## 🎯 Before You Start

**Answer these questions:**

1. What are you building? (e.g., "Product Master", "Customer List", "Order Management")
   → Your Answer: `________________`

2. What fields does your record have?
   → Example: Product Code, Product Name, Category, Price
   → Your Fields:
   ```
   - ________________ (type: text/number/date/dropdown)
   - ________________ (type: text/number/date/dropdown)
   - ________________ (type: text/number/date/dropdown)
   - ________________ (type: text/number/date/dropdown)
   ```

3. What is your API endpoint?
   → Example: `/api/product-master`
   → Your Endpoint: `________________`

4. Do you have any dropdowns? What are they?
   → Example: Category dropdown
   → Your Dropdowns:
   ```
   - ________________
   - ________________
   ```

---

## 📋 Step-by-Step Checklist

### ✅ Phase 1: Setup (10 minutes)

- [ ] **Step 1.1**: Create folder structure
  ```bash
  mkdir -p src/features/inventory/[YOUR_FEATURE_NAME]/{components,hooks,schemas,services,types}
  ```
  Replace `[YOUR_FEATURE_NAME]` with: `________________`

- [ ] **Step 1.2**: Navigate to your feature folder
  ```bash
  cd src/features/inventory/[YOUR_FEATURE_NAME]
  ```

---

### ✅ Phase 2: Define Data (15 minutes)

- [ ] **Step 2.1**: Create `schemas/[yourFeature].schema.ts`
  - Copy template from manual
  - Fill in YOUR_FIELDS (from question 2 above)
  - Keep `mTransNo` and `status`

- [ ] **Step 2.2**: Create `schemas/[yourFeature]Form.schema.ts`
  - Copy template from manual
  - Fill in YOUR_FIELDS with validation rules
  - Add dropdown option schemas

**Quick validation rules reference:**
```typescript
// Text field
z.string().min(1, "Required").max(50, "Max 50 chars")

// Number field
z.number().min(0, "Must be positive")

// Email
z.string().email("Invalid email")

// Optional field
z.string().optional()

// Dropdown
z.enum(["Option1", "Option2"])
```

---

### ✅ Phase 3: Connect to API (15 minutes)

- [ ] **Step 3.1**: Create `services/[yourFeature]Api.ts`
  - Copy template from manual
  - Change `API_BASE_URL` to YOUR endpoint
  - Verify method names match your backend

- [ ] **Step 3.2**: Test API manually first!
  - Use Postman or curl
  - Verify endpoints work
  - Check response structure

**Quick API test:**
```bash
# Test GET list
curl http://your-api.com/api/your-feature/list?subscID=1

# Test GET by ID
curl http://your-api.com/api/your-feature/123
```

---

### ✅ Phase 4: Create Hooks (10 minutes)

- [ ] **Step 4.1**: Create `hooks/queryKeys.ts`
  - Copy template
  - Find & Replace: `otherMaster` → `yourFeature`

- [ ] **Step 4.2**: Create `hooks/useYourFeaturesQuery.ts` (list)
  - Copy template
  - Replace all names

- [ ] **Step 4.3**: Create `hooks/useYourFeatureQuery.ts` (single)
  - Copy template
  - Replace all names

- [ ] **Step 4.4**: Create `hooks/useYourFeatureMutations.ts`
  - Copy template
  - Replace all names

- [ ] **Step 4.5**: Create `hooks/useYourFeatureDropdown.ts`
  - Copy template
  - Add one function per dropdown
  - Replace all names

**Pro tip**: Use VS Code Find & Replace (Ctrl+H) to replace all at once!

---

### ✅ Phase 5: Build Table (20 minutes)

- [ ] **Step 5.1**: Create `components/YourFeature.columns.tsx`
  - Copy template
  - Define columns for YOUR_FIELDS
  - Keep `sl` and `actions` columns

**Column template for common field types:**

```typescript
// Text column (simple)
{
  accessorKey: "fieldName",
  header: "Display Name",
  enableSorting: true,
  enableColumnFilter: true,
}

// Number column (formatted)
{
  accessorKey: "price",
  header: "Price",
  cell: ({ getValue }) => {
    const value = getValue<number>();
    return `$${value.toFixed(2)}`;
  },
}

// Date column (formatted)
{
  accessorKey: "createdDate",
  header: "Created",
  cell: ({ getValue }) => {
    const value = getValue<string>();
    return new Date(value).toLocaleDateString();
  },
}

// Status badge
{
  accessorKey: "status",
  header: "Status",
  cell: ({ getValue }) => {
    const value = getValue<"Y" | "N">();
    return (
      <span className={
        value === "Y"
          ? "bg-success text-success-foreground px-2 py-0.5 rounded text-xs"
          : "bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs"
      }>
        {value === "Y" ? "Active" : "Inactive"}
      </span>
    );
  },
}
```

- [ ] **Step 5.2**: Test columns compile (no errors)

---

### ✅ Phase 6: Build Form (30 minutes)

- [ ] **Step 6.1**: Create `components/YourFeatureForm.tsx`
  - Copy full template from manual
  - Replace all "ProductMaster" references

- [ ] **Step 6.2**: Replace form fields section
  - Delete example fields
  - Add YOUR_FIELDS using appropriate components

**Form field component reference:**

```typescript
// Text Input
<FormField label="Field Name" name="fieldName" required error={errors.fieldName?.message}>
  <ControlledInput
    name="fieldName"
    register={register}
    disabled={mode === "View" || mode === "Delete"}
    placeholder="Enter value"
  />
</FormField>

// Number Input
<ControlledInput
  name="price"
  register={register}
  type="number"
  step="0.01"
  disabled={mode === "View" || mode === "Delete"}
  placeholder="0.00"
/>

// Simple Dropdown
<ControlledSelect
  name="status"
  control={control}
  options={[
    { label: "Active", value: "Y" },
    { label: "Inactive", value: "N" },
  ]}
  disabled={mode === "View" || mode === "Delete"}
/>

// Searchable Dropdown (from API)
<ControlledCombobox
  name="category"
  control={control}
  placeholder="Select category"
  disabled={mode === "View" || mode === "Delete"}
  options={categoryOptions?.map((c) => ({
    label: c.categoryName,
    value: c.categoryId,
  })) ?? []}
/>

// Date Picker (if available)
<ControlledDatePicker
  name="date"
  control={control}
  disabled={mode === "View" || mode === "Delete"}
/>
```

**Layout tips:**
```typescript
// Two columns
<div className="grid grid-cols-2 gap-x-2">
  <FormField>...</FormField>
  <FormField>...</FormField>
</div>

// Three columns
<div className="grid grid-cols-3 gap-x-2">
  <FormField>...</FormField>
  <FormField>...</FormField>
  <FormField>...</FormField>
</div>

// Full width
<FormField>...</FormField>
```

- [ ] **Step 6.3**: Create `components/YourFeatureForm.mapper.ts`
  - Copy template
  - Set default values for YOUR_FIELDS
  - Map row fields correctly

---

### ✅ Phase 7: Build Supporting Components (10 minutes)

- [ ] **Step 7.1**: Create `components/YourFeatureHeader.tsx`
  - Copy template
  - Change title

- [ ] **Step 7.2**: Create `components/YourFeatureTable.tsx`
  - Copy template
  - Change types

---

### ✅ Phase 8: Build Main Page (20 minutes)

- [ ] **Step 8.1**: Create `components/YourFeaturePage.tsx`
  - Copy full template from manual
  - Replace ALL "ProductMaster" references
  - Update import paths

**Critical replacements:**
```typescript
// 1. Imports - change all paths
import { useProductMastersQuery } from "../hooks/useProductMastersQuery";
// becomes
import { useYourFeaturesQuery } from "../hooks/useYourFeaturesQuery";

// 2. Hook calls
const { data = [], ... } = useProductMastersQuery(subscID);
// becomes
const { data = [], ... } = useYourFeaturesQuery(subscID);

// 3. Component names
<ProductMasterHeader ... />
// becomes
<YourFeatureHeader ... />

// 4. Toast messages
toast.success("Product created successfully");
// becomes
toast.success("YourFeature created successfully");
```

- [ ] **Step 8.2**: Update `handleFormSubmit` payload
  - Match YOUR_FIELDS structure
  - Keep standard fields (mTransNo, createdBy, etc.)

---

### ✅ Phase 9: Add Route (5 minutes)

- [ ] **Step 9.1**: Open your router file (App.tsx or routes.tsx)

- [ ] **Step 9.2**: Add import:
  ```typescript
  import YourFeaturePage from "@/features/inventory/yourFeature/components/YourFeaturePage";
  ```

- [ ] **Step 9.3**: Add route:
  ```typescript
  {
    path: "/your-feature",
    element: <YourFeaturePage />,
  }
  ```

- [ ] **Step 9.4**: Add to navigation menu (if you have one)

---

### ✅ Phase 10: Testing (30 minutes)

**Test in this order:**

- [ ] **Test 10.1**: Page loads
  ```
  Navigate to /your-feature
  ✓ No console errors
  ✓ No TypeScript errors
  ```

- [ ] **Test 10.2**: Table displays
  ```
  ✓ Table shows data
  ✓ Columns appear correctly
  ✓ Search works
  ```

- [ ] **Test 10.3**: Create flow
  ```
  1. Click "Add +"
  2. Fill form
  3. Click "Save"
  ✓ Modal closes
  ✓ Table refreshes
  ✓ New record appears
  ✓ Toast notification shows
  ```

- [ ] **Test 10.4**: View flow
  ```
  1. Click "View" on any row
  ✓ Modal opens
  ✓ Form shows data
  ✓ All fields read-only
  ✓ No save button
  ```

- [ ] **Test 10.5**: Edit flow
  ```
  1. Click "Edit" on any row
  2. Change some fields
  3. Click "Save"
  ✓ Changes saved
  ✓ Table refreshes
  ✓ Changes visible
  ```

- [ ] **Test 10.6**: Delete flow
  ```
  1. Click "Delete" on any row
  2. Select delete reason
  3. Confirm
  ✓ Record removed
  ✓ Table refreshes
  ```

- [ ] **Test 10.7**: Validation
  ```
  1. Try to save empty form
  ✓ Error messages appear
  ✓ Form doesn't submit
  ```

- [ ] **Test 10.8**: Error handling
  ```
  1. Disconnect internet
  2. Try to create record
  ✓ Error toast appears
  ✓ Form stays open
  ```

---

## 🐛 Troubleshooting Guide

### Problem: "Cannot find module"
**Cause**: Import path wrong
**Fix**: 
1. Check file exists at import path
2. Verify file extension (.ts vs .tsx)
3. Use auto-import (Ctrl+Space in VS Code)

### Problem: TypeScript error "Type 'X' is not assignable to type 'Y'"
**Cause**: Data shape mismatch
**Fix**:
1. Check schema definition
2. Verify API response matches schema
3. Check form field names match schema

### Problem: API call fails with 404
**Cause**: Wrong endpoint or method
**Fix**:
1. Check API_BASE_URL in api.ts
2. Verify backend is running
3. Check network tab in browser DevTools
4. Test endpoint in Postman

### Problem: Table shows no data
**Cause**: Query not running or API returns empty
**Fix**:
1. Check React Query DevTools
2. Verify `enabled` condition is true
3. Check subscID is valid
4. Check API response in Network tab

### Problem: Form doesn't submit
**Cause**: Validation failing
**Fix**:
1. Check browser console
2. Look for red error messages in form
3. Check schema validation rules
4. Use `onInvalid` console.log

### Problem: Modal doesn't open
**Cause**: State not updating
**Fix**:
1. Check `isModalOpen` state
2. Verify `setModalOpen()` is called
3. Check `<Modal open={isModalOpen}>`

### Problem: Data doesn't refresh after save
**Cause**: Cache not invalidated
**Fix**:
1. Check `onSuccess` in mutation
2. Verify `invalidateQueries` is called
3. Check query key matches exactly

---

## 📝 Final Checklist

Before deploying:

- [ ] All TypeScript errors resolved
- [ ] All console errors resolved
- [ ] All API calls work
- [ ] All CRUD operations tested
- [ ] Form validation working
- [ ] Error handling in place
- [ ] Loading states display
- [ ] Success/error toasts show
- [ ] Code formatted consistently
- [ ] No console.logs left in code
- [ ] Comments added where needed
- [ ] Git commit with clear message

---

## 🎉 Success Criteria

You're done when:

1. ✅ Page loads without errors
2. ✅ Can create new records
3. ✅ Can edit existing records
4. ✅ Can delete records
5. ✅ Can view record details
6. ✅ Search/filter works
7. ✅ Validation prevents bad data
8. ✅ Error messages are helpful
9. ✅ Loading states show
10. ✅ Code follows the pattern

---

## 💡 Pro Tips

1. **Use Find & Replace**: Fastest way to rename everything
   - Find: `ProductMaster`
   - Replace: `YourFeature`
   - Match case: ON
   - Replace All

2. **Copy one file at a time**: Don't try to do everything at once

3. **Test after each file**: Catch errors early

4. **Use TypeScript autocomplete**: Press Ctrl+Space to see suggestions

5. **Check the example**: When stuck, compare to OtherMaster files

6. **Git commit often**: So you can undo mistakes

7. **Use React DevTools**: See component state and props

8. **Use Network tab**: Debug API calls

9. **Read error messages**: They usually tell you exactly what's wrong

10. **Ask for help**: Share specific error messages, not just "it doesn't work"

---

## 📚 Quick Reference Card

### Common Commands
```bash
# Create folders
mkdir -p path/to/folder

# Create file
touch filename.tsx

# Find & replace in files
# Use VS Code: Ctrl+Shift+H

# Start dev server
npm run dev

# TypeScript check
npm run type-check
```

### Common Imports
```typescript
// React
import { useState, useEffect } from "react";

// React Hook Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod
import { z } from "zod";

// React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Axios
import axios from "axios";
```

### Common Patterns
```typescript
// State
const [value, setValue] = useState(initialValue);

// Effect
useEffect(() => {
  // Run on mount or when dependencies change
}, [dependencies]);

// Query
const { data, isLoading, error } = useQuery({
  queryKey: ["key"],
  queryFn: fetchFunction,
});

// Mutation
const mutation = useMutation({
  mutationFn: saveFunction,
  onSuccess: () => { /* refetch */ },
});

// Conditional render
{condition && <Component />}
{condition ? <A /> : <B />}

// Map array to elements
{items.map((item) => <Item key={item.id} {...item} />)}
```

---

**Remember**: This is a pattern, not a rigid rule. Adapt it to your needs!

Good luck! 🚀
