# Dashboard UI Patterns

Detailed patterns for Vendure Dashboard UI extensions.

## Bulk Actions

Add custom bulk actions to list pages:

```typescript
import { BulkAction, useMutation } from '@vendure/dashboard';
import { graphql } from '@/gql';
import { toast } from 'sonner';

const bulkDeleteDocument = graphql(`
    mutation BulkDeleteItems($ids: [ID!]!) {
        bulkDeleteItems(ids: $ids) {
            success
        }
    }
`);

defineDashboardExtension({
    dataTables: [
        {
            pageId: 'item-list',
            bulkActions: [
                {
                    label: 'Delete',
                    icon: TrashIcon,
                    onClick: async ({ selectedRowIds, refresh }) => {
                        const { api } = await import('@vendure/dashboard');
                        await api.mutate(bulkDeleteDocument, { ids: selectedRowIds });
                        toast('Deleted successfully');
                        await refresh();
                    },
                },
            ],
        },
    ],
});
```

## Custom Form Components

Create custom form field components:

```typescript
import { DashboardFormComponent } from '@vendure/dashboard';

export const ColorPickerComponent: DashboardFormComponent = ({
    value,
    onChange,
    name,
}) => {
    const { getFieldState } = useFormContext();
    const error = getFieldState(name).error;

    return (
        <div>
            <input
                type="color"
                value={value || '#000000'}
                onChange={e => onChange(e.target.value)}
            />
            {error && <span className="text-red-500">{error.message}</span>}
        </div>
    );
};

// Register in extension
defineDashboardExtension({
    customFormComponents: {
        customFields: [
            { id: 'color-picker', component: ColorPickerComponent },
        ],
    },
});
```

## Widgets

Add dashboard widgets:

```typescript
defineDashboardExtension({
    widgets: [
        {
            id: 'my-widget',
            title: 'My Widget',
            position: 'after-sales-widget',
            column: 'start',
            width: 'half',
            component: () => {
                const { data } = useQuery({
                    queryKey: ['widget-data'],
                    queryFn: () => api.query(getWidgetDataQuery),
                });
                return <div>{data?.widgetData.value}</div>;
            },
        },
    ],
});
```

## ActionBar Items

Add custom action bar buttons:

```typescript
defineDashboardExtension({
    actionBarItems: [
        {
            id: 'my-action',
            label: 'My Action',
            location: 'product-detail',
            button: {
                label: 'Do Something',
                icon: MyIcon,
                onClick: () => {
                    toast('Action executed');
                },
            },
        },
    ],
});
```

## Page Blocks

Add custom blocks to pages:

```typescript
defineDashboardExtension({
    pageBlocks: [
        {
            pageId: 'product-detail',
            blockId: 'my-custom-block',
            column: 'main',
            position: 'after-description',
            component: () => {
                const { entityId } = usePageContext();
                return <div>Custom block for {entityId}</div>;
            },
        },
    ],
});
```

## History Entries

Add custom history entry types:

```typescript
defineDashboardExtension({
    historyEntries: [
        {
            type: 'ITEM_CUSTOM_STATE',
            name: 'Item state changed',
            component: ({ entry }) => (
                <div>
                    Changed from {entry.data.from} to {entry.data.to}
                </div>
            ),
        },
    ],
});
```

## Alerts

Add dashboard alerts:

```typescript
defineDashboardExtension({
    alerts: [
        {
            id: 'my-alert',
            title: 'Important Notice',
            message: 'This is a custom alert message',
            type: 'warning',
            dismissalKey: 'my-alert-dismissed',
        },
    ],
});
```

## Detail Form Customization

Add fields to existing detail forms:

```typescript
defineDashboardExtension({
    detailForms: [
        {
            pageId: 'product-detail',
            formFields: [
                {
                    name: 'customField',
                    label: 'Custom Field',
                    component: ({ value, onChange }) => (
                        <Input value={value} onChange={e => onChange(e.target.value)} />
                    ),
                },
            ],
        },
    ],
});
```

## Mutation with Optimistic Updates

```typescript
import { useQueryClient } from '@tanstack/react-query';

function ItemList() {
    const queryClient = useQueryClient();

    const handleDelete = async (id: string) => {
        // Optimistic update
        queryClient.setQueryData(['items'], old => ({
            ...old,
            items: {
                ...old.items,
                items: old.items.items.filter(item => item.id !== id),
            },
        }));

        try {
            await api.mutate(deleteItemDocument, { id });
            toast('Deleted successfully');
        } catch {
            // Rollback on error
            queryClient.invalidateQueries({ queryKey: ['items'] });
            toast('Failed to delete');
        }
    };
}
```

## Pagination

```typescript
function ItemList() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    const { data } = useQuery({
        queryKey: ['items', currentPage],
        queryFn: () => api.query(getItemsQuery, {
            options: {
                take: itemsPerPage,
                skip: (currentPage - 1) * itemsPerPage,
            },
        }),
    });

    const totalPages = Math.ceil((data?.items.totalItems ?? 0) / itemsPerPage);

    return (
        <>
            <DataTable data={data?.items.items ?? []} columns={columns} />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </>
    );
}
```

## Filter/Search

```typescript
function ItemList() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data } = useQuery({
        queryKey: ['items', searchTerm],
        queryFn: () => api.query(getItemsQuery, {
            options: {
                filter: {
                    name: { contains: searchTerm },
                },
            },
        }),
    });

    return (
        <>
            <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search items..."
            />
            <DataTable data={data?.items.items ?? []} columns={columns} />
        </>
    );
}
```

## Translations

```typescript
defineDashboardExtension({
    routes: [
        {
            path: '/my-items',
            component: () => <ItemList />,
            navMenuItem: {
                id: 'my-items',
                title: 'my-plugin.nav.items', // Translation key
            },
        },
    ],
});
```

```json
// ui/translations/en.json
{
    "my-plugin": {
        "nav": {
            "items": "Items"
        }
    }
}
```
