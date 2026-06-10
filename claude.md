This contains the list of commands I want you to follow while implementing code in this frontend. 
1. Do not create component files in page folders
2. using var or params names as n,o,e etc is not allowed, always use comprehensive names
3. Always ensure that your solutions/implementations follows the DRY,KISS, not over-engineered principles/patterns.
4. Always crosscheck what you are implementing and ensure that there is no mistake. Do not rush to finish tasks, rather follow through instructions and ensure that you keep best practices. That is what marks any task you do as success

## Building pages from the Pencil (.pen) design

5. Read designs only through the Pencil MCP tools (get_editor_state, batch_get, get_screenshot) — never Read or Grep a .pen file directly. Replicate the focused frame exactly: verbatim text, exact hex colors, fonts, sizes and spacing. Treat it as pixel-perfect.
6. Keep pages thin (heading + a single composed feature component). Put every feature component in `ui/components/<feature>/` with feature-prefixed file names (e.g. `dashboard-overview-kpi-card.tsx`) — never inside `ui/pages/`.
7. Reuse the existing design system instead of reinventing: `@energyiq/ui` primitives (DropdownMenu, Select, Sidebar, etc.), `recharts` for charts, `lucide-react` icons, the Montserrat font, and the brand palette (gold `#FBC02D`, dark canvas `#121212`, panel `#6161611A`, card `#FFFFFF1A`). Pull repeated styling into small shared sub-components.
8. Place placeholder data in a `<feature>-mocks.ts` module and mark each block with a `TODO(orval)` comment showing where the generated API query will replace it.
9. Designs ship with multiple states (loaded, empty/loading). Implement them too, driven by a single `isEmpty`/status prop threaded from the composed component down to each section — do not hardcode one state.
10. Before declaring a task done, run `yarn typecheck` and verify the result visually (render the route and screenshot it) for every state you implemented.

## Routing & the temporary auth bypass (remove when the real auth endpoint lands)

11. Authenticated routes are slug-prefixed: `/:slug/<page>` (e.g. `/:slug/dashboard`, `/:slug/orders`). This is the canonical pattern — keep it. Build slug-aware links/redirects by sourcing the slug as `user?.slug ?? stateSlug ?? 'demo'` (same as `app-sidebar.tsx`). Do NOT flatten routes to `/dashboard` etc.
12. Login is currently bypassed: `tempBypassLogin` in `packages/store/src/slices/auth.ts` fakes an authed state with `slug: 'demo'`, so the app runs without an endpoint. While bypassed, you reach pages at `/demo/<page>` (e.g. `/demo/dashboard`).
13. TEMP scaffolding to delete once the auth endpoint is available: (a) the `tempBypassLogin` reducer + its dispatch in `packages/ui/src/forms/auth/login-form.tsx`; (b) the hardcoded `navigate('/demo/dashboard')` in `login-form.tsx` — restore the commented real `onSubmit` which redirects to `` `/${result.slug}/dashboard` ``. The `RedirectIfAuth` guard in `apps/supplier/src/router/auth-guard.tsx` is already slug-aware and needs no change when the endpoint lands.