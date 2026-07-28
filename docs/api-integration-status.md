# API Integration Status

Audit of `apps/supplier` and `apps/distributor` against `energyiq-swagger.json`, comparing swagger tags/endpoints to the generated `@energyiq/api` hooks and their actual usage in UI code. Generated at the request of the team while triaging the "Document Management" mock-data gap.

## 1. Endpoint modules actually integrated (wired to real UI)

Out of 14 swagger tags with generated modules, only **2** have any UI consumer at all:

### Documents (7/7 endpoints wired)
| Endpoint | Hook | Used in |
|---|---|---|
| `POST /v1/document/approve/{id}` | `usePostV1DocumentApproveId` | `kyc-review-queue-overview.tsx` (supplier) |
| `POST /v1/document/reject/{id}` | `usePostV1DocumentRejectId` | `kyc-review-queue-overview.tsx` (supplier) |
| `GET /v1/document/list` | `useGetV1DocumentList` | `kyc-review-queue-overview.tsx`, `kyc-documents-overview.tsx` (supplier), `doc-overview.tsx` (distributor) |
| `GET /v1/document/compliance` | `useGetV1DocumentCompliance` | `kyc-documents-overview.tsx` (supplier) |
| `POST /v1/document/create` | `usePostV1DocumentCreate` | referenced but **not called** — see §2 |
| `DELETE /v1/document/delete/{id}` | `useDeleteV1DocumentDeleteId` | `document-management-card.tsx` (distributor) |
| `GET /v1/document/read/{id}` | `useGetV1DocumentReadId` | `document-details.tsx` (distributor) |

### Document Types (5/5 endpoints wired)
| Endpoint | Hook | Used in |
|---|---|---|
| `POST /v1/doctype/create` | `usePostV1DoctypeCreate` | `kyc-document-type-form.tsx` |
| `PUT /v1/doctype/update/{id}` | `usePutV1DoctypeUpdateId` | `kyc-document-type-form.tsx` |
| `DELETE /v1/doctype/delete/{id}` | `useDeleteV1DoctypeDeleteId` | `kyc-document-types-overview.tsx` |
| `GET /v1/doctype/list` | `useGetV1DoctypeList` | `kyc-document-types-overview.tsx`, `kyc-documents-overview.tsx` |
| `GET /v1/doctype/read/{id}` | `useGetV1DoctypeReadId` | `kyc-document-type-form.tsx` |

Everything else in the app (dashboard, orders, order detail, sales entry, all four analytics dashboards, complaints, product, inventory, audit logs, settings, team & permissions, distributor management, create order) is still driven by `<feature>-mocks.ts` files, each mock block tagged `TODO(orval)` with the hook it will be swapped for.

## 2. Integrated modules that still need something from the backend

These are cases where the module *is* wired up and mostly working, but a specific piece is blocked on the backend — distinct from features that are 100% unintegrated (§3).

### Documents — no file-upload/presign endpoint
- `apps/distributor/src/ui/components/documents/document-upload-modal.tsx` — the "Submit for review" button is permanently `disabled`. `usePostV1DocumentCreate` needs a real `file_url`, but there is no presign/upload endpoint for documents (unlike product images, which have `POST /v1/product/images/presign`). A picked `File` can't be turned into a URL, so the create call is dead code today.
- Same root cause blocks **onboarding documents** during distributor signup: `packages/ui/src/forms/auth/distributor-form.tsx:219` — files are validated client-side but never uploaded/persisted; `createDistributorOnboardingDocument` needs a `file_url` it cannot produce.
- **Ask for backend:** a presign/upload endpoint for both `POST /v1/document/create` and the onboarding-document flow, mirroring the existing product-image presign pattern.

### Documents — distributor rollup fields missing on `GET /v1/document/list`
- `apps/supplier/src/ui/components/kyc-documents/kyc-documents-overview.tsx:77-78` — the "Document Lists" table (per-distributor name, tier, completeness) stays on mock data (`DOCUMENT_LIST_ROWS`) because the endpoint only returns `distributor_id` on each document, with no distributor name/tier and no completeness rollup.
- **Ask for backend:** either add `distributor_name`/`distributor_tier` + a completeness figure to `GET /v1/document/list`, or a dedicated summary endpoint (e.g. `GET /v1/document/distributor-summary`). (Already sent to backend dev separately.)

## 3. Backend endpoints that exist but have zero frontend usage

Fully-built modules in the swagger spec with generated hooks in `packages/api/src/generated/`, but **no UI file imports them at all** — the corresponding pages are still 100% mock:

| Module | Endpoints | Frontend feature it should power |
|---|---|---|
| **Orders** | 10 (`create`, `approve`, `reject`, `cancel`, `dispatch`, `receive`, `update`, `list`, `list/stats`, `read/{id}`) | Supplier Orders + Order Detail, Distributor Orders + Order Detail + Create Order |
| **Products** | 10 (`create`, `update`, `delete`, `clone`, `status`, `list`, `list/stats`, `read/{id}`, `price/{id}`, `images/presign`) | Supplier Product pages, Distributor Create Order product picker |
| **Product Categories** | 5 (full CRUD) | Product setup flows |
| **Product Units** | 5 (full CRUD) | Product setup flows |
| **Warehouses** | 12 (CRUD, `stats`, `transfers`, `transfers/{id}/confirm`, `transfers/{id}/cancel`, `{id}/products`, `{id}/stock`) | Supplier Inventory (warehouse list, stock, transfer history) |
| **Employees** | 6 (CRUD, `list/stats`) | Supplier Team & Permissions (employee table, stats) |
| **Authorization** | 7 (roles CRUD, `role/clone`, `permission/list`) | Supplier Team & Permissions (roles/permissions editor) |
| **Approval** | 5 (maker-checker: `approve`, `reject`, `cancel`, `list`, `read/{id}`) | Not yet surfaced anywhere in the UI |
| **Tenant** | 6 (BYOD provisioning/health/migrate/rotate/decommission) | Admin/infra tooling, not present in either app |
| **Branding** | 1 (`GET /v1/public/branding/{slug}`) | Public supplier theming — not wired into the branding flow yet |
| **Authentication - Supplier/Distributor** | signup/login/OTP/onboarding | Currently bypassed on purpose via `tempBypassLogin` (see root `CLAUDE.md`) |

This is the inverse of §2: the backend has already shipped these endpoints, but no one has connected the corresponding frontend feature yet. **Orders, Products, and Warehouses are the highest-value targets** — each is a fully-built module sitting idle behind mock pages that are otherwise UI-complete.

## 4. Features with no backend endpoint at all

No matching swagger tag exists yet for:
- **Dashboard** (supplier + distributor) — KPIs, recent activity, financial snapshot, sales trend, top products, low-stock alerts
- **Sales entry** — transactions, void, export
- **Analytics** — distributor, complaint, trading, and sales analytics dashboards (all four)
- **Complaints** — list, detail, create, resolve, evidence upload (both apps)
- **Audit logs** — table, filters, export
- **Settings** — company/user profile PATCH, notification preferences PATCH
- **Distributor management extras** — pending applications/approval, per-distributor KYC/orders/complaints/tier-history tabs

## Summary

| Status | Count |
|---|---|
| Fully integrated end-to-end | Documents, Document Types (12 endpoints) |
| Integrated but blocked on a backend gap | Documents create (no presign), Documents list (no distributor rollup) |
| Backend ready, frontend not wired | Orders, Products, Product Categories, Product Units, Warehouses, Employees, Authorization, Approval, Tenant, Branding (57 endpoints) |
| No backend endpoint yet | Dashboard, Sales Entry, Analytics (x4), Complaints, Audit Logs, Settings, Distributor management extras |
