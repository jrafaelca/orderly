# Orderly - Master Execution Playbook

## 1) Product Vision
Orderly is a modern multi-tenant SaaS platform for restaurants, cafes, ice cream shops, and food businesses.

Primary business goals:
- Organize daily restaurant operations end-to-end.
- Reduce human errors in ordering, kitchen, and checkout flows.
- Speed up service with real-time communication.
- Improve customer experience and operational visibility.

Product principles:
- Fast.
- Reliable.
- Simple to use.
- Error-resistant.
- Built for real restaurant operations.

---

## 2) Locked Stack (Must Use)
- Framework: Nuxt 4 (fullstack, single main project).
- UI: Nuxt UI + Tailwind.
- Frontend: Vue 3.
- Backend: Nuxt server routes (`server/api`) with modular domain services.
- API style: REST (`/api/v1/...`).
- Database: PostgreSQL.
- ORM: Drizzle ORM.
- Realtime: WebSockets + Redis Pub/Sub.
- Frontend state: `useState` first, Pinia only if state complexity demands it.

---

## 3) System Architecture
Orderly is multi-tenant.
Each restaurant is an organization (`org_id`).
Each organization has branches (`branch_id`), tables, users, menu, orders, payments, and reports.

### Tenancy model (MVP)
- Shared PostgreSQL database.
- Isolation by `org_id` and `branch_id` in all operational entities.
- No cross-tenant queries without explicit admin scope.

### Nuxt 4 structure baseline
- `app/`: UI (pages, layouts, components, composables).
- `server/api/v1/`: REST endpoints.
- `server/modules/`: domain modules and business rules.
- `server/utils/`: auth, RBAC, tenant resolution, shared helpers.
- `shared/` (optional): shared contracts/types between server and app.

---

## 4) Core Interfaces (MVP includes all 5)
1. Dashboard (operational overview)
2. POS (operators/waiters)
3. Kitchen Board (kitchen kanban)
4. Customer Screen (public order status)
5. Backoffice (admin, menu, users, reports, cash)

---

## 5) Domain Modules
Required backend modules:
- `auth`
- `organizations`
- `users-rbac`
- `tables`
- `catalog`
- `orders`
- `kitchen`
- `payments-cash`
- `reports`
- `realtime`

### Role model
Roles:
- administrador
- gerente
- cajero
- garzon
- cocina

Permission rule:
- Permissions are action-based, not screen-based.
- All sensitive actions must create audit logs with actor and timestamp.

---

## 6) Operational Rules
### Table management
Table states:
- disponible
- reservada
- abierta
- sucia
- fuera_servicio

Required:
- Visual table map.
- Fast status changes.
- State changes emit realtime events and audit entries.

### Order management
Order is linked to:
- table
- customer (optional)
- operator
- product items

Each item supports:
- toppings/modifiers
- notes/observations

Kitchen behavior:
- Orders can be sent to kitchen.
- Kitchen tickets are updated in realtime.

### Toppings/modifiers
- Products can have modifier groups.
- Group can define free included items (`free_included`).
- Extras beyond free included are charged automatically.
- Price calculation must happen server-side to prevent inconsistencies.

### Kitchen board
Kanban columns:
- nuevos
- en_preparacion
- listos

Each card should clearly show:
- order number
- table
- products
- toppings
- notes

### Customer screen
Must display only:
- orders in preparation
- orders ready for pickup

UI requirements:
- high readability from distance
- large typography
- high contrast

---

## 7) Payments, Cash, and Multi-Currency
Orderly must support mixed payments per order:
- efectivo
- tarjeta
- transferencia

### Split and multiple payments
- One order can have multiple payment lines.
- Split bill is first-class behavior.

### Multi-currency cash policy (MVP)
- Each branch has one base currency.
- Orders are priced and stored in base currency.
- Cash payments can be received in foreign currencies.
- Conversion occurs at payment time using shift FX rates.
- FX rates are manually configured per cash shift.
- Change is always returned in base currency.
- If no FX rate exists for foreign currency, payment is blocked.

### Cash operations
Required flows:
- open shift
- register payments
- close shift
- cash count/archeo
- end-of-day close

---

## 8) REST API v1 Contract (Minimum)
Auth:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Tables:
- `GET /api/v1/tables`
- `POST /api/v1/tables`
- `PATCH /api/v1/tables/:id/state`
- `POST /api/v1/table-sessions`
- `POST /api/v1/table-sessions/:id/close`

Catalog:
- `GET /api/v1/products`
- `POST /api/v1/products`
- `GET /api/v1/modifier-groups`
- `POST /api/v1/modifier-groups`
- `GET /api/v1/modifier-options`
- `POST /api/v1/modifier-options`

Orders:
- `GET /api/v1/orders`
- `POST /api/v1/orders`
- `POST /api/v1/orders/:id/items`
- `PATCH /api/v1/orders/:id/status`
- `POST /api/v1/orders/:id/payments`
- `GET /api/v1/orders/:id/payment-summary`

Kitchen:
- `GET /api/v1/kitchen/tickets`
- `PATCH /api/v1/kitchen/tickets/:id`

Cash + FX:
- `POST /api/v1/cash-shifts`
- `POST /api/v1/cash-shifts/:id/close`
- `GET /api/v1/cash-shifts/:id/fx-rates`
- `POST /api/v1/cash-shifts/:id/fx-rates`

Reports:
- `GET /api/v1/reports/sales-daily`
- `GET /api/v1/reports/sales-by-product`
- `GET /api/v1/reports/sales-by-category`
- `GET /api/v1/reports/payment-methods`

---

## 9) Realtime Events (Mandatory)
- `order.created`
- `order.updated`
- `order.status.changed`
- `kitchen.updated`
- `payment.recorded`
- `order.paid`
- `table.status.changed`

Event scope:
- always scoped by `org_id` + `branch_id`.

---

## 10) Data Model Essentials
Core entities (minimum):
- organizations
- branches
- users
- user_memberships
- restaurant_tables
- table_sessions
- categories
- products
- modifier_groups
- modifier_options
- product_modifier_groups
- orders
- order_items
- order_item_modifiers
- order_status_history
- kitchen_tickets
- cash_shifts
- cash_shift_fx_rates
- order_payments
- audit_logs

Data constraints:
- All operational rows must include `org_id` and `branch_id` when applicable.
- Money fields should be normalized and deterministic.
- State transitions must be validated server-side.

---

## 11) UX Standards
Must work on:
- mobile
- tablet
- desktop

Priorities:
- speed of interaction
- clarity
- error prevention

Kitchen-specific:
- large text
- large touch targets
- high-contrast palette

POS-specific:
- very fast item selection
- keyboard shortcuts
- rapid navigation
- visible prices and categories

---

## 12) Agent Responsibilities
### Agent 1 - System Architect
Owns:
- architecture definition
- module boundaries
- data flow and service map

Deliverables:
- architecture blueprint
- module map
- service/data flow diagram

### Agent 2 - Backend
Owns:
- DB schema and migrations
- API contracts
- business rules (orders, toppings, payments, states)

Deliverables:
- backend structure
- service implementations
- endpoints

### Agent 3 - UX/UI
Owns:
- interaction design by role
- layouts and operational flows

Deliverables:
- Dashboard, POS, Kitchen, Customer Screen, Backoffice designs

### Agent 4 - Frontend
Owns:
- Nuxt UI implementation
- API integration
- realtime UI sync

Deliverables:
- functional interfaces and composables

### Agent 5 - QA
Owns:
- flow validation
- edge case detection
- regression checks

Mandatory scenarios:
- split bills
- mixed payments
- multi-currency cash
- modify/cancel orders in prep
- multiple kitchen stations
- concurrency on same order

---

## 13) Roadmap (Execution Phases)
### Phase 0 - Foundation
- Fresh Nuxt 4 project baseline.
- Nuxt UI integrated.
- Core conventions and repository standards.

### Phase 1 - Core Platform
- PostgreSQL + Drizzle setup.
- Tenant context and auth base.
- RBAC and audit logging skeleton.

### Phase 2 - Operations Core
- Tables, catalog, orders, modifiers pricing logic.
- State machine for order lifecycle.

### Phase 3 - Kitchen + Customer Realtime
- Kitchen ticket flow.
- Realtime delivery via WebSocket + Redis.
- Customer display synchronization.

### Phase 4 - Payments + Cash
- Mixed payment lines.
- Split bill.
- Shift-based FX rates.
- Multi-currency cash + change in base currency.

### Phase 5 - Reports + Hardening
- Sales and payment reports.
- Security hardening.
- QA sign-off and production readiness.

---

## 14) Quality Gates
Before considering a phase complete:
- `pnpm typecheck` passes.
- `pnpm build` passes.
- Domain tests for critical rules pass.
- Manual smoke test for affected flows is documented.

High-priority tests:
- toppings pricing with free included thresholds
- order state transition guards
- non-cash overpay rejection
- cash overpay with computed change in base currency
- tenant isolation checks

---

## 15) Non-Negotiable Implementation Rules
- Keep everything in the main Nuxt 4 project (no detached backend for MVP).
- Do not bypass server-side price/state validations.
- Do not expose cross-tenant data.
- Keep API versioned under `/api/v1`.
- Prefer incremental, tested deliveries over massive unverified changes.

