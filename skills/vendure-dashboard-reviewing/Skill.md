---
name: vendure-dashboard-reviewing
description: Review Vendure Dashboard UI extensions for React pattern violations, missing TanStack Query hooks, improper state management, and UI anti-patterns. Use when reviewing Dashboard UI PRs or auditing UI quality.
version: 1.0.0
---

# Vendure Dashboard UI Reviewing

## Purpose

Audit Vendure Dashboard UI extensions for violations and anti-patterns in the React-based Dashboard.

## Review Workflow

### Step 1: Identify UI Files

```bash
# Find Dashboard extension files
find . -path "*/ui/*.ts" -o -path "*/ui/*.tsx"

# Find component files
find . -name "*.tsx" -path "*/components/*"

# Find extension definition files
find . -name "*extension*.ts" -o -name "*extension*.tsx"
```

### Step 2: Run Automated Checks

```bash
# === CRITICAL VIOLATIONS ===

# Direct fetch/axios calls (should use api.query)
grep -rn "fetch(\|axios(" --include="*.tsx" --include="*.ts" | grep -v "node_modules"

# Angular patterns in React code
grep -rn "@Component\|@Injectable\|ngOnInit" --include="*.tsx"

# Missing TypeScript types on queries
grep -rn "useQuery({" --include="*.tsx" | grep -v "queryKey:"

# === HIGH PRIORITY ===

# Missing loading states
grep -rn "useQuery" --include="*.tsx" -A 10 | grep -v "isLoading\|loading"

# Missing error states
grep -rn "useQuery" --include="*.tsx" -A 10 | grep -v "error"

# Direct state mutation
grep -rn "\.push(\|\.splice(\|\.pop(" --include="*.tsx"

# === MEDIUM PRIORITY ===

# Inline styles (should use CSS variables)
grep -rn 'style={{' --include="*.tsx"

# Console statements
grep -rn "console.log\|console.error" --include="*.tsx" --include="*.ts"

# Missing useCallback on event handlers
grep -rn "onClick.*=.*async" --include="*.tsx" | grep -v "useCallback"
```

### Step 3: Manual Review Checklist

#### Extension Structure

- [ ] Uses `defineDashboardExtension()` from `@vendure/dashboard`
- [ ] Routes defined with proper paths and components
- [ ] Navigation items have `navMenuItem` with sectionId
- [ ] GraphQL codegen configured
- [ ] Translations file exists for UI strings

#### Components

- [ ] Uses `api.query()` / `api.mutate()` from `@vendure/dashboard`
- [ ] Uses `graphql()` from `@/gql` for type-safe queries
- [ ] Loading state handled (isLoading check)
- [ ] Error state handled (error display or toast)
- [ ] Uses `sonner` for toast notifications
- [ ] Icons from `lucide-react`

#### Forms

- [ ] Uses `useDetailPage` hook for detail pages
- [ ] Form fields use `FormFieldWrapper` component
- [ ] Submit button disabled when form is dirty/invalid
- [ ] Success/error toasts on mutations

#### Styling

- [ ] CSS variables for colors/spacing
- [ ] No hardcoded pixel values
- [ ] Uses shadcn/ui components from `@vendure/dashboard`

---

## Severity Classification

### CRITICAL (Must Fix)

- Direct fetch/axios calls bypassing `api.query()`
- Angular patterns in React code
- Missing error handling on mutations
- No loading states on queries

### HIGH (Should Fix)

- Missing TypeScript types on GraphQL operations
- Direct state mutation
- Inline styles instead of CSS variables
- Missing toast notifications

### MEDIUM (Should Fix)

- Missing useCallback/useMemo
- Console statements
- Hardcoded strings (no translations)
- Missing accessibility attributes

---

## Common Violations

### 1. Missing Loading State

**Violation:**

```typescript
export function ItemList() {
    const { data } = useQuery({
        queryKey: ['items'],
        queryFn: () => api.query(getItemsQuery),
    });

    return <DataTable data={data?.items ?? []} />;
}
```

**Fix:**

```typescript
export function ItemList() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['items'],
        queryFn: () => api.query(getItemsQuery),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <DataTable data={data?.items ?? []} />;
}
```

### 2. Direct Fetch Instead of api.query

**Violation:**

```typescript
const data = await fetch('/admin-api', {
    body: JSON.stringify({ query: GET_ITEMS }),
});
```

**Fix:**

```typescript
import { api } from '@vendure/dashboard';

const data = await api.query(getItemsQuery, {
    options: { take: 25 },
});
```

### 3. Missing TypeScript Types

**Violation:**

```typescript
const { data } = useQuery({
    queryKey: ['items'],
    queryFn: () => api.query(getItemsQuery),
});
// data is implicitly 'any'
```

**Fix:**

```typescript
const { data } = useQuery<GetItemsQuery>({
    queryKey: ['items'],
    queryFn: () => api.query(getItemsQuery),
});
```

### 4. Direct State Mutation

**Violation:**

```typescript
const [items, setItems] = useState<Item[]>([]);

const addItem = (item: Item) => {
    items.push(item); // WRONG
    setItems(items);
};
```

**Fix:**

```typescript
const addItem = useCallback((item: Item) => {
    setItems(prev => [...prev, item]); // CORRECT
}, []);
```

### 5. Missing Error Toast on Mutation

**Violation:**

```typescript
const handleDelete = async (id: string) => {
    await api.mutate(deleteItemDocument, { id });
    refresh();
};
```

**Fix:**

```typescript
import { toast } from 'sonner';

const handleDelete = async (id: string) => {
    try {
        await api.mutate(deleteItemDocument, { id });
        toast('Item deleted');
        await refresh();
    } catch (err) {
        toast('Failed to delete', {
            description: err instanceof Error ? err.message : 'Unknown error',
        });
    }
};
```

### 6. Not Using useDetailPage for Forms

**Violation:**

```typescript
export function ItemDetail() {
    const [form, setForm] = useState({ name: '' });

    const handleSubmit = async () => {
        await api.mutate(updateDocument, form);
    };

    return <form onSubmit={handleSubmit}>...</form>;
}
```

**Fix:**

```typescript
import { useDetailPage } from '@vendure/dashboard';

export function ItemDetail() {
    const { form, submitHandler, entity } = useDetailPage({
        queryDocument: itemDetailDocument,
        createDocument: createItemDocument,
        updateDocument: updateItemDocument,
        setValuesForUpdate: item => ({ name: item?.name ?? '' }),
        onSuccess: () => toast('Updated successfully'),
    });

    return (
        <Page form={form} submitHandler={submitHandler}>
            {/* form fields */}
        </Page>
    );
}
```

---

## Quick Detection Commands

```bash
# All-in-one Dashboard UI audit
echo "=== CRITICAL: Direct fetch/axios ===" && \
grep -rn "fetch(\|axios(" --include="*.tsx" | grep -v "node_modules" | head -10 && \
echo "" && \
echo "=== HIGH: Missing loading states ===" && \
grep -rn "useQuery" --include="*.tsx" -A 5 | grep -B 5 -L "isLoading" | head -10 && \
echo "" && \
echo "=== MEDIUM: Console statements ===" && \
grep -rn "console\." --include="*.tsx" | head -10
```

---

## Review Output Template

```markdown
## Dashboard UI Review: [Component/Feature Name]

### Summary

[Overview of UI quality]

### Critical Issues (Must Fix)

- [ ] [Issue] - `file:line`

### High Priority

- [ ] [Issue] - `file:line`

### Passed Checks

- [x] Uses defineDashboardExtension
- [x] Uses api.query/api.mutate
- [x] Loading states handled
- [x] Error states handled
- [x] Toast notifications used

### Recommendations

- [Suggestions]
```

---

## Extension Structure Checklist

```markdown
## Extension Structure Review

### Required Files

- [ ] ui/dashboard-extension.ts - defineDashboardExtension
- [ ] ui/codegen.yml - GraphQL codegen config
- [ ] ui/gql/graphql.ts - Generated types

### Extension Definition

- [ ] routes array with path, component, navMenuItem
- [ ] navSections array for custom sections
- [ ] Uses lucide-react for icons
- [ ] Uses sonner for toasts

### Component Organization

- [ ] components/ - React components
- [ ] graphql/ - Query/mutation definitions
- [ ] translations/ - i18n files
```

---

## Cross-Reference

All rules match patterns in **vendure-dashboard-writing** skill.

---

## Related Skills

- **vendure-dashboard-writing** - UI patterns
- **vendure-plugin-reviewing** - Plugin-level review
- **vendure-graphql-reviewing** - GraphQL review
