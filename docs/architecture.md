# EnergyIQ Web -- Architecture Guide

This document describes the architecture of the EnergyIQ frontend application. Read it before writing your first line of code.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Why This Architecture](#why-this-architecture)
3. [The Three Layers](#the-three-layers)
4. [Folder Structure](#folder-structure)
5. [Dependency Rules](#dependency-rules)
6. [Tech Stack](#tech-stack)
7. [Code Generation with Orval](#code-generation-with-orval)
8. [Composition Root](#composition-root)
9. [API Response Format](#api-response-format)
10. [Auth Model](#auth-model)
11. [Auth Flow](#auth-flow)
12. [Auth Guards](#auth-guards)
13. [Route Conventions](#route-conventions)
14. [How to Add a New Module](#how-to-add-a-new-module)
15. [Testing](#testing)

---

## Architecture Overview

EnergyIQ Web uses **hexagonal architecture** (also called ports-and-adapters). The core idea: business logic lives at the center and has zero knowledge of frameworks, HTTP clients, or browser APIs. Everything external connects through interfaces (ports) that are satisfied by concrete implementations (adapters).

```
+------------------------------------------------------+
|                      UI Layer                        |
|  React components, hooks, pages, layouts, routing    |
+---------------------------+--------------------------+
                            |
                            | imports
                            v
+------------------------------------------------------+
|                   Domain Layer                       |
|  types, ports (interfaces), use-cases (orchestration)|
|  Pure TypeScript -- no React, no ky, no localStorage |
+---------------------------+--------------------------+
                            ^
                            | implements
                            |
+------------------------------------------------------+
|                   Adapter Layer                      |
|  API adapters (ky/HTTP), Orval generated hooks,      |
|  storage adapters (localStorage)                     |
|  Concrete implementations of domain ports            |
+------------------------------------------------------+
```

The **composition root** (`config/container.ts`) is the single place that wires adapters to domain use cases.

**The golden rule:**

```
UI  --->  Domain  --->  Ports  <---  Adapters
```

Nothing goes backwards. The UI never imports an adapter. The domain never imports React. Adapters never import UI components. If a dependency arrow points the wrong way, the code is in the wrong layer.

---

## Why This Architecture

Hexagonal is not academic theory. It solves six problems that every growing frontend hits eventually.

### 1. "I changed the API and 47 files broke"

Without boundaries, API response shapes leak into every component, hook, and test. When the backend changes a field name, you are grepping through the entire codebase.

With hexagonal, only the adapter file changes. The adapter maps the external shape to internal domain types. Domain logic and UI components never see the raw API response, so they do not break.

### 2. "I can't test this without the whole app running"

If your business logic lives inside React hooks or Redux thunks that depend on providers, routers, and a running dev server, testing is painful.

The domain layer is pure TypeScript. You test it with plain functions and mock objects. No browser needed. No React rendering. No HTTP mocking. These tests run in milliseconds.

### 3. "New dev can't figure out where anything is"

In an unstructured codebase, every module is organized differently. One developer puts types next to components, another puts them in a shared folder, a third inlines them.

Here, every module follows the same structure: `types.ts`, `ports.ts`, `use-cases.ts`, `index.ts`. Learn one module, know all 25. A new developer can be productive on day one.

### 4. "We need to swap localStorage for secure cookies"

Without ports and adapters, localStorage calls are scattered across components and hooks. Swapping the storage mechanism means touching dozens of files.

With hexagonal, you change one adapter file and update one line in the composition root. The domain does not know. The UI does not know. The swap is done.

### 5. "Forms are a mess -- validation here, API there, state somewhere else"

Fat page components that mix form fields, validation logic, API calls, and error handling are the norm in most React codebases. They are impossible to review, test, or reuse.

Our form decomposition follows a strict hierarchy: Page (~10 lines) calls Form (~30 lines) calls Fields (~20 lines each) with Validation (~5 lines per schema). Each file does exactly one thing. You can review a form change without scrolling past 200 lines of unrelated logic.

### 6. "Backend changed the response format"

When API response parsing is scattered across components, a format change means hunting through the entire UI layer.

All responses go through one fetcher (`adapter/api/fetcher.ts`) that handles envelope unwrapping, error mapping, and token management. When the backend changes the response format, it is a one-file fix.

---

## The Three Layers

### Domain

The domain layer is the innermost ring. It contains:

- **Types** -- entities, value objects, request/response shapes
- **Ports** -- outbound interfaces that the domain needs (e.g., "I need something that can store tokens")
- **Use cases** -- orchestration classes that coordinate business operations through ports

The domain layer has **zero framework imports**. No React. No ky. No localStorage. Just TypeScript interfaces and classes.

### Adapter

The adapter layer implements the domain's ports with concrete technology:

- **API adapters** -- implement API ports using `ky` (HTTP client) for manual calls
- **Custom fetcher** -- `adapter/api/fetcher.ts` provides a native `fetch`-based fetcher for Orval-generated hooks, handling auth tokens, automatic 401 refresh, response envelope unwrapping, and domain error mapping
- **Generated code** -- Orval generates TanStack Query hooks and TypeScript schemas into `adapter/api/generated/` (see [Code Generation with Orval](#code-generation-with-orval))
- **Storage adapters** -- implement storage ports using `localStorage`

Adapters import from the domain (to know which interfaces to implement) but the domain never imports from adapters.

### UI

The UI layer is React. It contains:

- **Store** -- Redux Toolkit store with typed hooks (`useAppDispatch`, `useAppSelector`) for client state management. The store lives in `ui/store/index.ts` with slices in `ui/store/slices/` -- one per domain (e.g., `auth.ts`, `ui.ts`)
- **Hooks** -- bridge hooks like `useAuth` that wrap Redux dispatch and selectors. Components never import the store directly
- **Pages** -- thin shells (~12 lines) containing a heading, a form import, and navigation links. Pages do not contain form logic, validation, or complex rendering
- **Forms** -- form composition components in `ui/forms/{module}/` that import field components and connect to validation schemas
- **Primitives** -- shadcn/ui components in `ui/primitives/`, managed by the shadcn CLI (`components.json` points to `@/ui/primitives`). These are low-level building blocks (Button, Input, Label, etc.) that are never used directly in forms -- they are wrapped by business fields
- **Fields** -- business field components in `ui/fields/` built on top of primitives (InputField, PasswordField, CurrencyField, SearchableSelect, OtpField, SelectField, TextareaField)
- **Validation** -- Zod schemas in `ui/validation/{module}/`, one schema file per form
- **Components** -- shared components in `ui/components/common/` (SubmitButton) and `ui/components/feedback/` (FormError)
- **Layouts** -- shared page shells (auth layout, dashboard layout)

The UI layer imports from the domain (for types) and from the composition root (for wired use-case instances). It never imports adapters directly.

---

## Folder Structure

```
src/
├── domain/                          # Pure TypeScript, zero React
│   ├── auth/
│   │   ├── types.ts                 # Domain entities
│   │   ├── ports.ts                 # Interfaces (AuthApi, TokenStorage, UserStorage)
│   │   ├── use-cases.ts             # Business logic
│   │   └── index.ts                 # Barrel export
│   └── shared/
│       ├── types.ts                 # ApiResponse, ResponseCodes
│       └── errors.ts               # DomainError, ValidationError, NetworkError
│
├── adapter/                         # Implements domain ports
│   ├── api/
│   │   ├── client.ts                # Manual HTTP client (ky)
│   │   ├── fetcher.ts               # Custom fetcher for Orval (native fetch)
│   │   ├── auth.ts                  # Manual AuthApi adapter
│   │   └── generated/               # Orval output (DO NOT EDIT)
│   │       ├── auth/auth.ts         # Generated TanStack hooks
│   │       └── schemas/             # Generated TypeScript types
│   └── storage/
│       ├── token.ts                 # LocalStorage TokenStorage adapter
│       └── user.ts                  # LocalStorage UserStorage adapter
│
├── ui/                              # React — inbound adapter
│   ├── store/
│   │   ├── index.ts                 # configureStore, typed hooks
│   │   └── slices/
│   │       ├── auth.ts              # Auth slice + async thunks
│   │       └── ui.ts                # UI state slice
│   ├── hooks/
│   │   └── use-auth.ts              # Bridges React ↔ Redux auth slice
│   ├── pages/                       # THIN — heading + form + links only
│   │   ├── auth/
│   │   │   ├── register-page.tsx
│   │   │   ├── verify-page.tsx
│   │   │   └── login-page.tsx
│   │   └── dashboard/
│   │       └── dashboard-page.tsx
│   ├── forms/                       # Form composition
│   │   └── auth/
│   │       ├── register-form.tsx
│   │       ├── login-form.tsx
│   │       └── verify-form.tsx
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
│   │   └── index.ts
│   ├── validation/                  # Zod schemas, one per form
│   │   └── auth/
│   │       ├── register.ts
│   │       ├── login.ts
│   │       └── verify.ts
│   ├── components/
│   │   ├── common/
│   │   │   └── submit-button.tsx
│   │   └── feedback/
│   │       └── form-error.tsx
│   └── layouts/
│       ├── auth-layout.tsx
│       └── dashboard-layout.tsx
│
├── router/
│   ├── routes.tsx
│   └── auth-guard.tsx
│
├── config/
│   ├── env.ts
│   └── container.ts                 # Composition root
│
├── lib/
│   └── cn.ts                        # Tailwind merge utility
│
└── main.tsx                         # Entry point, Provider wiring
```

---

## Dependency Rules

These are enforced by convention (and should be enforced by lint rules as the project matures):

| Source file in... | Can import from...                              | CANNOT import from...         |
|-------------------|-------------------------------------------------|-------------------------------|
| `domain/`         | Other `domain/` files only                      | `adapter/`, `ui/`, `config/`  |
| `adapter/`        | `domain/` (ports, types), `config/env`           | `ui/`, other adapters*        |
| `ui/`             | `domain/` (types), `config/container`            | `adapter/` directly           |
| `config/`         | `domain/`, `adapter/`                            | `ui/`                         |
| `router/`         | `ui/`                                            | `domain/`, `adapter/`         |

*Adapters may import shared infrastructure (e.g., `client.ts`, `fetcher.ts`) but should not import each other's module-specific adapters.

The key rule: `UI --> Domain --> Ports <-- Adapters`. Dependencies point inward. Nothing goes backwards. The domain never reaches out. The UI never touches adapters. The composition root is the only file that knows about concrete implementations.

---

## Tech Stack

| Concern             | Tool                        | Notes                                      |
|---------------------|-----------------------------|---------------------------------------------|
| Build               | Vite 8                      | Fast dev server, ESM-native                 |
| Language            | TypeScript 6                | Strict mode via `tsconfig.app.json`         |
| UI Framework        | React 19                    | Function components only                    |
| Routing             | react-router-dom 7          | `createBrowserRouter` with layout routes    |
| Styling             | Tailwind CSS 4              | Utility-first, via `@tailwindcss/vite`      |
| Client State        | Redux Toolkit + react-redux | Company standard. Slices, thunks, typed dispatch/selectors |
| Server State        | TanStack React Query 5      | For cached/async data fetching              |
| HTTP Client (manual)| ky 2                        | Lightweight fetch wrapper with hooks        |
| HTTP Client (Orval) | Native fetch                | Used by the custom Orval fetcher            |
| Code Generation     | Orval (dev dependency)      | Generates TanStack hooks + types from OpenAPI spec |
| Forms               | React Hook Form 7 + Zod 4   | Schema-first validation                     |
| CSS Utilities       | clsx + tailwind-merge       | `cn()` helper in `lib/cn.ts`               |

### Why Redux Toolkit over Zustand

All Morphlix projects use Redux Toolkit as the company standard for client state management. Team familiarity and code review consistency across projects outweigh Zustand's simplicity advantage. Every developer on the team knows Redux patterns, which makes onboarding, code reviews, and cross-project work frictionless.

### Why Not RTK Query

We deliberately chose not to use RTK Query. The team has experienced cache and network visibility issues with RTK Query in previous projects. TanStack React Query handles server state, and Redux Toolkit handles client state. Clean separation, no overlap.

---

## Code Generation with Orval

Orval generates type-safe TanStack Query hooks and TypeScript schemas from the backend's OpenAPI spec. This eliminates manual DTO definitions and keeps frontend types in sync with the API.

### How It Works

1. The backend generates an OpenAPI spec via swaggo: `make swagger` produces `docs/swagger.json`
2. The backend serves the spec at `GET /openapi.json`
3. The frontend runs `npm run generate` which invokes Orval
4. Orval reads the spec from `../energyiq-api/docs/swagger.json` and generates code into `adapter/api/generated/`
5. Generated output is split by tag -- one file per module (e.g., `auth/auth.ts`)
6. Generated TypeScript schemas go to `adapter/api/generated/schemas/`

### Configuration

Orval configuration lives at `orval.config.ts` in the project root.

The custom fetcher at `adapter/api/fetcher.ts` handles:
- Attaching auth tokens to requests
- Automatic token refresh on 401 responses
- Unwrapping the API response envelope (`{ responseCode, responseMessage, data }`)
- Mapping API error codes to domain error types

### Two Paths for API Calls

| Path | When to use | Example |
|------|-------------|---------|
| Orval generated hooks | Standard CRUD operations. Annotate the backend handler with Swagger, run `npm run generate`, use the hook. | Listing products, fetching a single invoice |
| Manual domain use-cases | Complex flows needing orchestration across multiple endpoints or conditional logic | Auth flow: initiate -> complete -> store tokens -> redirect |

For standard CRUD, prefer Orval. It generates the query key, the fetch function, and the TypeScript types. You get a working hook with zero manual wiring.

For complex flows (like the auth registration sequence: initiate, wait for OTP, complete, store tokens, redirect), write manual use-cases that call through the `ky` HTTP client. These flows need orchestration that generated hooks cannot express.

---

## Composition Root

`src/config/container.ts` is the composition root. It is the **only file in the codebase** that imports both adapters and domain use cases. It wires them together:

```typescript
// Adapters
const tokenStorage = new LocalTokenStorage();
const userStorage  = new LocalUserStorage();
const authApi      = new AuthApiAdapter();

// Domain use cases (injected with adapters)
export const authUseCases = new AuthUseCases(authApi, tokenStorage, userStorage);

// Wire token management into HTTP client
configureClient(
  () => tokenStorage.getAccessToken(),
  () => authUseCases.refresh(),
);
```

When you add a new module, you add its wiring here. The rest of the app imports `authUseCases` (or `billingUseCases`, `inventoryUseCases`, etc.) from this file.

---

## API Response Format

Every API response from the EnergyIQ backend follows this envelope:

```json
{
  "responseCode": "EIQ-0000",
  "responseMessage": "Success",
  "data": { ... }
}
```

The `responseCode` uses the format `EIQ-XNNN` where `X` is the category:

| Prefix    | Category         | Examples                                          |
|-----------|------------------|---------------------------------------------------|
| `EIQ-0xxx`| Success          | `EIQ-0000` (OK), `EIQ-0001` (Created)             |
| `EIQ-1xxx`| Authentication   | `EIQ-1000` (Unauthorized), `EIQ-1002` (Bad creds) |
| `EIQ-2xxx`| Validation       | `EIQ-2000` (Validation failed)                    |
| `EIQ-3xxx`| Financial        | `EIQ-3000` (Insufficient funds), `EIQ-3007` (KYC) |
| `EIQ-4xxx`| Resource         | `EIQ-4000` (Not found), `EIQ-4001` (Already exists)|
| `EIQ-5xxx`| System           | `EIQ-5000` (Internal error), `EIQ-5002` (Rate limited)|

The HTTP client (`adapter/api/client.ts`) and the custom Orval fetcher (`adapter/api/fetcher.ts`) both unwrap this envelope automatically. If the response code does not start with `EIQ-0`, they throw a `DomainError` with the code and message. UI code catches `DomainError` and can switch on `error.code` to show specific messages.

The `isSuccess(code)` helper checks if a code starts with `EIQ-0`.

---

## Auth Model

EnergyIQ supports two login types:

### Account Login (`login_type: 'account'`)

The root account owner. Created during registration. Has full access to the organization. Think of this as the "admin who signed up."

### Staff Login (`login_type: 'staff'`)

IAM-managed users created by the account owner. Each staff member has:

- A `role` (e.g., `admin`, `operator`, `viewer`)
- An `entity_type` and `entity_id` (which organization entity they belong to)
- Permissions granted through the IAM system

### JWT Claims

The `AuthUser` object (stored client-side and derived from JWT claims) contains:

```typescript
interface AuthUser {
  id: string;              // User ID
  name: string;            // Display name
  email: string;           // Email address
  role: string;            // e.g., 'owner', 'admin', 'operator'
  entity_type: string;     // e.g., 'supplier'
  entity_id: string;       // The organization entity ID
  account_number: string;  // e.g., 'EIQ-ACC-00001'
  slug: string;            // URL-friendly org identifier
}
```

The `loginType` is derived from the role: `owner` maps to `'account'`, everything else maps to `'staff'`.

---

## Auth Flow

### Registration

```
1. User fills registration form (thin page imports RegisterForm)
   RegisterForm uses fields from ui/fields/ and validation from ui/validation/auth/register.ts
   |
   v
2. POST /v1/public/auth/initiate
   Request:  { company: {...}, account: {...} }
   Response: { registration_token, account_number, slug }
   |
   v
3. User receives OTP via email, enters 6-digit code (VerifyPage imports VerifyForm)
   VerifyForm uses OtpField and validation from ui/validation/auth/verify.ts
   |
   v
4. POST /v1/public/auth/complete
   Request:  { registration_token, otp_code }
   Response: { access_token, refresh_token, expires_in, supplier }
   |
   v
5. Tokens stored in localStorage, auth Redux slice updated, user redirected to /dashboard
```

This is a manual domain use-case flow (not Orval-generated) because it requires multi-step orchestration: initiate, wait for OTP, complete, store tokens, update Redux state, redirect.

### Login

```
1. User enters email + password (thin page imports LoginForm)
   LoginForm uses fields from ui/fields/ and validation from ui/validation/auth/login.ts
   |
   v
2. POST /v1/public/auth/login
   Request:  { email, password, mfa_code? }
   Response: { access_token, refresh_token, expires_in, login_type, user }
   |
   v
3. Tokens stored in localStorage, auth Redux slice updated, user redirected to /dashboard
```

### Token Refresh

The HTTP client and Orval fetcher automatically handle 401 responses on authenticated routes:

1. A request returns 401
2. The client calls `authUseCases.refresh()` which POSTs to `/v1/public/auth/refresh`
3. If refresh succeeds, the original request is retried with the new token
4. If refresh fails, the user is logged out (tokens cleared, auth Redux slice reset)

### Hydration

On app boot (`main.tsx`), the auth Redux slice dispatches a `hydrate` thunk that reads tokens and user data from localStorage to restore the auth state. This means page refreshes don't force a re-login.

---

## Auth Guards

Two route-level guard components control access:

### `RequireAuth`

Wraps protected routes. If the user is not authenticated, they are redirected to `/login`. Used around the dashboard layout.

### `RedirectIfAuth`

Wraps public auth routes (login, register, verify). If the user is already authenticated, they are redirected to `/dashboard`. Prevents logged-in users from seeing the login page.

Both are implemented as layout routes using React Router's `<Outlet />` pattern:

```tsx
// In routes.tsx
{
  element: <RedirectIfAuth />,
  children: [
    { element: <AuthLayout />, children: [
      { path: '/login', element: <LoginPage /> },
      // ...
    ]},
  ],
},
{
  element: <RequireAuth />,
  children: [
    { element: <DashboardLayout />, children: [
      { path: '/dashboard', element: <DashboardPage /> },
    ]},
  ],
},
```

---

## Route Conventions

### Backend API Routes

| Prefix          | Auth Required | Description                              |
|-----------------|---------------|------------------------------------------|
| `/v1/public/`   | No            | Unauthenticated endpoints (login, register, refresh) |
| `/v1/`          | Yes (Bearer)  | Authenticated endpoints (all business operations)     |

### Permission Model (planned)

Permissions follow the format `module:action`. Examples:

- `inventory:read` -- can view inventory
- `billing:write` -- can create invoices
- `iam:manage` -- can create/edit staff accounts

The account owner has all permissions implicitly. Staff members are granted permissions through the IAM module.

### Frontend Routes

| Path          | Guard            | Layout          | Purpose              |
|---------------|------------------|-----------------|----------------------|
| `/register`   | `RedirectIfAuth` | `AuthLayout`    | New account signup   |
| `/verify`     | `RedirectIfAuth` | `AuthLayout`    | OTP verification     |
| `/login`      | `RedirectIfAuth` | `AuthLayout`    | Sign in              |
| `/dashboard`  | `RequireAuth`    | `DashboardLayout` | Main dashboard     |
| `/`           | None             | None            | Redirects to login   |

---

## How to Add a New Module

Follow these steps to add a new feature module (e.g., `inventory`). This is the standard pattern -- every module follows the same structure.

### Step 1: Backend -- Add Swagger Annotations

Add the handler in the Go backend with Swagger annotations, then run `make swagger` to regenerate `docs/swagger.json`.

### Step 2: Frontend -- Generate API Code

Run `npm run generate` to invoke Orval. This reads the updated OpenAPI spec and generates TanStack Query hooks and TypeScript schemas into `adapter/api/generated/`. For standard CRUD endpoints, you now have type-safe hooks ready to use -- skip to Step 5.

### Step 3: Define the Domain (if needed)

For modules with complex business logic or orchestration beyond simple CRUD, create `src/domain/inventory/`:

```
domain/inventory/
|-- types.ts       # Entities: Product, StockLevel, etc.
|-- ports.ts       # Outbound interfaces: InventoryApi, InventoryStorage (if needed)
|-- use-cases.ts   # InventoryUseCases class
|-- index.ts       # Barrel export
```

**types.ts** -- Define your entities and request/response shapes. Pure TypeScript, no imports from outside `domain/`.

```typescript
export interface Product {
  id: string;
  name: string;
  sku: string;
  unit_price: number;
  stock_level: number;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  unit_price: number;
  initial_stock: number;
}
```

**ports.ts** -- Define what the domain needs from the outside world.

```typescript
import type { Product, CreateProductRequest } from './types';

export interface InventoryApi {
  listProducts(): Promise<Product[]>;
  createProduct(req: CreateProductRequest): Promise<Product>;
}
```

**use-cases.ts** -- Orchestrate operations through ports.

```typescript
import type { InventoryApi } from './ports';
import type { Product, CreateProductRequest } from './types';

export class InventoryUseCases {
  constructor(private api: InventoryApi) {}

  async listProducts(): Promise<Product[]> {
    return this.api.listProducts();
  }

  async createProduct(req: CreateProductRequest): Promise<Product> {
    // Domain validation, business rules, etc.
    return this.api.createProduct(req);
  }
}
```

### Step 4: Add Redux Slice (if complex client state needed)

Create `src/ui/store/slices/inventory.ts` with a Redux Toolkit slice and async thunks:

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryUseCases } from '@/config/container';
import type { Product } from '@/domain/inventory';

export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  () => inventoryUseCases.listProducts(),
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    products: [] as Product[],
    isLoading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch products';
      });
  },
});

export default inventorySlice.reducer;
```

Register the slice in `ui/store/index.ts` and create a bridge hook in `ui/hooks/use-inventory.ts` that wraps `useAppDispatch` and `useAppSelector`. Components should use the hook -- never import the store directly.

### Step 5: Add Validation Schema

Create `src/ui/validation/inventory/create-product.ts`:

```typescript
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  unit_price: z.number().positive('Price must be positive'),
  initial_stock: z.number().int().nonneg('Stock cannot be negative'),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
```

### Step 6: Build Form and Page

Create the form component in `src/ui/forms/inventory/create-product-form.tsx` using field components from `ui/fields/` and the validation schema from the previous step.

Create a thin page in `src/ui/pages/inventory/create-product-page.tsx` -- it should contain only a heading, the form import, and navigation links. Target ~12 lines.

```tsx
// Example thin page
import { CreateProductForm } from '@/ui/forms/inventory/create-product-form';

export function CreateProductPage() {
  return (
    <div>
      <h1>Create Product</h1>
      <CreateProductForm />
    </div>
  );
}
```

### Step 7: Add Route

Add the route in `src/router/routes.tsx` under the `RequireAuth` guard.

### Step 8: Verify the Dependency Rule

Double-check:

- `domain/inventory/` imports nothing outside `domain/`
- `adapter/api/inventory.ts` imports only from `domain/` and `adapter/api/client.ts`
- `ui/store/slices/inventory.ts` imports from `config/container` and `domain/` (types only)
- `ui/hooks/use-inventory.ts` uses `useAppDispatch` and `useAppSelector` from `ui/store/`
- Pages import from `ui/hooks/` and `ui/forms/` only -- no direct store or adapter access
- The composition root is the only file that imports adapter classes

---

## Testing

### Test File Location

Test files are colocated with their source files. Always.

- `use-cases.ts` -> `use-cases.test.ts` (same folder)
- `auth.ts` -> `auth.test.ts` (same folder)
- `currency-field.tsx` -> `currency-field.test.tsx` (same folder)

There is no `__tests__/` directory. If you add a file with logic, you add its test file right next to it.

### Test File Tree

```
src/
├── domain/
│   ├── auth/
│   │   ├── use-cases.ts
│   │   └── use-cases.test.ts            # Domain unit test
│   └── shared/
│       ├── errors.ts
│       └── errors.test.ts
│
├── adapter/
│   ├── api/
│   │   ├── auth.ts
│   │   └── auth.test.ts                 # Adapter integration test (MSW)
│   └── storage/
│       ├── token.ts
│       └── token.test.ts
│
├── ui/
│   ├── store/
│   │   └── slices/
│   │       ├── auth.ts
│   │       └── auth.test.ts             # Redux store test
│   ├── fields/
│   │   ├── currency-field.tsx
│   │   └── currency-field.test.tsx       # Component test
│   └── forms/
│       └── auth/
│           ├── login-form.tsx
│           └── login-form.test.tsx       # Component test
│
├── test/                                # Test UTILITIES only (not test files)
│   ├── setup.ts                         # MSW server lifecycle, DOM cleanup
│   ├── render.tsx                       # renderWithProviders()
│   ├── factories/
│   │   └── auth.ts                      # buildUser(), buildLoginResult(), etc.
│   ├── mocks/
│   │   ├── server.ts                    # MSW server instance
│   │   └── handlers/
│   │       └── auth.ts                  # API mock handlers with error overrides
│   └── index.ts                         # Barrel: import { renderWithProviders, buildUser, server } from '@/test'
│
e2e/                                     # Playwright E2E tests (project root, not in src/)
├── auth/
│   ├── register.spec.ts
│   └── login.spec.ts
└── playwright.config.ts
```

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
// domain/auth/use-cases.test.ts

const mockApi = { login: vi.fn() };
const auth = new AuthUseCases(mockApi, mockTokens, mockUser);
vi.mocked(mockApi.login).mockResolvedValue(buildLoginResult());
await auth.login({ email: 'chioma@megaenergy.com', password: 'pass' });
expect(mockTokens.setTokens).toHaveBeenCalled();
```

This is the fastest, most valuable test layer. No browser, no rendering, no HTTP. Invest here first.

**2. Redux store tests** -- mock the container, test reducers + thunks:

```ts
// ui/store/slices/auth.test.ts

vi.mock('@/config/container', () => ({
  authUseCases: { login: vi.fn() }
}));

await store.dispatch(login({ email: 'chioma@megaenergy.com', password: 'pass' }));
expect(store.getState().auth.isAuthenticated).toBe(true);
```

**3. Component tests** -- always use `renderWithProviders`:

```ts
// ui/forms/auth/login-form.test.tsx

import { renderWithProviders } from '@/test';

const { user } = renderWithProviders(<LoginForm />);
await user.type(screen.getByLabelText('Email'), 'chioma@megaenergy.com');
await user.click(screen.getByRole('button', { name: 'Sign In' }));
```

**4. Adapter tests** -- MSW intercepts at network level:

```ts
// adapter/api/auth.test.ts

import { server } from '@/test';
import { authErrorHandlers } from '@/test/mocks/handlers/auth';

server.use(authErrorHandlers.emailTaken);
// API now returns 409 EIQ-1010
```

**5. E2E tests** -- Playwright, real browser:

```ts
// e2e/auth/register.spec.ts

await page.goto('/register');
await page.getByLabel('Company Name').fill('MegaEnergy');
await page.getByRole('button', { name: 'Create Account' }).click();
```

### Test Factories

Always use factories instead of manually constructing objects.

- `buildUser()` -- returns a default owner (Chioma at MegaEnergy). Override what you need: `buildUser({ role: 'finance' })`
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

## Summary

The architecture is simple by design. Every module follows the same pattern: domain defines the contract, adapters implement it (or Orval generates the hooks), the composition root wires them, and the UI consumes use cases through Redux slices and bridge hooks. Pages are thin shells that compose forms, which compose fields and validation schemas. If you follow the dependency rules and the step-by-step guide above, you will produce code that is testable, swappable, and consistent with the rest of the codebase.
