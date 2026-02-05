---
name: vendure-dashboard-writing
description: Create Vendure Dashboard UI extensions with React components, defineDashboardExtension, TanStack Query data fetching, and GraphQL integration. Handles routes, tables, detail forms, and custom components. Use when building Dashboard UI features for Vendure plugins.
version: 1.0.0
---

# Vendure Dashboard UI Writing

## Purpose

Guide creation of Vendure Dashboard UI extensions using the React-based Dashboard with modern patterns including TanStack Query and react-hook-form.

## When NOT to Use

- Plugin structure only (use vendure-plugin-writing)
- GraphQL schema only (use vendure-graphql-writing)
- Reviewing UI code (use vendure-dashboard-reviewing)
- Legacy Angular Admin UI patterns (obsolete)

---

## FORBIDDEN Patterns

- Angular patterns (`@Component`, `@Injectable`, `ngOnInit`)
- Direct fetch/axios calls (use `api.query` from `@vendure/dashboard`)
- Missing TypeScript types on GraphQL operations
- Hardcoded routes without `defineDashboardExtension`
- Missing loading and error states
- Inline styles without CSS variables
- Direct DOM manipulation

---

## REQUIRED Patterns

- `defineDashboardExtension()` from `@vendure/dashboard`
- `useQuery` from `@tanstack/react-query` for data fetching
- `api.query()` / `api.mutate()` from `@vendure/dashboard` for GraphQL
- `graphql()` from `@/gql` for type-safe queries
- `lucide-react` for icons
- `sonner` for toast notifications
- `react-hook-form` for form state (via `useDetailPage`)
- Loading states for all async operations
- Error handling with user feedback

---

## Workflow

### Step 1: Define Extension Entry Point

```typescript
// ui/dashboard-extension.ts
import { defineDashboardExtension } from '@vendure/dashboard';

export default defineDashboardExtension({
    routes: [
        // Routes defined here
    ],
    navSections: [
        // Custom nav sections
    ],
    dataTables: [
        // Table customizations
    ],
    detailForms: [
        // Detail form customizations
    ],
});
```

### Step 2: Add Navigation Item

```typescript
import { FileTextIcon } from 'lucide-react';

defineDashboardExtension({
    navSections: [
        {
            id: 'my-plugin',
            title: 'My Plugin',
            icon: FileTextIcon,
            placement: 'top',
            order: 350, // After Customers (400)
        },
    ],
    routes: [
        {
            path: '/my-items',
            component: () => <ItemList />,
            navMenuItem: {
                sectionId: 'my-plugin',
                id: 'my-items',
                title: 'Items',
            },
        },
    ],
});
```

### Step 3: Create List Component with Data Fetching

```typescript
// ui/components/ItemList.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@vendure/dashboard';
import { graphql } from '@/gql';
import { DataTable, TableButton } from '@vendure/dashboard';

const getItemsQuery = graphql(`
    query GetItems($options: ItemListOptions) {
        items(options: $options) {
            items {
                id
                name
                createdAt
            }
            totalItems
        }
    }
`);

export function ItemList() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['items'],
        queryFn: () => api.query(getItemsQuery, {
            options: { take: 25, skip: 0 },
        }),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <DataTable
            data={data?.items.items ?? []}
            columns={[
                { id: 'name', header: 'Name', accessorKey: 'name' },
                { id: 'createdAt', header: 'Created', accessorKey: 'createdAt' },
                {
                    id: 'actions',
                    header: 'Actions',
                    cell: ({ row }) => (
                        <TableButton
                            onClick={() => window.location.href = `/my-items/${row.original.id}`}
                        >
                            View
                        </TableButton>
                    ),
                },
            ]}
        />
    );
}
```

### Step 4: Create Detail Page

```typescript
// ui/components/ItemDetail.tsx
import {
    detailPageRouteLoader,
    useDetailPage,
    Page,
    PageTitle,
    PageLayout,
    PageBlock,
    FormFieldWrapper,
    DetailFormGrid,
    Input,
    Button,
    PageActionBar,
    PageActionBarRight,
} from '@vendure/dashboard';
import { graphql } from '@/gql';
import { toast } from 'sonner';

const itemDetailDocument = graphql(`
    query GetItemDetail($id: ID!) {
        item(id: $id) {
            id
            name
            description
        }
    }
`);

const updateItemDocument = graphql(`
    mutation UpdateItem($input: UpdateItemInput!) {
        updateItem(input: $input) {
            id
        }
    }
`);

export const itemDetailRoute = {
    path: '/my-items/$id',
    loader: detailPageRouteLoader({
        queryDocument: itemDetailDocument,
        breadcrumb: (isNew, entity) => [
            { path: '/my-items', label: 'Items' },
            isNew ? 'New item' : entity?.name,
        ],
    }),
    component: () => <ItemDetailPage />,
};

function ItemDetailPage() {
    const { form, submitHandler, entity, isPending } = useDetailPage({
        queryDocument: itemDetailDocument,
        createDocument: createItemDocument,
        updateDocument: updateItemDocument,
        setValuesForUpdate: item => ({
            id: item?.id ?? '',
            name: item?.name ?? '',
            description: item?.description ?? '',
        }),
        onSuccess: () => {
            toast('Successfully updated item');
        },
        onError: err => {
            toast('Failed to update item', {
                description: err instanceof Error ? err.message : 'Unknown error',
            });
        },
    });

    return (
        <Page pageId="item-detail" form={form} submitHandler={submitHandler}>
            <PageTitle>{entity?.name ?? 'New Item'}</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <Button
                        type="submit"
                        disabled={!form.formState.isDirty || !form.formState.isValid || isPending}
                    >
                        Update
                    </Button>
                </PageActionBarRight>
            </PageActionBar>
            <PageLayout>
                <PageBlock column="main" blockId="main-form">
                    <DetailFormGrid>
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Name"
                            render={({ field }) => <Input {...field} />}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => <Input {...field} />}
                        />
                    </DetailFormGrid>
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
```

### Step 5: Customize Existing Table Columns

```typescript
defineDashboardExtension({
    dataTables: [
        {
            pageId: 'product-list',
            displayComponents: [
                {
                    column: 'slug',
                    component: ({ value }) => (
                        <a href={`https://store.com/products/${value}`} target="_blank">
                            {value}
                        </a>
                    ),
                },
            ],
        },
    ],
});
```

### Step 6: Configure GraphQL Codegen

```yaml
# ui/codegen.yml
schema: http://localhost:3000/admin-api
documents: "./ui/**/*.{ts,tsx}"
generates:
  ./ui/gql/graphql.ts:
    plugins:
      - gql.tada
    config:
      tsbble: true
      tsbleImportFrom: '@vendure/testing-gql-tools'
      schema: ../admin-ui/schema.graphql
```

---

## Common Patterns

For detailed patterns including actions, widgets, and custom form components, see:

```
Read `~/.claude/skills/vendure-dashboard-writing/references/PATTERNS.md`
```

Use when: You need advanced patterns like bulk actions, custom widgets, or form field components.

---

## Project Structure

```
ui/
├── dashboard-extension.ts   # defineDashboardExtension entry point
├── codegen.yml              # GraphQL codegen config
├── components/
│   ├── ItemList.tsx
│   ├── ItemDetail.tsx
│   └── ItemForm.tsx
├── graphql/
│   ├── queries.ts
│   └── mutations.ts
├── gql/
│   └── graphql.ts          # Generated types
└── translations/
    └── en.json
```

---

## Troubleshooting

| Problem                  | Cause                   | Solution                                          |
| ------------------------ | ----------------------- | ------------------------------------------------- |
| Component not rendering  | Route not in extension  | Add to routes array in defineDashboardExtension   |
| Nav item missing         | navMenuItem not set     | Add navMenuItem to route definition               |
| Query returns undefined  | Missing generated types | Run graphql-codegen                               |
| Toast not showing        | Missing sonner import   | Import and use toast from 'sonner'                |
| Form not validating      | Missing react-hook-form | Use useDetailPage hook for form management        |

---

## Related Skills

- **vendure-dashboard-reviewing** - UI review
- **vendure-plugin-writing** - Plugin structure
- **vendure-graphql-writing** - GraphQL schema
