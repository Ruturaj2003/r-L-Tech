Got it — this is a **note to self / TODO**, not completed work. Here’s a clear, simple rewrite:

---

### TODO

- Add **Date** type support to the form
- Remove extra validation errors from controlled inputs

---

### ⚠️ Pending Issues (Medium Priority)

1. **Page Component Is Too Smart**
   - Handles queries
   - Manages modal state
   - Runs mutations
   - Handles data mapping

   **To do:** extract logic into a controller hook
   `useOtherMasterPageController()`

2. **Missing Error Boundaries**
   - Errors fail silently
   - Mutation failures are not surfaced

   **To do:** add mutation error handling and toast notifications

3. **No Permission Model**
   - UI assumes access
   - No guardrails

   **To do:** add permission / policy hooks

4. **Partial Schema Usage**
   - Form schema exists
   - API response schema is unclear

   **To do:** add Zod parsing for query responses

---

If you want it even shorter (checklist-style), I can tighten it more.
