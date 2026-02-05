# Vendure Source Code Reference

Detailed guide for navigating and understanding the local Vendure source code.

## Source Code Locations

```
/Users/ah/Projects/github/vendure/packages/
├── core/              # Primary framework source
├── dashboard/         # New React-based admin UI
└── [other-packages]/  # Additional functionality
```

## Core Package Structure (`packages/core/`)

The core package contains the main Vendure framework built on NestJS.

### Key Directories

| Directory           | Purpose                              | When to Explore |
| ------------------- | ------------------------------------ | --------------- |
| `src/config/`       | Module configuration, bootstrap      | Understanding startup, config options |
| `src/service/`      | Core business services               | Finding how operations work internally |
| `src/entity/`       | TypeORM database entities            | Understanding data model |
| `src/api/`          | GraphQL schema, resolvers, controllers | API implementation details |
| `src/plugin/`       | Plugin system, @VendurePlugin decorator | Understanding plugin lifecycle |
| `src/worker/`       | Job queue worker logic               | Background job processing |
| `src/connection/`   | Transaction management               | Understanding data consistency |
| `src/event-bus/`    | Event system                         | Understanding event flow |
| `src/translator/`   | i18n translation                     | Localization issues |
| `src/migration/`    | Database migrations                  | Schema changes |
| `src/error/`        | Error types and handling             | Error debugging |

### Common Navigation Patterns

**Finding how a feature is registered:**
```bash
# 1. Find the module file
Grep: "FeatureModule" or "feature.module.ts" in packages/core/src/

# 2. Look for dynamic module registration
Grep: "forRoot", "registerProvider", "forFeature"

# 3. Check the config interface
Read: src/config/config.ts for related config option
```

**Understanding a GraphQL resolver:**
```bash
# 1. Find the resolver file
Grep: "Resolver extends" in packages/core/src/api/

# 2. Find the service it uses
# Resolvers delegate to services - look at constructor

# 3. Find the service implementation
Grep: "class.*Service" in packages/core/src/service/
```

**Understanding a strategy interface:**
```bash
# 1. Find the strategy interface
Grep: "extends.*Strategy" in packages/core/src/

# 2. Find where it's called
Grep: "interface.*Strategy" → then Grep for usage

# 3. Find default implementations
Grep: "Default.*Strategy" in packages/core/src/
```

## Dashboard Package Structure (`packages/dashboard/`)

The new React-based admin UI using TanStack Query.

### Key Directories

| Directory           | Purpose                              | When to Explore |
| ------------------- | ------------------------------------ | --------------- |
| `src/app/`          | App routes and layout                | Understanding navigation |
| `src/extension/`    | Extension points for customization   | Adding custom features |
| `src/tables/`       | Table components and data fetching   | Understanding list views |
| `src/data-fetching/` | GraphQL queries and mutations       | Understanding data flow |
| `src/components/`   | Shared UI components                 | Reusable UI patterns |
| `src/react-icons/`  | Icon library                         | Finding icons |

### Dashboard Extension Pattern

```bash
# Finding extension points:
1. Check src/extension/ for base extension types
2. Look for "Extension" suffix in file names
3. Check how extensions are registered in app initialization

# Common extensions:
- TableExtension: Add columns to data tables
- DetailExtension: Add tabs to detail views
- ActionExtension: Add custom actions
- RouteExtension: Add custom routes
```

## Package Inter-Dependencies

Understanding how packages relate:

```
┌─────────────────────────────────────────┐
│           @vendure/core                 │
│  (NestJS, TypeORM, GraphQL, Events)     │
└──────────────┬──────────────────────────┘
               │ provides
       ┌───────┴───────┬────────────┬────────────┐
       ▼               ▼            ▼            ▼
┌──────────┐   ┌──────────┐  ┌──────────┐  ┌──────────┐
│ catalog  │   │ checkout │  │   auth   │  │ assets   │
└──────────┘   └──────────┘  └──────────┘  └──────────┘
       │               │            │            │
       └───────────────┴────────────┴────────────┘
                       │ used by
                       ▼
              ┌────────────────┐
              │   Plugins      │
              │ (custom code)  │
              └────────────────┘
```

## Source Code Reading Tips

### 1. Follow the Dependency Injection

NestJS uses constructor injection. To understand data flow:
1. Start at the Resolver/Controller (entry point)
2. Check constructor for injected services
3. Follow service method calls
4. Check for injected repositories or other services

### 2. Use Grep Strategically

```bash
# Find interface definition
Grep: "interface.*Strategy" in packages/core/src/

# Find all implementations
Grep: "implements.*Strategy" in packages/core/src/

# Find where an interface is used
Grep: ": StrategyType" in packages/core/src/
```

### 3. Understand the Module System

Vendure uses dynamic modules for configuration:
- `forRoot()` - Global app configuration
- `forRootAsync()` - Async configuration (databases, external services)
- Provider registration via `providers` array in config

### 4. Event Bus Flow

For understanding async operations:
1. Find `this.eventBus.publish()` call
2. Get the event class name
3. Grep for event class to see what listeners exist
4. Check `@EventListener()` decorators

## Common Source Code Investigations

### "How is X calculated?"

1. Find the GraphQL resolver for X
2. Locate the service method called
3. Trace through the calculation logic
4. Check for any strategies/providers involved

### "Why is my plugin not working?"

1. Check `@VendurePlugin()` decorator configuration
2. Verify `@OnApplicationBootstrap()` if used
3. Check provider registration in `configure()` method
4. Look for config options that might affect behavior

### "How do I extend X?"

1. Find the extension point (Strategy, Provider, or custom field)
2. Look at existing implementations in `packages/core/`
3. Check if there's a plugin in `packages/*-plugin/` that does similar
4. Use Context7 to confirm the pattern

### "What database schema is used?"

1. Check `src/entity/` for entity definitions
2. Look at `@Entity()` decorators
3. Check `@Column()` definitions
4. For custom fields, check the `customFields` entity

## File Naming Conventions

Vendure follows consistent patterns:

| Pattern              | Meaning                          |
| -------------------- | -------------------------------- |
| `*.entity.ts`        | TypeORM database entity          |
| `*.service.ts`       | Business logic service           |
| `*.resolver.ts`      | GraphQL resolver                 |
| `*.controller.ts`    | REST controller                  |
| `*.module.ts`        | NestJS module definition         |
| `*.strategy.ts`      | Strategy interface               |
| `*.config.ts`        | Configuration types/options      |
| `*.types.ts`         | TypeScript type definitions      |
| `*.gql.ts`           | GraphQL schema definitions       |
| `*.transaction.ts`   | Transaction handling             |
