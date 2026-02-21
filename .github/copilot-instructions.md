# Home Wealth - Copilot Instructions

## Project Overview

This is a personal finance management application built with Next.js 16, React 19, and TypeScript. The project helps users track and manage their home wealth and financial assets.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Runtime**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm

## Project Structure

```
home-wealth/
├── app/                      # Next.js App Router directory
│   ├── layout.tsx           # Root layout with fonts and global styles
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles and Tailwind directives
│   └── fonts/               # Local font configurations
│       └── index.ts         # Geist Sans & Geist Mono font exports
├── .github/                 # GitHub configurations
│   └── copilot-instructions.md
├── .husky/                  # Git hooks
│   ├── pre-commit          # Runs lint-staged
│   └── commit-msg          # Runs commitlint
├── public/                  # Static assets
├── *.config.*              # Configuration files
└── package.json            # Dependencies and scripts
```

## Code Standards & Tooling

### ESLint Configuration

Located in `eslint.config.mjs`, using flat config format with:

- **Next.js rules**: `eslint-config-next` for core-web-vitals and TypeScript
- **Prettier integration**: `eslint-plugin-prettier` for code formatting
- **Import sorting**: `eslint-plugin-simple-import-sort` for consistent import order
- **Unused imports**: `eslint-plugin-unused-imports` to detect and remove unused imports

**Import Order** (automatic via eslint-plugin-simple-import-sort):

1. Side effect imports (e.g., `import "./globals.css"`)
2. Node.js builtins with `node:` prefix
3. External packages (npm modules)
4. Absolute imports and path aliases (e.g., `@/components`)
5. Relative imports (e.g., `./Button`, `../utils`)

**Unused Variable Convention**:

- Variables/arguments prefixed with `_` are ignored (e.g., `_unusedVar`, `_req`)

### Prettier

- Integrated with ESLint via `eslint-plugin-prettier`
- Runs automatically on file save and during lint-staged
- 2-space indentation for consistency

### Git Workflow

**Pre-commit Hook** (`.husky/pre-commit`):

- Runs `lint-staged` on staged files
- Applies ESLint autofix (imports sorting, unused imports removal, formatting)
- Only commits if all checks pass

**Commit Message Hook** (`.husky/commit-msg`):

- Validates commit messages against Conventional Commits specification
- Uses `@commitlint/config-conventional`

**Allowed commit types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Format**: `type(optional-scope): subject`

**Examples**:

- ✅ `feat: add user authentication`
- ✅ `fix(api): handle null responses`
- ✅ `chore: update dependencies`
- ❌ `updated stuff`

### Lint-staged Configuration

Located in `lint-staged.config.js`:

- Runs on TypeScript/JavaScript files in `app/`, `lib/`, `components/`, `constants/`, `hooks/`
- Executes `pnpm lint:fix` to autofix issues

## Development Workflow

### Available Scripts

```bash
pnpm dev        # Start development server (http://localhost:3000)
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Check for linting issues
pnpm lint:fix   # Fix linting issues automatically
```

### Adding New Features

1. **Create feature branch**: Follow git-flow naming (e.g., `feat/user-profile`)
2. **Write code**: Follow TypeScript best practices and project conventions
3. **Test locally**: Run `pnpm dev` and verify changes
4. **Lint before commit**: Run `pnpm lint:fix` (or rely on pre-commit hook)
5. **Commit with conventional format**: e.g., `feat: add new feature`
6. **Hooks will run**:
   - Pre-commit: lint-staged fixes code
   - Commit-msg: commitlint validates message

## Guidelines for AI Agents

### When Reading Code

1. **Check file structure** - Understand which Next.js App Router conventions are used
2. **Review imports** - Follow the established import order pattern
3. **Identify patterns** - Look for existing component patterns before creating new ones
4. **Check types** - Ensure TypeScript types are properly defined

### When Writing Code

1. **Follow Next.js 16 conventions**:
   - Use App Router (not Pages Router)
   - Server Components by default, add `"use client"` only when needed
   - Use `app/` directory structure

2. **TypeScript**:
   - Always provide proper type annotations
   - Use `@/` path alias for imports from project root
   - Prefer interfaces over types for object shapes
   - Use strict mode (already configured)

3. **Styling**:
   - Use Tailwind CSS utility classes
   - Follow mobile-first responsive design
   - Use the configured Geist fonts via CSS variables

4. **Imports**:
   - Don't manually organize imports - let eslint-plugin-simple-import-sort handle it
   - Remove unused imports when refactoring
   - Use path aliases (`@/`) for cleaner imports

5. **Components**:
   - Place in `app/` directory (or create `components/` if needed)
   - Use TypeScript for props typing
   - Prefer composition over inheritance
   - Keep components focused and single-purpose

6. **Commit Messages**:
   - Always use conventional commit format
   - Be descriptive but concise in the subject line
   - Add body for complex changes (optional)

### Code Quality Checklist

Before suggesting code changes:

- [ ] TypeScript types are properly defined
- [ ] Code follows Next.js 16 App Router conventions
- [ ] Tailwind classes are used for styling
- [ ] Imports will be auto-sorted (don't worry about order)
- [ ] No unused variables (or prefixed with `_`)
- [ ] Follows existing patterns in the codebase
- [ ] Will pass ESLint checks

### File Creation Guidelines

**When creating new files**:

1. **Components**: Create in `app/` or `components/` directory
2. **Utilities**: Create in `lib/` directory (to be created)
3. **Types**: Co-locate with components or create in `types/` directory
4. **Hooks**: Create in `hooks/` directory (to be created)
5. **Constants**: Create in `constants/` directory (to be created)

**File naming**: Use kebab-case for files, PascalCase for components

- ✅ `user-profile.tsx` (exports `UserProfile` component)
- ✅ `use-auth.ts` (exports `useAuth` hook)
- ❌ `UserProfile.tsx`

### Common Tasks

**Adding a new page**:

```typescript
// app/about/page.tsx
export default function AboutPage() {
  return <div>About Page</div>;
}
```

**Creating a client component**:

```typescript
"use client";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

**Adding metadata**:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};
```

## Project Goals

This project aims to:

1. Help users track home assets and wealth
2. Provide financial insights and analytics
3. Maintain clean, maintainable code
4. Follow modern web development best practices
5. Ensure code quality through automated tooling

## Notes for AI Agents

- **Always run `pnpm lint:fix`** after making changes (or let pre-commit hook handle it)
- **Don't fight the linter** - if it auto-formats code differently, that's intentional
- **Ask for clarification** when requirements are ambiguous
- **Follow existing patterns** - consistency is more important than personal preference
- **Test locally** when possible before suggesting changes
- **Keep changes focused** - one feature/fix per commit when reasonable

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
