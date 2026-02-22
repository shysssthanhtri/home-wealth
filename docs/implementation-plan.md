# Home Wealth - Implementation Plan

## Overview

A full-featured family money tracking web application. Family members can input their income and expenses to keep track of the family balance. Built with Next.js 16 (SSR), MongoDB Atlas (DB), Auth.js (Authentication), and shadcn/ui.

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
| Database        | MongoDB Atlas                                  |
| Authentication  | Auth.js (NextAuth.js v5)                       |
| ODM             | Mongoose                                       |
| Charts          | Recharts (via shadcn/ui Chart)                 |
| Package Manager | pnpm                                           |

---

## Architecture Decisions

- **MongoDB Atlas**: Managed NoSQL database with low latency, flexible schema, and a generous free tier — ideal for a family app deployed on Vercel.
- **Auth.js (NextAuth.js v5)**: Supports multiple authentication strategies (Credentials + Google OAuth) with a dedicated MongoDB adapter. Handles session management, CSRF protection, and JWT out of the box.
- **Mongoose ODM**: Provides schema validation, middleware hooks, and type-safe queries for MongoDB — better DX than raw MongoDB driver for application data.
- **Route groups `(auth)` and `(app)`**: Separate layouts for authenticated/unauthenticated pages without affecting URL paths.
- **Server Actions over API Routes**: Next.js 16 pattern for mutations — simpler, type-safe, and SSR-friendly.
- **Server Components by default**: All pages fetch data server-side; only interactive elements (forms, dialogs, charts) use `"use client"`.
- **shadcn Chart (Recharts)**: Already supported by shadcn/ui with theme integration — no extra charting library needed.
- **Two MongoDB connections**: Auth.js uses the native `mongodb` driver (via `@auth/mongodb-adapter`) for session/user data; application data uses Mongoose for schema validation and richer queries.

---

## Database Schema

### Auth Collections (managed by Auth.js MongoDB Adapter)

Auth.js automatically creates and manages these collections:

- **`users`** — User accounts (id, name, email, emailVerified, image)
- **`accounts`** — OAuth accounts linked to users (provider, providerAccountId, etc.)
- **`sessions`** — Active sessions (sessionToken, userId, expires)
- **`verification_tokens`** — Email verification tokens

> These collections are fully managed by `@auth/mongodb-adapter`. Do not modify their schema directly.

### Application Collections (managed by Mongoose)

#### `families`

```typescript
{
  _id: ObjectId,
  name: string,              // Family name
  createdAt: Date,           // Auto-managed by Mongoose timestamps
  updatedAt: Date
}
```

#### `family_members`

```typescript
{
  _id: ObjectId,
  familyId: ObjectId,        // Ref → families
  userId: ObjectId,          // Ref → users (Auth.js)
  role: 'admin' | 'member',
  displayName: string,       // Shown in the app
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `{ familyId: 1, userId: 1 }` (unique compound)

#### `categories`

```typescript
{
  _id: ObjectId,
  familyId: ObjectId,        // Ref → families
  name: string,              // e.g., "Food", "Salary"
  type: 'income' | 'expense',
  icon: string,              // Lucide icon name
  color: string,             // Hex color for charts
  isDefault: boolean,        // Seed categories
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `{ familyId: 1, type: 1 }`

#### `transactions`

```typescript
{
  _id: ObjectId,
  familyId: ObjectId,        // Ref → families
  memberId: ObjectId,        // Ref → family_members
  categoryId: ObjectId,      // Ref → categories
  type: 'income' | 'expense',
  amount: number,            // Always positive (Decimal128 for precision)
  description?: string,      // Optional note
  date: Date,                // Transaction date
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `{ familyId: 1, date: -1 }`, `{ familyId: 1, categoryId: 1 }`, `{ familyId: 1, memberId: 1 }`

#### `budgets`

```typescript
{
  _id: ObjectId,
  familyId: ObjectId,        // Ref → families
  categoryId: ObjectId,      // Ref → categories
  amount: number,            // Budget limit
  month: Date,               // First day of the month
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `{ familyId: 1, month: 1 }`, `{ familyId: 1, categoryId: 1, month: 1 }` (unique compound)

### Data Access Security

Since MongoDB does not have Row Level Security (RLS) like PostgreSQL, data isolation is enforced at the **application layer**:

- All queries include the user's `familyId` filter derived from their authenticated session.
- Server Actions validate that the current user belongs to the target family before any read/write.
- Mongoose middleware can enforce `familyId` scoping on queries automatically.
- Admin vs. member role checks are performed in Server Actions for destructive operations.

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
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts       # Auth.js route handler
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
│   ├── db.ts                      # MongoDB native client (for Auth.js adapter)
│   └── mongoose.ts                # Mongoose connection helper
├── models/                        # Mongoose models
│   ├── family.ts
│   ├── family-member.ts
│   ├── category.ts
│   ├── transaction.ts
│   └── budget.ts
├── types/
│   └── index.ts                   # Shared TypeScript types
├── hooks/                         # Custom React hooks
├── constants/                     # App constants
├── docs/
│   └── implementation-plan.md     # This file
├── auth.ts                        # Auth.js configuration
├── proxy.ts                       # Next.js 16 auth proxy (session middleware)
└── ...config files
```

---

## Implementation Phases

### Phase 1: MongoDB & Auth.js Setup

- [ ] Install `mongodb`, `mongoose`, `next-auth@beta`, `@auth/mongodb-adapter`
- [ ] Create MongoDB native client (`lib/db.ts`) for Auth.js adapter (with HMR-safe global caching)
- [ ] Create Mongoose connection helper (`lib/mongoose.ts`) for application data
- [ ] Create Auth.js config (`auth.ts`) with MongoDB adapter, Credentials provider, and Google provider
- [ ] Create Auth.js route handler (`app/api/auth/[...nextauth]/route.ts`)
- [ ] Create Next.js 16 proxy file (`proxy.ts`) for session middleware
- [ ] Create `.env.local.example` with required env vars (`MONGODB_URI`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`); update `.gitignore`
- [ ] Create Mongoose models in `models/` directory
- [ ] Create shared TypeScript types in `types/index.ts`

### Phase 2: Authentication

- [ ] Create `(auth)` route group layout (centered card)
- [ ] Build login page with email/password form + Google sign-in button
- [ ] Build sign-up page (creates user + family + member records)
- [ ] Implement Credentials provider `authorize` function (bcrypt password verification)
- [ ] Create sign-out Server Action using Auth.js `signOut`
- [ ] Protect `(app)` routes using `auth()` session check in layout

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
- [ ] Write seed script for default categories (`scripts/seed.ts`)

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

| Feature                  | Description                                                                  |
| ------------------------ | ---------------------------------------------------------------------------- |
| **User Authentication**  | Email/password + Google OAuth sign-up and login via Auth.js (NextAuth.js v5)  |
| **Family Management**    | Create a family, invite members, assign roles (admin/member)                 |
| **Transaction Tracking** | Add income and expense entries with date, amount, category, description      |
| **Categories**           | Create and manage custom income/expense categories with icons and colors     |
| **Dashboard**            | Balance overview, monthly trends, category breakdown, recent activity        |
| **Budget Goals**         | Set monthly spending limits per category with progress tracking              |
| **Transaction History**  | Searchable, filterable, paginated list of all transactions                   |
| **Dark Mode**            | Toggle between light and dark themes                                         |
| **Responsive Design**    | Works on desktop and mobile devices                                          |

---

## Verification Checklist

- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm build` completes successfully with no type errors
- [ ] Auth flow works: sign up → login → logout (Credentials + Google)
- [ ] Family member can create transactions
- [ ] Dashboard displays correct totals and charts
- [ ] Categories CRUD works
- [ ] Budget progress calculates correctly
- [ ] Data isolation: User A cannot see User B's family data (enforced by familyId scoping)
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
