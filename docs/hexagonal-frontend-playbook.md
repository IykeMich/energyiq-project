# Hexagonal Frontend Playbook

A reusable reference for building React/TypeScript frontends with hexagonal architecture. This is how Morphlix builds frontends.

---

## Table of Contents

1. [What Is Hexagonal Architecture](#what-is-hexagonal-architecture)
2. [Why Use It on the Frontend](#why-use-it-on-the-frontend)
3. [The Three Layers](#the-three-layers)
4. [Folder Structure Template](#folder-structure-template)
5. [The Dependency Rule](#the-dependency-rule)
6. [Domain Layer Guidelines](#domain-layer-guidelines)
7. [Adapter Layer Guidelines](#adapter-layer-guidelines)
8. [UI Layer Guidelines](#ui-layer-guidelines)
9. [Composition Root](#composition-root)
10. [Code Generation with Orval](#code-generation-with-orval)
11. [How to Add a New Feature](#how-to-add-a-new-feature)
12. [Testing Strategy](#testing-strategy)
13. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
14. [When Hexagonal Is Overkill](#when-hexagonal-is-overkill)

---

## What Is Hexagonal Architecture

Hexagonal architecture (ports and adapters) places business logic at the center of the application and pushes all external concerns -- APIs, storage, UI frameworks -- to the edges. The domain defines **ports** (interfaces describing what it needs), and **adapters** provide concrete implementations of those ports.

```
                    +---------------------+
                    |      UI Layer       |
                    |  React, hooks, JSX  |
                    +----------+----------+
                               |
                               | calls
                               v
                    +---------------------+
                    |    Domain Layer      |
                    |  types, ports,       |
                    |  use-cases           |
                    +----------+----------+
                               ^
                               | implements
                               |
                    +---------------------+
                    |   Adapter Layer      |
                    |  HTTP, localStorage, |
                    |  generated code,     |
                    |  IndexedDB, etc.     |
                    +---------------------+
```

The domain sits at the center and depends on nothing external. Adapters and UI both depend on the domain -- never the other way around.

---

## Why Use It on the Frontend

Hexagonal architecture solves six concrete problems that every growing frontend runs into.

**The golden rule:**

```
UI  --->  Domain  --->  Ports  <---  Adapters
```

Nothing goes backwards. Every decision in this architecture flows from this single rule.

### "I changed the API and 47 files broke"

Only the adapter file changes. The adapter maps the external response shape to internal domain types. Domain logic and UI components never see the raw API response, so they do not break when the backend renames a field or restructures a payload.

### "I can't test this without the whole app running"

The domain is pure TypeScript. Test it with plain functions and mock objects. No browser needed. No React rendering. No HTTP mocking. These tests run in milliseconds and catch real bugs.

### "New dev can't figure out where anything is"

Every module follows the same structure: `types.ts`, `ports.ts`, `use-cases.ts`, `index.ts`. Learn one module, know all 25. A new developer can be productive on day one because there is nothing to discover -- just the same pattern repeated.

### "We need to swap localStorage for secure cookies"

Change one adapter file. Update one line in the composition root. The domain does not know. The UI does not know. The swap is done. This is the entire point of ports and adapters.

### "Forms are a mess -- validation here, API there, state somewhere else"

Our form decomposition enforces a strict hierarchy: Page (~10 lines) calls Form (~30 lines) calls Fields (~20 lines each) with Validation (~5 lines per schema). Each file does exactly one thing. You can review, test, or replace any layer independently.

### "Backend changed the response format"

All responses go through one fetcher (`adapter/api/fetcher.ts`) that handles envelope unwrapping, error mapping, and token management. When the backend changes the response format, it is a one-file fix. Not a codebase-wide grep.

---

## The Three Layers

### Domain -- The Core

Contains the business model, the rules, and the contracts. It is the innermost ring and depends on nothing.

- **Types** -- entities, value objects, request/response shapes
- **Ports** -- outbound interfaces (what the domain needs from the world)
- **Use cases** -- classes that orchestrate business operations via ports

### Adapter -- The Infrastructure

Implements ports with real technology. Each adapter satisfies one or more port interfaces.

- **API adapters** -- HTTP calls to backends (manual via ky, or generated via Orval)
- **Custom fetcher** -- native `fetch`-based fetcher for Orval-generated hooks, handling auth tokens, 401 refresh, envelope unwrapping, and error mapping
- **Generated code** -- Orval output (TanStack Query hooks + TypeScript schemas) generated from OpenAPI specs
- **Storage adapters** -- localStorage, sessionStorage, IndexedDB, cookies
- **Notification adapters** -- toast services, push notifications
- **Analytics adapters** -- event tracking services

### UI -- The Shell

React components, hooks, pages, and layouts. Consumes domain use cases through the composition root. Handles rendering, routing, and user interaction.

The UI layer is structured with thin pages, extracted forms, business fields built on primitives, and co-located validation:

- **Primitives** -- shadcn/ui components in `ui/primitives/`, managed by the shadcn CLI (`components.json` aliases point to `@/ui/primitives`). Low-level building blocks (Button, Input, Label, etc.) that are never used directly in forms
- **Fields** -- business field components in `ui/fields/` built on top of primitives (InputField, PasswordField, CurrencyField, SearchableSelect, OtpField, SelectField, TextareaField). Each field handles its own label, error display, and accessibility attributes
- **Pages** -- thin shells (~12 lines) with a heading, a form import, and navigation links
- **Forms** -- form composition components that import fields and connect to validation schemas
- **Validation** -- Zod schemas co-located by module, one per form
- **Components** -- shared UI elements organized by concern (common, feedback)

---

## Folder Structure Template

Copy this into any new project and populate it module by module.

```
src/
├── domain/                          # Pure TypeScript, zero React
│   ├── shared/
│   │   ├── types.ts                 # API envelope, pagination, shared value objects
│   │   └── errors.ts               # Base error classes (DomainError, ValidationError, etc.)
│   └── <module>/                    # One folder per business domain module
│       ├── types.ts                 # Module entities and DTOs
│       ├── ports.ts                 # Outbound interfaces
│       ├── use-cases.ts             # Orchestration logic
│       └── index.ts                 # Barrel export
│
├── adapter/                         # Implements domain ports
│   ├── api/
│   │   ├── client.ts                # Manual HTTP client (ky — typed, handles auth, errors)
│   │   ├── fetcher.ts               # Custom fetcher for Orval (native fetch)
│   │   ├── <module>.ts              # Manual API adapter per module (complex flows)
│   │   └── generated/               # Orval output (DO NOT EDIT)
│   │       ├── <module>/<module>.ts # Generated TanStack hooks per tag
│   │       └── schemas/             # Generated TypeScript types
│   └── storage/
│       └── <name>.ts                # Storage adapters (token, user, preferences, etc.)
│
├── ui/                              # React — inbound adapter
│   ├── store/
│   │   ├── index.ts                 # configureStore, typed hooks (useAppDispatch, useAppSelector)
│   │   └── slices/
│   │       └── <module>.ts          # Redux Toolkit slice per domain module
│   ├── hooks/
│   │   └── use-<module>.ts          # Bridge hooks wrapping Redux dispatch/selectors
│   ├── pages/                       # THIN — heading + form + links only
│   │   └── <module>/
│   │       └── <page>.tsx           # ~12 lines: heading, form import, links
│   ├── forms/                       # Form composition
│   │   └── <module>/
│   │       └── <form>.tsx           # Imports fields + validation, handles submission
│   ├── primitives/                   # shadcn/ui primitives (managed by shadcn CLI)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── ...                      # All shadcn components land here
│   ├── fields/                      # Business fields built on primitives
│   │   ├── input-field.tsx
│   │   ├── password-field.tsx
│   │   ├── currency-field.tsx
│   │   ├── searchable-select.tsx
│   │   ├── otp-field.tsx
│   │   ├── select-field.tsx
│   │   ├── textarea-field.tsx
│   │   └── index.ts                 # Barrel export
│   ├── validation/                  # Zod schemas, one per form
│   │   └── <module>/
│   │       └── <form>.ts            # Zod schema + inferred type
│   ├── components/
│   │   ├── common/                  # Shared UI (SubmitButton, etc.)
│   │   └── feedback/                # Error display, toasts, alerts
│   └── layouts/
│       └── <layout>.tsx             # Page shells (auth layout, dashboard layout)
│
├── router/
│   ├── routes.tsx                    # Route definitions
│   └── guards.tsx                   # Auth guards, role guards
│
├── config/
│   ├── env.ts                        # Environment variables
│   └── container.ts                  # Composition root (wires adapters to domain)
│
├── lib/
│   └── <utility>.ts                 # Pure utility functions (cn, formatDate, etc.)
│
└── main.tsx                         # Entry point, Provider wiring
```

---

## The Dependency Rule

This is the single most important rule. Memorize it.

```
UI  --->  Domain  --->  Ports  <---  Adapters
                  ^
                  |
            config/container.ts (wires adapters into domain)
```

In plain terms:

| Layer      | Can import from             | CANNOT import from |
|------------|-----------------------------|--------------------|
| Domain     | Nothing outside `domain/`   | Adapter, UI, config |
| Adapter    | Domain (ports, types)       | UI                 |
| UI         | Domain (types), config/container | Adapter directly |
| Config     | Domain, Adapter             | UI                 |

The UI never touches adapters. It gets pre-wired use-case instances from the composition root. The domain never reaches outward. Adapters reach inward to the domain (to implement its interfaces) but never sideways to the UI.

If you find yourself importing an adapter into a React component, stop. You are violating the architecture.

---

## Domain Layer Guidelines

### types.ts -- Entities and Value Objects

Define the shapes of your business data. Use TypeScript interfaces, not classes. Keep them flat and serializable.

```typescript
// domain/billing/types.ts

export interface Invoice {
  id: string;
  customer_id: string;
  line_items: LineItem[];
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issued_at: string;
  due_at: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface CreateInvoiceRequest {
  customer_id: string;
  line_items: LineItem[];
  due_at: string;
}
```

Rules:
- No framework imports. Ever.
- No `Date` objects -- use ISO strings for serialization safety.
- Prefer interfaces over type aliases for object shapes (easier to extend).
- Colocate request/response types with their entities.

### ports.ts -- Outbound Interfaces

Define what the domain needs from the outside world. Each port is an interface that one or more adapters will implement.

```typescript
// domain/billing/ports.ts

import type { Invoice, CreateInvoiceRequest } from './types';

export interface BillingApi {
  listInvoices(customerId?: string): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice>;
  createInvoice(req: CreateInvoiceRequest): Promise<Invoice>;
  markAsPaid(id: string): Promise<Invoice>;
}

export interface InvoicePdfPort {
  generate(invoice: Invoice): Promise<Blob>;
}
```

Rules:
- Ports are always interfaces, never concrete classes.
- Name them after what they do, not how they do it. `BillingApi`, not `BillingHttpClient`.
- Return domain types, not framework-specific types.
- Keep ports focused. One port per external concern.

### use-cases.ts -- Orchestration

Use-case classes receive ports via constructor injection and coordinate business operations.

```typescript
// domain/billing/use-cases.ts

import type { BillingApi } from './ports';
import type { Invoice, CreateInvoiceRequest } from './types';

export class BillingUseCases {
  constructor(private api: BillingApi) {}

  async listInvoices(customerId?: string): Promise<Invoice[]> {
    return this.api.listInvoices(customerId);
  }

  async createInvoice(req: CreateInvoiceRequest): Promise<Invoice> {
    // Business rule: at least one line item
    if (req.line_items.length === 0) {
      throw new Error('Invoice must have at least one line item');
    }
    return this.api.createInvoice(req);
  }

  async markAsPaid(id: string): Promise<Invoice> {
    return this.api.markAsPaid(id);
  }
}
```

Rules:
- Constructor injection only. No service locator, no global singletons inside use cases.
- Business validation belongs here, not in the UI and not in adapters.
- Return plain domain types.
- No `async/await` gymnastics -- just pass through to ports and add orchestration where needed.

### The Zero Framework Imports Rule

The domain folder must have **zero imports** from:
- React (`react`, `react-dom`)
- State management libraries (`redux`, `@reduxjs/toolkit`, `zustand`, `jotai`)
- HTTP clients (`ky`, `axios`, `fetch`)
- Browser APIs (`localStorage`, `sessionStorage`, `window`, `document`)
- CSS/styling (`tailwind`, `clsx`, `styled-components`)

If your domain file has any of these imports, the code belongs in a different layer.

---

## Adapter Layer Guidelines

### API Adapter Pattern

There are two approaches to building API adapters, and most projects will use both.

**Approach 1: Manual adapters with ky.** Create a typed HTTP client that handles the common concerns (auth headers, error mapping, base URL). Then create one adapter class per domain module that implements the corresponding API port.

**Approach 2: Generated hooks with Orval.** For standard CRUD endpoints, generate TanStack Query hooks and TypeScript schemas from the backend's OpenAPI spec. See [Code Generation with Orval](#code-generation-with-orval).

Use manual adapters for complex orchestration flows. Use Orval for straightforward CRUD.

**Shared HTTP client (manual calls):**

```typescript
// adapter/api/client.ts

import ky from 'ky';

type TokenGetter = () => string | null;
type TokenRefresher = () => Promise<boolean>;

let getToken: TokenGetter = () => null;
let refreshToken: TokenRefresher = async () => false;

export function configureClient(getter: TokenGetter, refresher: TokenRefresher) {
  getToken = getter;
  refreshToken = refresher;
}

const client = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL,
  timeout: 30_000,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = getToken();
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async ({ request, response }) => {
        if (response.status === 401) {
          const ok = await refreshToken();
          if (ok) {
            const token = getToken();
            if (token) request.headers.set('Authorization', `Bearer ${token}`);
            return ky(request);
          }
        }
      },
    ],
  },
});

export async function apiGet<T>(path: string): Promise<T> {
  const res = await client.get(path).json<{ data: T }>();
  return res.data;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await client.post(path, { json: body }).json<{ data: T }>();
  return res.data;
}
```

**Custom fetcher (Orval-generated hooks):**

The custom fetcher at `adapter/api/fetcher.ts` uses native `fetch` (not ky) and handles the same cross-cutting concerns: auth token injection, automatic 401 refresh, response envelope unwrapping, and domain error mapping. Orval is configured to use this fetcher for all generated hooks.

**Module adapter (manual):**

```typescript
// adapter/api/billing.ts

import type { BillingApi } from '@/domain/billing/ports';
import type { Invoice, CreateInvoiceRequest } from '@/domain/billing/types';
import { apiGet, apiPost } from './client';

export class BillingApiAdapter implements BillingApi {
  async listInvoices(customerId?: string): Promise<Invoice[]> {
    const query = customerId ? `?customer_id=${customerId}` : '';
    return apiGet<Invoice[]>(`v1/billing/invoices${query}`);
  }

  async getInvoice(id: string): Promise<Invoice> {
    return apiGet<Invoice>(`v1/billing/invoices/${id}`);
  }

  async createInvoice(req: CreateInvoiceRequest): Promise<Invoice> {
    return apiPost<Invoice>('v1/billing/invoices', req);
  }

  async markAsPaid(id: string): Promise<Invoice> {
    return apiPost<Invoice>(`v1/billing/invoices/${id}/pay`);
  }
}
```

### Storage Adapter Pattern

Storage adapters implement domain ports using browser storage APIs.

```typescript
// adapter/storage/token.ts

import type { TokenStorage } from '@/domain/auth/ports';

export class LocalTokenStorage implements TokenStorage {
  getAccessToken(): string | null {
    return localStorage.getItem('app_access_token');
  }
  getRefreshToken(): string | null {
    return localStorage.getItem('app_refresh_token');
  }
  setTokens(access: string, refresh: string): void {
    localStorage.setItem('app_access_token', access);
    localStorage.setItem('app_refresh_token', refresh);
  }
  clearTokens(): void {
    localStorage.removeItem('app_access_token');
    localStorage.removeItem('app_refresh_token');
  }
}
```

### Swapping Adapters

This is the entire point of ports and adapters. Want to replace localStorage with secure HTTP-only cookies? Write a new adapter:

```typescript
// adapter/storage/cookie-token.ts

import type { TokenStorage } from '@/domain/auth/ports';

export class CookieTokenStorage implements TokenStorage {
  // Tokens are set by the server via Set-Cookie headers.
  // The client just reads them or signals the server to clear them.

  getAccessToken(): string | null {
    return getCookie('access_token');
  }
  getRefreshToken(): string | null {
    return getCookie('refresh_token');
  }
  setTokens(): void {
    // No-op: server sets cookies via response headers
  }
  clearTokens(): void {
    document.cookie = 'access_token=; Max-Age=0; path=/';
    document.cookie = 'refresh_token=; Max-Age=0; path=/';
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
```

Then change one line in the composition root:

```typescript
// Before
const tokenStorage = new LocalTokenStorage();

// After
const tokenStorage = new CookieTokenStorage();
```

Nothing else changes. The domain does not know. The UI does not know. That is the power of the architecture.

---

## UI Layer Guidelines

### State Management -- Redux Toolkit + TanStack Query

Redux Toolkit is the Morphlix company standard for client state management. All projects use it for consistency across teams -- team familiarity and code review patterns outweigh any simplicity advantage from lighter alternatives.

Use Redux Toolkit and TanStack Query together, but for different concerns:

| Concern | Tool | Why |
|---------|------|-----|
| Client-only state (auth, UI state, form wizards) | Redux Toolkit | Company standard. Slices, thunks, typed dispatch/selectors |
| Server state (lists, details, paginated data) | TanStack Query | Automatic caching, refetching, stale-while-revalidate |

We do not use RTK Query. The team has experienced cache and network visibility issues with it. TanStack Query handles server state. Redux handles client state. No overlap.

### Redux Store Structure

The store lives in `ui/store/index.ts` with typed hooks:

```typescript
// ui/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/auth';
import uiReducer from './slices/ui';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

Each domain module gets its own slice in `ui/store/slices/`. Slices contain the state shape, reducers, and async thunks.

### Hooks as the Bridge

Bridge hooks wrap Redux dispatch and selectors so that React components never import the store directly. Each domain module gets one bridge hook.

```typescript
// ui/hooks/use-billing.ts

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/ui/store';
import { fetchInvoices, markInvoiceAsPaid } from '@/ui/store/slices/billing';

export function useBilling() {
  const dispatch = useAppDispatch();
  const invoices = useAppSelector((state) => state.billing.invoices);
  const isLoading = useAppSelector((state) => state.billing.isLoading);
  const error = useAppSelector((state) => state.billing.error);

  return {
    invoices,
    isLoading,
    error,
    fetchInvoices: useCallback(() => dispatch(fetchInvoices()), [dispatch]),
    markAsPaid: useCallback(
      (id: string) => dispatch(markInvoiceAsPaid(id)),
      [dispatch],
    ),
  };
}
```

Rules:
- One bridge hook per domain module.
- The hook imports from `ui/store/` (typed hooks and thunks) and from `domain/` (types only).
- The hook never imports adapters.
- Keep hooks thin. They dispatch thunks and select state. Business logic stays in the domain.
- Components use the bridge hook -- never `useAppDispatch` or `useAppSelector` directly for domain state.

For server-state-heavy modules, you might skip the Redux slice entirely and use TanStack Query hooks directly, with the use-case instance as the query function:

```typescript
import { useQuery } from '@tanstack/react-query';
import { billingUseCases } from '@/config/container';

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => billingUseCases.listInvoices(),
  });
}
```

### Thin Pages, Extracted Forms

Pages are thin shells. They contain a heading, a form import, and navigation links -- roughly 12 lines. All form logic, field composition, and validation live elsewhere:

- **`ui/forms/<module>/`** -- Form components that compose field components and connect to validation schemas via React Hook Form + Zod
- **`ui/fields/`** -- Business field components built on `ui/primitives/` (InputField, PasswordField, CurrencyField, SearchableSelect, OtpField, SelectField, TextareaField). Each field handles its own label, error display, and accessibility attributes
- **`ui/validation/<module>/`** -- Zod schemas, one per form. Each file exports the schema and an inferred TypeScript type
- **`ui/components/common/`** -- Shared components like SubmitButton
- **`ui/components/feedback/`** -- Error display components like FormError

```tsx
// Example thin page
import { CreateInvoiceForm } from '@/ui/forms/billing/create-invoice-form';
import { Link } from 'react-router-dom';

export function CreateInvoicePage() {
  return (
    <div>
      <h1>Create Invoice</h1>
      <CreateInvoiceForm />
      <Link to="/billing">Back to invoices</Link>
    </div>
  );
}
```

### Layouts

Organize layouts as page shells that provide structure (sidebar, top nav, content area). Use `<Outlet />` for nested routing.

---

## Composition Root

The composition root is a single file (`config/container.ts`) that instantiates all adapters and injects them into domain use cases. It is the only file in the entire codebase that knows about concrete adapter classes.

```typescript
// config/container.ts

import { AuthUseCases } from '@/domain/auth/use-cases';
import { BillingUseCases } from '@/domain/billing/use-cases';

import { AuthApiAdapter } from '@/adapter/api/auth';
import { BillingApiAdapter } from '@/adapter/api/billing';
import { LocalTokenStorage } from '@/adapter/storage/token';
import { LocalUserStorage } from '@/adapter/storage/user';
import { configureClient } from '@/adapter/api/client';

// -- Adapters --
const tokenStorage = new LocalTokenStorage();
const userStorage  = new LocalUserStorage();
const authApi      = new AuthApiAdapter();
const billingApi   = new BillingApiAdapter();

// -- Use Cases --
export const authUseCases    = new AuthUseCases(authApi, tokenStorage, userStorage);
export const billingUseCases = new BillingUseCases(billingApi);

// -- HTTP Client Wiring --
configureClient(
  () => tokenStorage.getAccessToken(),
  () => authUseCases.refresh(),
);
```

Every new module adds two lines here: instantiate the adapter, instantiate the use case. That is it.

---

## Code Generation with Orval

Orval is the recommended tool for generating type-safe API client code from OpenAPI specifications. It eliminates manual DTO definitions and keeps frontend types in sync with the backend.

### How It Works

1. The backend generates an OpenAPI spec (e.g., via swaggo for Go backends, or any OpenAPI-compatible tool)
2. The frontend runs a generate command (e.g., `npm run generate`) which invokes Orval
3. Orval reads the spec and generates TanStack Query hooks and TypeScript schemas into `adapter/api/generated/`
4. Generated output is split by tag -- one file per module
5. Generated schemas go to `adapter/api/generated/schemas/`

### Configuration

Orval configuration lives at `orval.config.ts` in the project root. The config specifies the spec location, output directory, and custom fetcher.

The custom fetcher at `adapter/api/fetcher.ts` uses native `fetch` and handles:
- Auth token injection
- Automatic token refresh on 401
- Response envelope unwrapping
- Domain error mapping

### When to Use Generated vs Manual

| Path | When to use | Example |
|------|-------------|---------|
| Orval generated hooks | Standard CRUD. Annotate backend, generate, use the hook. | Listing products, fetching details |
| Manual domain use-cases | Complex multi-step flows needing orchestration | Auth: initiate -> verify OTP -> complete -> redirect |

For standard CRUD, always prefer Orval. For orchestration, write manual use-cases.

---

## How to Add a New Feature

This is the standard workflow. Follow it every time.

### 1. Backend -- add Swagger annotations

Add the handler with OpenAPI/Swagger annotations on the backend. Regenerate the spec (e.g., `make swagger` for Go backends).

### 2. Generate API code

Run the generate command (e.g., `npm run generate`). Orval reads the updated spec and generates TanStack Query hooks and TypeScript schemas. For standard CRUD endpoints, you now have working hooks -- skip to step 5.

### 3. Define the domain (if complex logic needed)

For modules with business logic beyond fetch-and-display, create `src/domain/<module>/types.ts`, `ports.ts`, `use-cases.ts`, and `index.ts`. Define your entities and the interfaces you need. Write zero framework code.

### 4. Build the manual adapter (if complex flows needed)

Create `src/adapter/api/<module>.ts`. Implement the API port using the shared ky HTTP client. If you need storage, create `src/adapter/storage/<name>.ts`. Wire the adapter and use-case in `src/config/container.ts`.

### 5. Add Redux slice (if complex client state needed)

Create `src/ui/store/slices/<module>.ts` with a Redux Toolkit slice and async thunks. Register the reducer in `ui/store/index.ts`. Create a bridge hook in `ui/hooks/use-<module>.ts` that wraps dispatch and selectors.

### 6. Add validation schema

Create `src/ui/validation/<module>/<form>.ts` with a Zod schema and inferred type export.

### 7. Build form and page

Create the form component in `src/ui/forms/<module>/` using field components from `ui/fields/` and the validation schema. Create a thin page in `src/ui/pages/<module>/` that imports the form -- heading, form, links, nothing more.

### 8. Add route

Add the route to `src/router/routes.tsx`.

### 9. Verify dependencies

Run through the checklist:

- [ ] `domain/<module>/` has zero imports from `adapter/`, `ui/`, `config/`, or any framework
- [ ] `adapter/api/<module>.ts` imports only from `domain/` and `adapter/api/client.ts`
- [ ] `ui/store/slices/<module>.ts` imports from `config/container` and `domain/` (types only)
- [ ] `ui/hooks/use-<module>.ts` uses `useAppDispatch` and `useAppSelector` from `ui/store/`
- [ ] Pages import from `ui/hooks/` and `ui/forms/` only -- no direct store or adapter access
- [ ] The composition root is the only file that imports adapter classes

---

## Testing Strategy

The hexagonal architecture makes testing straightforward because each layer has a clear boundary. This is how Morphlix tests every frontend project.

### Test File Location

Test files are colocated with their source files. Always.

- `use-cases.ts` -> `use-cases.test.ts` (same folder)
- `auth.ts` -> `auth.test.ts` (same folder)
- `currency-field.tsx` -> `currency-field.test.tsx` (same folder)

There is no `__tests__/` directory. If you add a file with logic, you add its test file right next to it.

### Test Utilities (`src/test/`)

This folder holds helpers, not test files:

- `setup.ts` -- MSW server lifecycle, DOM cleanup
- `render.tsx` -- `renderWithProviders()` wraps Redux + TanStack Query + Router
- `factories/auth.ts` -- `buildUser()`, `buildLoginResult()`, etc.
- `mocks/server.ts` -- MSW server instance
- `mocks/handlers/auth.ts` -- API mock handlers with error overrides
- `index.ts` -- barrel export (`import { renderWithProviders, buildUser, server } from '@/test'`)

### E2E Tests

- Live at `e2e/` at project root (not in `src/`)
- Playwright: Chrome, Firefox, mobile (Pixel 5)
- Auto-starts dev server via `playwright.config.ts`

### How to Test Each Layer

**1. Domain tests** -- pure TypeScript, mock ports, no React:

```ts
const mockApi = { login: vi.fn() };
const useCases = new AuthUseCases(mockApi, mockTokens, mockUser);
vi.mocked(mockApi.login).mockResolvedValue(buildLoginResult());
await useCases.login({ email: 'test@test.com', password: 'pass' });
expect(mockTokens.setTokens).toHaveBeenCalled();
```

This is the fastest, most valuable test layer. No browser, no rendering, no HTTP. Invest here first.

**2. Redux store tests** -- mock the container, test reducers + thunks:

```ts
vi.mock('@/config/container', () => ({
  authUseCases: { login: vi.fn() }
}));

await store.dispatch(login({ email: 'test@test.com', password: 'pass' }));
expect(store.getState().auth.isAuthenticated).toBe(true);
```

**3. Component tests** -- always use `renderWithProviders`:

```ts
import { renderWithProviders } from '@/test';

const { user } = renderWithProviders(<LoginForm />);
await user.type(screen.getByLabelText('Email'), 'test@test.com');
await user.click(screen.getByRole('button', { name: 'Sign In' }));
```

**4. Adapter tests** -- MSW intercepts at network level:

```ts
import { server } from '@/test';
import { authErrorHandlers } from '@/test/mocks/handlers/auth';

server.use(authErrorHandlers.emailTaken);
// API now returns 409 for duplicate email
```

**5. E2E tests** -- Playwright, real browser:

```ts
await page.goto('/register');
await page.getByLabel('Company Name').fill('Acme Corp');
await page.getByRole('button', { name: 'Create Account' }).click();
```

### Test Factories

Always use factories instead of manually constructing objects.

- `buildUser()` -- returns a default user with sensible defaults. Override what you need: `buildUser({ role: 'finance' })`
- `buildStaffUser()` -- returns a staff user with a non-owner role
- `buildLoginResult()` -- returns a complete login response with tokens
- `buildCompleteResult()` -- returns a registration completion response

Factories live in `src/test/factories/` and are re-exported from `@/test`.

### Coverage Thresholds (enforced in CI)

| Layer | Minimum |
|-------|---------|
| Domain (`src/domain/**`) | 90% |
| Adapters (`src/adapter/**`) | 80% |
| Store (`src/ui/store/**`) | 80% |
| Fields (`src/ui/fields/**`) | 70% |

Excluded from coverage: shadcn primitives (`ui/primitives/`), Orval generated code (`adapter/api/generated/`), `main.tsx`.

### Commands

```bash
npm test              # unit tests (run once)
npm run test:watch    # watch mode
npm run test:coverage # unit tests + coverage report
npm run test:e2e      # Playwright (Chrome, Firefox, mobile)
npm run test:e2e:ui   # Playwright interactive mode
```

### The Rule

Every file that has logic gets a test file next to it. Pages are thin shells -- they do not need tests. Forms, fields, store slices, use-cases, and adapters do.

---

## Anti-Patterns to Avoid

### 1. Importing adapters in UI components

```typescript
// BAD -- UI directly uses an adapter
import { LocalTokenStorage } from '@/adapter/storage/token';
const storage = new LocalTokenStorage();
```

Always go through the composition root and use-case layer.

### 2. Business logic in Redux slices or React hooks

```typescript
// BAD -- discount calculation lives in a Redux slice
const cartSlice = createSlice({
  name: 'cart',
  reducers: {
    applyDiscount: (state, action) => {
      const discount = action.payload === 'SAVE20' ? 0.2 : 0;
      state.total = state.items.reduce((sum, i) => sum + i.price * (1 - discount), 0);
    },
  },
});
```

Move this to a use case. The slice should just store the result of `cartUseCases.applyDiscount(items, code)`.

### 3. Framework types in the domain

```typescript
// BAD -- React state setter in domain types
import type { Dispatch, SetStateAction } from 'react';

export interface CartPort {
  setItems: Dispatch<SetStateAction<Item[]>>;  // React leaked into domain
}
```

Domain ports use plain TypeScript types only.

### 4. God use-case class

```typescript
// BAD -- one class for the entire app
export class AppUseCases {
  login() { ... }
  listProducts() { ... }
  createInvoice() { ... }
  sendNotification() { ... }
}
```

One use-case class per business domain module. Keep them focused.

### 5. Skipping the composition root

```typescript
// BAD -- adapter instantiated inside use case
export class BillingUseCases {
  private api = new BillingApiAdapter(); // Hard-coded dependency
}
```

Always inject dependencies through the constructor. The composition root does the wiring.

### 6. Circular dependencies between modules

```typescript
// BAD -- billing domain imports from inventory domain
import type { Product } from '@/domain/inventory/types';
```

If two modules need to share types, extract them to `domain/shared/types.ts`. Cross-module coordination belongs in a dedicated orchestrator or in the UI layer.

### 7. Fat pages with inline form logic

```typescript
// BAD -- page contains form fields, validation, and submission logic
export function CreateInvoicePage() {
  const { register, handleSubmit, formState } = useForm({ ... });
  const onSubmit = async (data) => { ... };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('customer')} />
      {formState.errors.customer && <span>...</span>}
      {/* 80 more lines of form fields */}
    </form>
  );
}
```

Pages should be thin shells. Extract the form into `ui/forms/<module>/`, the fields into `ui/fields/`, and the validation into `ui/validation/<module>/`.

### 8. Components importing the Redux store directly

```typescript
// BAD -- component uses useAppSelector directly
import { useAppSelector } from '@/ui/store';

export function InvoiceCount() {
  const count = useAppSelector((state) => state.billing.invoices.length);
  return <span>{count}</span>;
}
```

Use the bridge hook instead: `const { invoices } = useBilling()`. This keeps the store shape as an implementation detail behind the hook.

---

## When Hexagonal Is Overkill

This architecture adds structure. Structure has a cost. Do not use it when:

**Simple CRUD apps.** If the app is a thin wrapper around a REST API with minimal business logic (admin panels, content editors), hexagonal adds ceremony without benefit. Use TanStack Query directly in your components.

**Prototypes and throwaway code.** If you are validating an idea and the code has a 2-week lifespan, skip the layers. Inline everything.

**Single-developer side projects.** The architecture pays off when multiple developers need to work in parallel without stepping on each other. A solo developer can keep the mental model in their head.

**Trivial features.** Not every feature needs all three layers. A static "About" page does not need a domain module. Use judgment.

### The Rule of Thumb

If your module has business logic beyond "fetch data and display it," use hexagonal. If it is just fetch-and-display, use TanStack Query directly (with Orval-generated hooks) and skip the domain layer for that module. You can always promote a simple module to hexagonal later when complexity grows.

---

## Quick Reference Card

```
ADDING A FEATURE
================
1. Backend: add Swagger annotations, regenerate spec
2. npm run generate                  -- Orval generates hooks + types
3. domain/<module>/types.ts          -- Define entities (if complex)
4. domain/<module>/ports.ts          -- Define interfaces (if complex)
5. domain/<module>/use-cases.ts      -- Write orchestration (if complex)
6. adapter/api/<module>.ts           -- Implement API port (if manual)
7. config/container.ts               -- Wire adapter to use case
8. ui/store/slices/<module>.ts       -- Redux slice + thunks (if client state needed)
9. ui/hooks/use-<module>.ts          -- Bridge hook (wraps Redux)
10. ui/validation/<module>/<form>.ts -- Zod schema
11. ui/forms/<module>/<form>.tsx     -- Form component (fields + validation)
12. ui/pages/<module>/<page>.tsx     -- Thin page (~12 lines)
13. router/routes.tsx                -- Add the route

DEPENDENCY RULE
===============
UI --> Domain --> Ports <-- Adapters
         ^
         |
   container.ts

STATE MANAGEMENT
================
Client state:  Redux Toolkit (company standard)
Server state:  TanStack Query (+ Orval generated hooks)
No RTK Query:  Explicit decision

TESTING
=======
Domain:   Unit test with mock ports (fast, 90% coverage)
Store:    Slice/thunk test with mock container (80% coverage)
Adapter:  Integration test with MSW (80% coverage)
Fields:   Component test with renderWithProviders (70% coverage)
E2E:      Playwright (Chrome, Firefox, Pixel 5)
Files:    Colocated -- use-cases.test.ts next to use-cases.ts
Helpers:  src/test/ (renderWithProviders, factories, MSW)
Run:      npm test | npm run test:e2e
```

---

This playbook is opinionated by design. It reflects patterns that have proven reliable across multiple projects. Follow it until you have a good reason not to -- and when you deviate, document why.
