# Home Wealth - Implementation Plan

## Overview

A full-featured family money tracking web application. Family members can input their income and expenses to keep track of the family balance. Built with Next.js 16 (SSR), Supabase (DB + Auth), and shadcn/ui.

**Target Users**: Families who want to collaboratively track finances.

**Deployment**: Vercel

---

## Tech Stack

| Layer           | Technology                                     |
| --------------- | ---------------------------------------------- |
| Framework       | Next.js 16.1.6 (App Router, Server Components) |
| Runtime         | React 19.2.3                                   |
| Language        | TypeScript 5                                   |
| Styling         | Tailwind CSS v4                                |
| UI Components   | shadcn/ui (Radix UI + Tailwind CSS)            |
| Icons           | Lucide React                                   |
| Database        | Supabase (PostgreSQL)                          |
| Authentication  | Supabase Auth                                  |
| Charts          | Recharts (via shadcn/ui Chart)                 |
| Package Manager | pnpm                                           |

---

## Architecture Decisions

- **Supabase over self-hosted DB**: Managed PostgreSQL with built-in auth, Row Level Security (RLS), and a free tier — ideal for a family app on Vercel.
- **Route groups `(auth)` and `(app)`**: Separate layouts for authenticated/unauthenticated pages without affecting URL paths.
- **Server Actions over API Routes**: Next.js 16 pattern for mutations — simpler, type-safe, and SSR-friendly.
- **Server Components by default**: All pages fetch data server-side; only interactive elements (forms, dialogs, charts) use `"use client"`.
- **shadcn Chart (Recharts)**: Already supported by shadcn/ui with theme integration — no extra charting library needed.
- **SQL migrations in Supabase dashboard**: Keep SQL scripts documented in `docs/sql/` for reproducibility.

---

## Database Schema

### Tables

#### `families`

| Column     | Type        | Notes                    |
| ---------- | ----------- | ------------------------ |
| id         | uuid        | Primary key, default gen |
| name       | text        | Family name              |
| created_at | timestamptz | Default now()            |

#### `family_members`

| Column       | Type        | Notes                |
| ------------ | ----------- | -------------------- |
| id           | uuid        | Primary key          |
| family_id    | uuid        | FK → families.id     |
| user_id      | uuid        | FK → auth.users.id   |
| role         | text        | 'admin' or 'member'  |
| display_name | text        | Shown in the app     |
| created_at   | timestamptz | Default now()        |

#### `categories`

| Column     | Type        | Notes                 |
| ---------- | ----------- | --------------------- |
| id         | uuid        | Primary key           |
| family_id  | uuid        | FK → families.id      |
| name       | text        | e.g., "Food", "Salary"|
| type       | text        | 'income' or 'expense' |
| icon       | text        | Lucide icon name      |
| color      | text        | Hex color for charts  |
| is_default | boolean     | Seed categories       |
| created_at | timestamptz | Default now()         |

#### `transactions`

| Column      | Type        | Notes                    |
| ----------- | ----------- | ------------------------ |
| id          | uuid        | Primary key              |
| family_id   | uuid        | FK → families.id         |
| member_id   | uuid        | FK → family_members.id   |
| category_id | uuid        | FK → categories.id       |
| type        | text        | 'income' or 'expense'    |
| amount      | numeric     | Always positive          |
| description | text        | Optional note            |
| date        | date        | Transaction date         |
| created_at  | timestamptz | Default now()            |
| updated_at  | timestamptz | Default now()            |

#### `budgets`

| Column      | Type        | Notes                    |
| ----------- | ----------- | ------------------------ |
| id          | uuid        | Primary key              |
| family_id   | uuid        | FK → families.id         |
| category_id | uuid        | FK → categories.id       |
| amount      | numeric     | Budget limit             |
| month       | date        | First day of the month   |
| created_at  | timestamptz | Default now()            |

### Row Level Security (RLS)

All tables have RLS enabled. Policies ensure users can only read/write data belonging to their family. Access is determined by checking `family_members.user_id` matches `auth.uid()`.

---

## Project Structure (Target)

```
home-wealth/
├── app/
│   ├── (auth)/                    # Auth route group (unauthenticated)
│   │   ├── layout.tsx             # Centered card layout
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   └── signup/
│   │       └── page.tsx           # Sign-up page
│   ├── (app)/                     # App route group (authenticated)
│   │   ├── layout.tsx             # Sidebar + header layout
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Dashboard with charts & summary
│   │   ├── transactions/
│   │   │   └── page.tsx           # Transaction list + filters
│   │   ├── categories/
│   │   │   └── page.tsx           # Category management
│   │   ├── budget/
│   │   │   └── page.tsx           # Monthly budget goals
│   │   └── members/
│   │       └── page.tsx           # Family members management
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts           # Auth callback handler
│   ├── actions/                   # Server Actions
│   │   ├── auth.ts
│   │   ├── transactions.ts
│   │   ├── categories.ts
│   │   ├── budget.ts
│   │   └── members.ts
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home (redirects)
│   ├── globals.css
│   └── fonts/
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── app-sidebar.tsx            # Navigation sidebar
│   ├── header.tsx                 # Top bar
│   ├── dashboard/
│   │   ├── monthly-chart.tsx
│   │   ├── category-chart.tsx
│   │   └── recent-transactions.tsx
│   ├── transactions/
│   │   ├── transaction-form.tsx
│   │   └── delete-dialog.tsx
│   ├── categories/
│   │   └── category-form.tsx
│   ├── budget/
│   │   └── budget-form.tsx
│   └── members/
│       └── invite-form.tsx
├── lib/
│   ├── utils.ts                   # cn() helper
│   └── supabase/
│       ├── server.ts              # Server-side Supabase client
│       ├── client.ts              # Browser-side Supabase client
│       └── middleware.ts          # Middleware Supabase client
├── types/
│   └── database.ts                # Supabase generated types
├── hooks/                         # Custom React hooks
├── constants/                     # App constants
├── docs/
│   ├── implementation-plan.md     # This file
│   └── sql/                       # Database migration scripts
├── middleware.ts                   # Next.js middleware (auth)
└── ...config files
```

---

## Implementation Phases

### Phase 1: Supabase Setup & Infrastructure

- [ ] Install `@supabase/supabase-js` and `@supabase/ssr`
- [ ] Create Supabase client utilities (`lib/supabase/server.ts`, `client.ts`, `middleware.ts`)
- [ ] Create Next.js `middleware.ts` for auth session refresh
- [ ] Create `.env.local.example` with Supabase env vars; update `.gitignore`
- [ ] Write database schema SQL (save in `docs/sql/`)
- [ ] Create TypeScript types in `types/database.ts`

### Phase 2: Authentication

- [ ] Create `(auth)` route group layout (centered card)
- [ ] Build login page with email/password form
- [ ] Build sign-up page (creates user + family + member records)
- [ ] Create auth callback route handler
- [ ] Create logout Server Action

### Phase 3: App Shell & Layout

- [ ] Install required shadcn components (button, card, input, label, dialog, dropdown-menu, select, table, badge, separator, sheet, sidebar, avatar, form, calendar, popover, chart, tabs, toast/sonner)
- [ ] Build authenticated layout with shadcn Sidebar
- [ ] Build sidebar component with navigation links
- [ ] Build header component with user info and mobile menu

### Phase 4: Dashboard

- [ ] Build dashboard page with summary cards (balance, income, expenses, budget)
- [ ] Build monthly trend chart (income vs. expenses, last 6 months)
- [ ] Build category breakdown chart (pie/donut)
- [ ] Build recent transactions table (last 5)

### Phase 5: Transactions (Core Feature)

- [ ] Build transactions list page with shadcn Table
- [ ] Add filters: date range, category, member, type, search
- [ ] Add server-side pagination
- [ ] Build add/edit transaction dialog form
- [ ] Create transaction Server Actions (create, update, delete)
- [ ] Build delete confirmation dialog

### Phase 6: Categories Management

- [ ] Build categories page (grid/list view)
- [ ] Build category form dialog (name, type, icon, color)
- [ ] Create category Server Actions (CRUD)
- [ ] Write SQL to seed default categories

### Phase 7: Family Members Management

- [ ] Build members page (list with roles)
- [ ] Build invite member dialog (by email)
- [ ] Create member Server Actions (invite, update role, remove)

### Phase 8: Budget Goals

- [ ] Build budget page with category-by-category progress bars
- [ ] Add month selector
- [ ] Build budget form dialog (set/edit per category per month)
- [ ] Create budget Server Actions (CRUD)

### Phase 9: Polish & UX

- [ ] Update home page to redirect based on auth state
- [ ] Update metadata (title: "Home Wealth", description)
- [ ] Add toast notifications (sonner) for all mutations
- [ ] Add `loading.tsx` files for Suspense boundaries
- [ ] Add `error.tsx` files for error boundaries
- [ ] Ensure responsive design (mobile sidebar, card layouts)
- [ ] Add dark mode toggle with `next-themes`

### Phase 10: Documentation & Cleanup

- [ ] Update `.github/copilot-instructions.md` with new structure and conventions
- [ ] Update `README.md` with setup instructions and env var docs
- [ ] Clean up unused starter files (e.g., default SVGs in `public/`)

---

## MVP Features Summary

| Feature                  | Description                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| **User Authentication**  | Email/password sign-up and login via Supabase Auth                       |
| **Family Management**    | Create a family, invite members, assign roles (admin/member)             |
| **Transaction Tracking** | Add income and expense entries with date, amount, category, description  |
| **Categories**           | Create and manage custom income/expense categories with icons and colors |
| **Dashboard**            | Balance overview, monthly trends, category breakdown, recent activity    |
| **Budget Goals**         | Set monthly spending limits per category with progress tracking          |
| **Transaction History**  | Searchable, filterable, paginated list of all transactions               |
| **Dark Mode**            | Toggle between light and dark themes                                     |
| **Responsive Design**    | Works on desktop and mobile devices                                      |

---

## Verification Checklist

- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm build` completes successfully with no type errors
- [ ] Auth flow works: sign up → login → logout
- [ ] Family member can create transactions
- [ ] Dashboard displays correct totals and charts
- [ ] Categories CRUD works
- [ ] Budget progress calculates correctly
- [ ] RLS: User A cannot see User B's family data
- [ ] Responsive layout works on mobile viewport
- [ ] Dark mode toggle works correctly

---

## Default Categories (Seed Data)

### Expense Categories

| Name           | Icon           |
| -------------- | -------------- |
| Food & Dining  | utensils       |
| Transportation | car            |
| Housing & Rent | home           |
| Utilities      | zap            |
| Healthcare     | heart-pulse    |
| Entertainment  | gamepad-2      |
| Shopping       | shopping-bag   |
| Education      | graduation-cap |
| Insurance      | shield         |
| Other Expense  | ellipsis       |

### Income Categories

| Name         | Icon        |
| ------------ | ----------- |
| Salary       | briefcase   |
| Freelance    | laptop      |
| Investment   | trending-up |
| Gift         | gift        |
| Other Income | plus-circle |
