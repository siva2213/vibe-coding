# Global Rules (Monorepo)

## 1. Purpose

This monorepo contains:
- **apps/web**: Next.js 14 App Router frontend application
- **apps/api**: Nest.js backend API application
- **packages/shared**: Shared TypeScript types and utilities

All code MUST follow these global rules. Violations will be caught by pre-commit hooks and CI/CD pipelines.

## 2. Formatting Standards

**MANDATORY**: All code MUST be formatted with Prettier using these exact settings:

- **Double quotes** (`"`) for strings - NO single quotes
- **Semicolons required** - Every statement MUST end with `;`
- **2-space indent** - NO tabs, NO 4 spaces
- **Trailing commas always** - In arrays, objects, function parameters, imports
- **Max line width 120 characters** - Break lines at 120 chars, not 80

**Prettier Config**:
```json
{
  "singleQuote": false,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 120
}
```

**Enforcement**:
- Pre-commit hook runs `prettier --check`
- All files MUST pass Prettier before commit
- Run `npm run format` to auto-fix formatting issues

## 3. TypeScript Standards

**MANDATORY**: TypeScript strict mode is ENABLED. All code MUST:

- Use TypeScript strict mode (`strict: true`)
- NO `any` types - Use `unknown` or proper types
- NO implicit `any` - All variables MUST have explicit types
- Explicit return types required - All functions MUST declare return types
- NO unused variables or parameters (prefix with `_` if intentionally unused)
- NO unused imports - ESLint will error on unused imports
- NO `@ts-ignore` or `@ts-nocheck` - Fix type errors properly

**TypeScript Config Requirements**:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `forceConsistentCasingInFileNames: true`

**Default Exports FORBIDDEN**:
- NO default exports in any file
- Use named exports only: `export { MyClass }` or `export class MyClass`
- Import with: `import { MyClass } from "./file"`

## 4. ESLint Strict Rules

**MANDATORY**: All code MUST pass ESLint with these strict rules:

- **NO `console.log`** - Use proper logging (Winston for backend, logger utility for frontend)
- **NO `console.error`** - Use proper error handling
- **NO `console.warn`** - Use proper logging
- **NO `debugger` statements** - Remove all debugger statements
- **NO `any` types** - `@typescript-eslint/no-explicit-any: error`
- **Explicit module boundary types** - `@typescript-eslint/explicit-module-boundary-types: error`
- **Unused imports removed** - `unused-imports/no-unused-imports: error`
- **Unused variables removed** - `@typescript-eslint/no-unused-vars: error`
- **Double quotes enforced** - `quotes: ["error", "double"]`
- **Semicolons enforced** - `semi: ["error", "always"]`
- **2-space indent enforced** - `indent: ["error", 2]`

**Enforcement**:
- Pre-commit hook runs ESLint
- All files MUST pass ESLint before commit
- Run `npm run lint` to check and auto-fix issues

## 5. Folder + File Naming

**File Naming**:
- **kebab-case** for files: `user-service.ts`, `auth-controller.ts`
- **PascalCase** for React components: `UserProfile.tsx`, `LoginForm.tsx`
- **camelCase** for utilities: `formatDate.ts`, `validateEmail.ts`
- **UPPER_CASE** for constants: `API_ENDPOINTS.ts`, `ERROR_CODES.ts`

**Folder Naming**:
- **kebab-case** for folders: `user-management/`, `api-services/`
- **NO spaces** in folder names
- **NO special characters** except hyphens

**Structure**:
```
apps/
  web/
    src/
      app/          # Next.js App Router pages
      components/   # React components
      services/     # API service wrappers
      hooks/        # Custom React hooks
      lib/          # Utilities
  api/
    src/
      modules/      # Nest.js modules
      controllers/  # Nest.js controllers
      services/     # Nest.js services
      dto/          # Data Transfer Objects
      entities/     # Database entities
packages/
  shared/
    src/
      types/        # Shared TypeScript types
      utils/        # Shared utilities
```

## 6. Shared Types Rules

**MANDATORY**: All shared types MUST be in `packages/shared`:

- API request/response types go in `packages/shared/src/types/`
- Database entity types go in `packages/shared/src/types/`
- Common utility types go in `packages/shared/src/types/`
- NO duplicate type definitions across apps
- Import shared types: `import { UserType } from "@monorepo/shared"`
- Shared package MUST build before apps build (Turbo dependency)

**Shared Types Structure**:
```
packages/shared/src/
  types/
    user.types.ts
    api.types.ts
    common.types.ts
  index.ts  # Re-export all types
```

**Rules**:
- Export all types from `packages/shared/src/index.ts`
- Use descriptive type names: `UserResponse`, `CreateUserRequest`
- NO `any` types in shared types
- Document complex types with JSDoc comments

## 7. Git Standards

**Branch Naming**:
- Feature: `feature/user-authentication`
- Bugfix: `bugfix/login-error`
- Hotfix: `hotfix/critical-security-patch`
- Refactor: `refactor/api-structure`

**Commit Messages**:
- Use conventional commits format
- Format: `type(scope): description`
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- Example: `feat(web): add user profile page`

**NO Commits**:
- NO commits with `console.log` or `debugger`
- NO commits with ESLint errors
- NO commits with TypeScript errors
- NO commits with Prettier formatting issues
- NO commits with `any` types
- NO commits with default exports

## 8. Pre-commit & Pre-push Rules (Husky)

**Pre-commit Hook** (runs on `git commit`):
1. **Lint-staged** runs on staged files:
   - ESLint check and auto-fix
   - Prettier check and auto-fix
   - TypeScript type check (if applicable)
2. **NO commit if**:
   - ESLint errors remain
   - Prettier formatting fails
   - TypeScript errors exist

**Pre-push Hook** (runs on `git push`):
1. **Full type check**: `npm run type-check`
2. **Full lint check**: `npm run lint`
3. **NO push if**:
   - Type errors exist
   - Lint errors exist

**Husky Configuration**:
- Husky installed at root: `npm run prepare`
- Hooks in `.husky/` directory
- All hooks MUST pass before commit/push

## 9. API Contract Rules

**MANDATORY**: API contracts MUST be defined in shared types:

- Request types: `CreateUserRequest`, `UpdateUserRequest`
- Response types: `UserResponse`, `UserListResponse`
- Error types: `ApiError`, `ValidationError`
- All API contracts in `packages/shared/src/types/api.types.ts`
- NO inline type definitions in API calls
- Version API endpoints: `/api/v1/users`, `/api/v2/users`

**API Versioning**:
- Use URL versioning: `/api/v1/`, `/api/v2/`
- Document breaking changes
- Maintain backward compatibility when possible

**Error Handling**:
- All API errors MUST have consistent structure
- Use shared error types from `packages/shared`
- Return proper HTTP status codes
- Include error messages and error codes

## 10. Security Rules

**MANDATORY Security Practices**:

- **NO secrets in code** - Use environment variables
- **NO API keys in commits** - Use `.env.local` (gitignored)
- **Validate all inputs** - Use DTOs with class-validator (backend)
- **Sanitize user inputs** - Prevent XSS, SQL injection
- **Use HTTPS** - NO HTTP in production
- **JWT tokens** - Store in httpOnly cookies (frontend)
- **CORS configured** - Restrict origins in production
- **Rate limiting** - Implement on all public endpoints

**Environment Variables**:
- Use `.env.local` for local development (gitignored)
- Use `.env.example` as template (committed)
- NO secrets in `.env.example` - Use placeholder values
- Document all required env vars in README

## 11. Logging Rules

**MANDATORY**: NO `console.log`, `console.error`, `console.warn`:

**Backend (apps/api)**:
- Use Winston logger
- Log levels: `error`, `warn`, `info`, `debug`
- Log format: JSON in production, readable in development
- Include request ID, user ID, timestamp in logs

**Frontend (apps/web)**:
- Use logger utility (create if missing)
- Log to external service (Sentry, LogRocket) in production
- NO console statements in production code
- Use proper error boundaries for error logging

**Logging Best Practices**:
- Log errors with context
- Log important business events
- NO sensitive data in logs (passwords, tokens, PII)
- Use structured logging format

## 12. AI Coding Rules (Cursor, VS Code, Replit, Claude)

**MANDATORY**: When using AI assistants (Cursor, Claude, GitHub Copilot):

1. **Always reference these rules**:
   - "Follow rules/global-rules.md"
   - "Follow rules/frontend-rules.md" (for apps/web)
   - "Follow rules/backend-rules.md" (for apps/api)

2. **Always include in prompts**:
   - "Do NOT rewrite entire files unless explicitly asked"
   - "Use TypeScript strict mode"
   - "NO console.log, NO debugger, NO any types"
   - "NO default exports"
   - "Use double quotes, semicolons, 2-space indent, trailing commas"
   - "Max line width 120 characters"
   - "Generated code must pass ESLint, TypeScript strict, Prettier"

3. **Code Generation Requirements**:
   - All generated code MUST pass ESLint
   - All generated code MUST pass TypeScript strict checks
   - All generated code MUST be Prettier-formatted
   - All generated code MUST use shared types from `@monorepo/shared`
   - All generated code MUST follow folder structure rules

4. **AI Prompt Templates**:
   - Use templates from `rules/ai-prompts.md`
   - Include rule references in all prompts
   - Verify generated code against all rules

5. **Code Review Checklist**:
   - [ ] No console.log or debugger
   - [ ] No any types
   - [ ] No default exports
   - [ ] ESLint passes
   - [ ] TypeScript strict passes
   - [ ] Prettier formatted
   - [ ] Uses shared types
   - [ ] Follows folder structure
   - [ ] Proper error handling
   - [ ] Proper logging (not console)

**Violation Consequences**:
- Pre-commit hooks will reject commits with violations
- CI/CD pipeline will fail on violations
- Code reviews will request fixes before merge

