---
name: vendure-understanding
description: Understand Vendure e-commerce framework by querying Context7 documentation first, then local source code when needed. Use when answering Vendure architecture, API, or implementation questions.
version: 1.0.0
---

# Understanding Vendure

## Purpose

Provides a systematic approach to understanding Vendure (headless commerce framework) by prioritizing official documentation via Context7, then falling back to local source code for deep investigation.

## When to Use This Skill

Use when:
- Answering questions about Vendure architecture, APIs, or patterns
- Implementing Vendure plugins, providers, or strategies
- Troubleshooting Vendure-specific issues
- Understanding how Vendure features work internally

**Do NOT use for:**
- Generic TypeScript/NestJS questions (Claude already knows these)
- Questions unrelated to Vendure
- Questions already answered by official docs you just read

## Workflow

### Step 1: Query Context7 Documentation

Always start with Context7 for fast, accurate, up-to-date information.

```
Use the mcp__context7__resolve-library-id tool with:
- libraryName: "vendure"
- query: <your question>

Then use mcp__context7__query-docs with the returned libraryId.
```

**Why:** Context7 has official Vendure docs including examples and best practices.

### Step 2: Evaluate Results

After Context7 query:
- ✅ **Sufficient answer found** → Use it, stop there
- ⚠️ **Partial answer** → Proceed to Step 3 for deeper dive
- ❌ **No relevant results** → Proceed to Step 3

### Step 3: Inspect Local Source Code

When Context7 doesn't provide enough detail, examine the local source code.

**Source locations:**
```
/Users/ah/Projects/github/vendure/packages/core/       # Core framework
/Users/ah/Projects/github/vendure/packages/dashboard/  # New dashboard
/Users/ah/Projects/github/vendure/packages/            # All packages
```

**For detailed source code navigation patterns and package structure:**
```
Read `~/.claude/skills/vendure-understanding/REFERENCE.md`
```

Use when: You need to navigate source code, understand package organization, or find specific implementation details.

## Examples

### Example 1: Understanding a Plugin Hook

**Question:** "How does the `OrderLineStrategy` work?"

**Step 1 - Context7:**
```
resolve-library-id: libraryName="vendure", query="OrderLineStrategy"
→ Returns libraryId: "/vendure/ecommerce/core"

query-docs: libraryId="/vendure/ecommerce/core", query="OrderLineStrategy interface and usage"
→ Returns: Interface definition, examples, when to implement
```

**Result:** Sufficient answer from docs. Stop.

### Example 2: Deep Implementation Dive

**Question:** "Why is my custom `ShippingCalculator` not being called?"

**Step 1 - Context7:**
```
resolve-library-id → query-docs for "ShippingCalculator"
→ Returns: Basic interface and simple example
```

**Step 2 - Evaluate:** Example doesn't show the registration/invocation flow.

**Step 3 - Source Code:**
```
Read: /Users/ah/Projects/github/vendure/packages/core/src/config/shipping/shipping-module.ts
Grep: "ShippingCalculator" in core/src/service/
→ Find: ShippingService which calls eligible calculators
```

**Result:** Found that calculator must be registered in `shippingOptions.calculators` config.

### Example 3: Understanding the New Dashboard

**Question:** "How do I add a custom table column to the Order list in the new dashboard?"

**Step 1 - Context7:**
```
query-docs: "dashboard custom table columns"
→ Returns: May be limited for new dashboard features
```

**Step 2 - Source Code:**
```
Read: /Users/ah/Projects/github/vendure/packages/dashboard/src/
Explore: extensions/, table/, data-fetching/
```

**Result:** Find the table extension pattern and implement.

## Key Vendure Concepts

**Always understand these before diving deep:**

| Concept              | Context7 Query Suggestion           |
| -------------------- | ----------------------------------- |
| Plugin Architecture  | "VendurePlugin decorator"           |
| Custom Fields        | "customFields definition"           |
| Strategies           | "Strategy pattern Vendure"          |
| Providers            | "Provider pattern Vendure"          |
| GraphQL API          | "ShopAPI vs AdminAPI"               |
| Entity Extension     | "extendType TypeORM"                |
| Job Queue            | "JobQueue job scheduling"           |
| Authentication       | "AuthenticationStrategy"            |

## Quick Reference

**Context7 library IDs to resolve first:**
- `vendure` or `vendure-io` → Main package
- `@vendure/core` → Core framework
- `@vendure/admin-ui` → Admin UI (React/ Angular)
- `@vendure/core` → Dashboard (new, React-based)

**Local source packages:**
```
packages/
├── core/              # Main framework (NestJS, TypeORM, GraphQL)
├── admin-ui/          # Legacy admin UI (Angular, being phased out)
├── admin-ui-core/     # Shared UI logic
├── dashboard/         # New admin UI (React, TanStack Query)
├── assets/            # Asset handling
├── auth/              # Authentication
├── catalog/           # Product/Catalog logic
├── checkout/          # Checkout flow
├── common/            # Shared utilities
├── core/              # Re-exports from @vendure/core
├── create/            | CLI scaffolding
├── email/             # Email templates
├── elasticsearch/     # Search integration
├── asset-server-plugin/ # Default asset server
├── asset-storage-plugin/ # S3/cloud storage
├── billing-plugin/    # Invoicing
├── cash-on-delivery-plugin/
├── stripe-plugin/
└── ... (more plugins)
```
