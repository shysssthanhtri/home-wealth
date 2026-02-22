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
| ORM             | Prisma (v6)                                    |
| Charts          | Recharts (via shadcn/ui Chart)                 |
| Package Manager | pnpm                                           |

---

## Architecture Decisions

- **MongoDB Atlas**: Managed NoSQL database with low latency, flexible schema, and a generous free tier — ideal for a family app deployed on Vercel.
- **Auth.js (NextAuth.js v5)**: Supports multiple authentication strategies (Credentials + Google OAuth) with the Prisma adapter (`@auth/prisma-adapter`). Handles session management, CSRF protection, and JWT out of the box.
- **Prisma ORM (v6)**: Type-safe database client with auto-generated types from the schema, intuitive query API, and first-class MongoDB support. Single data layer for both Auth.js and application data.
- **Route groups `(auth)` and `(app)`**: Separate layouts for authenticated/unauthenticated pages without affecting URL paths.
- **Server Actions over API Routes**: Next.js 16 pattern for mutations — simpler, type-safe, and SSR-friendly.
- **Server Components by default**: All pages fetch data server-side; only interactive elements (forms, dialogs, charts) use `"use client"`.
- **shadcn Chart (Recharts)**: Already supported by shadcn/ui with theme integration — no extra charting library needed.
- **Single Prisma connection**: Both Auth.js (via `@auth/prisma-adapter`) and application data share the same Prisma Client instance — simpler architecture, one schema file, fully type-safe.

---

## Database Schema (Prisma)

All models are defined in `prisma/schema.prisma`. Prisma generates the TypeScript client and types automatically via `prisma generate`.

### Prisma Schema

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

// ─── Auth.js Models (managed by @auth/prisma-adapter) ───

model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Hashed password for Credentials provider
  accounts      Account[]
  sessions      Session[]
  members       FamilyMember[]
}

model Account {
  id                String  @id @default(auto()) @map("_id") @db.ObjectId
  userId            String  @db.ObjectId
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  sessionToken String   @unique
  userId       String   @db.ObjectId
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Application Models ───

model Family {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members      FamilyMember[]
  categories   Category[]
  transactions Transaction[]
  budgets      Budget[]
}

model FamilyMember {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  familyId    String   @db.ObjectId
  userId      String   @db.ObjectId
  role        String   // 'admin' | 'member'
  displayName String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  family       Family        @relation(fields: [familyId], references: [id], onDelete: Cascade)
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@unique([familyId, userId])
}

model Category {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  familyId  String   @db.ObjectId
  name      String
  type      String   // 'income' | 'expense'
  icon      String   // Lucide icon name
  color     String   // Hex color for charts
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  family       Family        @relation(fields: [familyId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  budgets      Budget[]

  @@index([familyId, type])
}

model Transaction {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  familyId    String   @db.ObjectId
  memberId    String   @db.ObjectId
  categoryId  String   @db.ObjectId
  type        String   // 'income' | 'expense'
  amount      Float    // Always positive
  description String?
  date        DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  family   Family       @relation(fields: [familyId], references: [id], onDelete: Cascade)
  member   FamilyMember @relation(fields: [memberId], references: [id], onDelete: Cascade)
  category Category     @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@index([familyId, date(sort: Desc)])
  @@index([familyId, categoryId])
  @@index([familyId, memberId])
}

model Budget {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  familyId   String   @db.ObjectId
  categoryId String   @db.ObjectId
  amount     Float
  month      DateTime // First day of the month
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  family   Family   @relation(fields: [familyId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([familyId, categoryId, month])
  @@index([familyId, month])
}
```

### Schema Workflow

- **Push schema to MongoDB**: `pnpm prisma db push` (no migration files for MongoDB)
- **Generate client**: `pnpm prisma generate` (auto-runs after `db push`)
- **Seed data**: `pnpm prisma db seed` (configured in `package.json`)

### Data Access Security

Since MongoDB does not have Row Level Security (RLS) like PostgreSQL, data isolation is enforced at the **application layer**:

- All Prisma queries include the user's `familyId` filter derived from their authenticated session.
- Server Actions validate that the current user belongs to the target family before any read/write.
- A shared `getSessionFamily()` helper extracts the family context from the Auth.js session.
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
│   └── prisma.ts                  # Prisma Client singleton (HMR-safe)
├── prisma/
│   ├── schema.prisma              # Prisma schema (all models)
│   └── seed.ts                    # Database seed script
├── generated/
│   └── prisma/                    # Auto-generated Prisma Client (gitignored)
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

### Phase 1: Prisma, MongoDB & Auth.js Setup

- [ ] Install `prisma@6` (dev), `@prisma/client@6`, `next-auth@beta`, `@auth/prisma-adapter`
- [ ] Initialize Prisma: `pnpm prisma init --datasource-provider mongodb --output ../generated/prisma`
- [ ] Define all models in `prisma/schema.prisma` (Auth.js + application models)
- [ ] Create Prisma Client singleton (`lib/prisma.ts`) with HMR-safe global caching
- [ ] Push schema to MongoDB: `pnpm prisma db push`
- [ ] Create Auth.js config (`auth.ts`) with Prisma adapter, Credentials provider, and Google provider
- [ ] Create Auth.js route handler (`app/api/auth/[...nextauth]/route.ts`)
- [ ] Create Next.js 16 proxy file (`proxy.ts`) for session middleware
- [ ] Create `.env.local.example` with required env vars (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`); update `.gitignore`
- [ ] Add `generated/` to `.gitignore`
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
- [ ] Write Prisma seed script for default categories (`prisma/seed.ts`)

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
