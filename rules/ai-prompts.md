# AI Prompts (Cursor, Claude, GitHub Copilot)

This document contains standardized prompt templates for generating code in this monorepo. Always use these prompts when requesting AI assistance.

## Important Rules for All Prompts

**MANDATORY**: Include these in EVERY prompt:

1. "Do NOT rewrite entire files unless explicitly asked."
2. "Follow rules/global-rules.md, rules/frontend-rules.md (for apps/web), and rules/backend-rules.md (for apps/api)."
3. "Generated code must pass ESLint, TypeScript strict mode, and Prettier."
4. "NO console.log, NO debugger, NO any types, NO default exports."
5. "Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line."
6. "Use shared types from @monorepo/shared when applicable."

---

## 1. Generate Next.js Component

**Use for**: Creating new React components in `apps/web/src/components/`

**Template**:
```
Generate a Next.js component for [component name] that [description].

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/frontend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Component location: apps/web/src/components/[folder]/[ComponentName].tsx
- Use named export: export function ComponentName()
- Type all props with an interface
- Type return value: JSX.Element
- [Server Component / Client Component] - [add "use client" if client component]
- Use Tailwind CSS for styling
- Use shared types from @monorepo/shared: [list types if applicable]
- [Additional specific requirements]
```

**Example**:
```
Generate a Next.js component for UserProfile that displays user information.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/frontend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Component location: apps/web/src/components/features/user/UserProfile.tsx
- Use named export: export function UserProfile()
- Type all props with an interface
- Type return value: JSX.Element
- Client Component - add "use client" directive
- Use Tailwind CSS for styling
- Use shared types from @monorepo/shared: UserType
- Props: userId (string), onUpdate callback (optional)
- Display user name, email, and avatar
```

---

## 2. Generate Next.js Container + Hook

**Use for**: Creating container components with custom hooks for data fetching

**Template**:
```
Generate a Next.js container component and custom hook for [feature name].

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/frontend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Container location: apps/web/src/components/features/[feature]/[FeatureName]Container.tsx
- Hook location: apps/web/src/hooks/use[FeatureName].ts
- Use React Query for data fetching
- Use shared types from @monorepo/shared: [list types]
- Hook should return: { data, isLoading, error, refetch }
- Container should handle loading and error states
- [Additional specific requirements]
```

**Example**:
```
Generate a Next.js container component and custom hook for user list.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/frontend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Container location: apps/web/src/components/features/user/UserListContainer.tsx
- Hook location: apps/web/src/hooks/useUsers.ts
- Use React Query for data fetching
- Use shared types from @monorepo/shared: UserType, UserListResponse
- Hook should call getUserList from services/api/user.service.ts
- Hook should return: { data: UserType[], isLoading: boolean, error: Error | null, refetch: () => void }
- Container should display loading state, error state, and user list
```

---

## 3. Generate Service API Wrapper

**Use for**: Creating API service functions in `apps/web/src/services/api/`

**Template**:
```
Generate an API service wrapper for [resource name] in apps/web/src/services/api/[resource].service.ts.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/frontend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Use shared types from @monorepo/shared: [list request/response types]
- All functions must be async and return typed promises
- Use fetch with credentials: "include" for cookie-based auth
- Handle errors properly - throw errors, don't return null
- API base URL: process.env.NEXT_PUBLIC_API_URL
- API version: /api/v1/
- Functions to generate: [list functions: getList, getOne, create, update, delete]
- [Additional specific requirements]
```

**Example**:
```
Generate an API service wrapper for users in apps/web/src/services/api/user.service.ts.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/frontend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Use shared types from @monorepo/shared: UserType, CreateUserRequest, UpdateUserRequest, UserResponse
- All functions must be async and return typed promises
- Use fetch with credentials: "include" for cookie-based auth
- Handle errors properly - throw errors, don't return null
- API base URL: process.env.NEXT_PUBLIC_API_URL
- API version: /api/v1/
- Functions to generate: getUserList, getUserById, createUser, updateUser, deleteUser
```

---

## 4. Generate Form (RHF + Zod)

**Use for**: Creating forms with React Hook Form and Zod validation

**Template**:
```
Generate a form component using React Hook Form and Zod for [form name].

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/frontend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Component location: apps/web/src/components/features/[feature]/[FormName]Form.tsx
- Use React Hook Form with zodResolver
- Create Zod schema for validation
- Use shared types from @monorepo/shared: [list types]
- Form fields: [list fields with validation rules]
- Show validation errors inline
- Disable submit button while submitting
- Handle async submission
- Call service function: [service function name]
- [Additional specific requirements]
```

**Example**:
```
Generate a form component using React Hook Form and Zod for user registration.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/frontend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Component location: apps/web/src/components/features/auth/RegisterForm.tsx
- Use React Hook Form with zodResolver
- Create Zod schema for validation
- Use shared types from @monorepo/shared: CreateUserRequest
- Form fields: email (required, valid email), name (required, min 1 char), password (required, min 8 chars), confirmPassword (must match password)
- Show validation errors inline
- Disable submit button while submitting
- Handle async submission
- Call service function: createUser from services/api/user.service.ts
- Redirect to login page on success
```

---

## 5. Generate Nest.js Module

**Use for**: Creating new Nest.js modules in `apps/api/src/modules/`

**Template**:
```
Generate a Nest.js module for [module name] in apps/api/src/modules/[module-name]/.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/backend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Generate files: [module-name].module.ts, [module-name].controller.ts, [module-name].service.ts
- Use shared types from @monorepo/shared: [list types]
- Controller route: /api/v1/[resource]
- DTOs in dto/ subdirectory
- Use class-validator for DTO validation
- Use JWT auth guard (apply at controller level, use @Public() for public endpoints)
- Use Winston for logging (NestJS Logger, not console)
- [Additional specific requirements]
```

**Example**:
```
Generate a Nest.js module for users in apps/api/src/modules/user/.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/backend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Generate files: user.module.ts, user.controller.ts, user.service.ts
- Use shared types from @monorepo/shared: UserType, CreateUserRequest, UpdateUserRequest, UserResponse
- Controller route: /api/v1/users
- DTOs in dto/ subdirectory: create-user.dto.ts, update-user.dto.ts, user-response.dto.ts
- Use class-validator for DTO validation
- Use JWT auth guard (apply at controller level, use @Public() for POST /api/v1/users)
- Use Winston for logging (NestJS Logger, not console)
- CRUD operations: GET / (list), GET /:id (one), POST / (create), PUT /:id (update), DELETE /:id (delete)
```

---

## 6. Generate Nest.js Controller + DTOs

**Use for**: Creating controllers and DTOs for existing modules

**Template**:
```
Generate a Nest.js controller and DTOs for [resource name] in apps/api/src/modules/[module-name]/.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/backend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Controller location: [module-name].controller.ts
- DTOs location: dto/ subdirectory
- Use shared types from @monorepo/shared: [list types]
- Controller route: /api/v1/[resource]
- DTOs: create-[resource].dto.ts, update-[resource].dto.ts, [resource]-response.dto.ts
- Use class-validator decorators: @IsEmail, @IsString, @MinLength, etc.
- DTOs implement shared types
- Controller methods: [list methods with HTTP verbs]
- Apply JWT guard at controller level
- Use @Public() for public endpoints
- Type all method return values
- [Additional specific requirements]
```

**Example**:
```
Generate a Nest.js controller and DTOs for products in apps/api/src/modules/product/.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/backend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Controller location: product.controller.ts
- DTOs location: dto/ subdirectory
- Use shared types from @monorepo/shared: ProductType, CreateProductRequest, UpdateProductRequest, ProductResponse
- Controller route: /api/v1/products
- DTOs: create-product.dto.ts, update-product.dto.ts, product-response.dto.ts
- Use class-validator decorators: @IsString, @IsNumber, @Min, @Max, @IsOptional
- DTOs implement shared types
- Controller methods: GET / (findAll), GET /:id (findOne), POST / (create), PUT /:id (update), DELETE /:id (remove)
- Apply JWT guard at controller level
- All endpoints protected except GET / (public)
- Type all method return values
```

---

## 7. Generate Prisma Model

**Use for**: Creating Prisma schema models (if using Prisma)

**Template**:
```
Generate a Prisma model for [model name] in apps/api/prisma/schema.prisma.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/backend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Model name: [ModelName] (PascalCase)
- Fields: [list fields with types and constraints]
- Relations: [list relations if applicable]
- Use soft delete: deletedAt DateTime? @map("deleted_at")
- Include timestamps: createdAt DateTime @default(now()) @map("created_at"), updatedAt DateTime @updatedAt @map("updated_at")
- Use snake_case for database column names
- Add indexes for frequently queried fields
- [Additional specific requirements]
```

**Example**:
```
Generate a Prisma model for users in apps/api/prisma/schema.prisma.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/backend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Model name: User (PascalCase)
- Fields: id String @id @default(uuid()), email String @unique, name String, passwordHash String @map("password_hash"), role String @default("user")
- Relations: none
- Use soft delete: deletedAt DateTime? @map("deleted_at")
- Include timestamps: createdAt DateTime @default(now()) @map("created_at"), updatedAt DateTime @updatedAt @map("updated_at")
- Use snake_case for database column names
- Add indexes: @@index([email]), @@index([deletedAt])
```

---

## 8. Generate Shared Types

**Use for**: Creating shared TypeScript types in `packages/shared/src/types/`

**Template**:
```
Generate shared TypeScript types for [domain] in packages/shared/src/types/[domain].types.ts.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- File location: packages/shared/src/types/[domain].types.ts
- Export all types as named exports
- Types to generate: [list types with descriptions]
- Use proper TypeScript types (no any)
- Add JSDoc comments for complex types
- Export from packages/shared/src/index.ts
- [Additional specific requirements]
```

**Example**:
```
Generate shared TypeScript types for users in packages/shared/src/types/user.types.ts.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- File location: packages/shared/src/types/user.types.ts
- Export all types as named exports
- Types to generate: UserType (id, email, name, role, createdAt, updatedAt), CreateUserRequest (email, name, password), UpdateUserRequest (partial of CreateUserRequest), UserResponse (same as UserType)
- Use proper TypeScript types (no any)
- Add JSDoc comments for complex types
- Export from packages/shared/src/index.ts
```

---

## 9. Generate Unit Tests (FE + BE)

**Use for**: Creating unit tests for components, services, or controllers

**Template**:
```
Generate unit tests for [component/service/controller name] in [file path].

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and [frontend-rules.md / backend-rules.md].
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Test file location: [component/service/controller].spec.ts
- Use [Jest / Vitest / React Testing Library] for testing
- Test cases: [list test cases to cover]
- Mock external dependencies
- Test both success and error cases
- [Additional specific requirements]
```

**Example (Frontend)**:
```
Generate unit tests for UserProfile component in apps/web/src/components/features/user/UserProfile.spec.tsx.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/frontend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Test file location: UserProfile.spec.tsx
- Use Jest and React Testing Library for testing
- Test cases: renders user information, calls onUpdate when update button clicked, displays loading state, handles error state
- Mock useUser hook
- Test both success and error cases
```

**Example (Backend)**:
```
Generate unit tests for UserService in apps/api/src/modules/user/user.service.spec.ts.

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md and rules/backend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.
- Test file location: user.service.spec.ts
- Use Jest and @nestjs/testing for testing
- Test cases: findAll returns users, findOne returns user, findOne throws NotFoundException if not found, create creates user, update updates user, remove deletes user
- Mock PrismaService
- Test both success and error cases
```

---

## 10. Full Feature Scaffolding Prompt

**Use for**: Creating a complete feature (frontend + backend + shared types)

**Template**:
```
Generate a complete feature for [feature name] including:
1. Shared types in packages/shared/src/types/[feature].types.ts
2. Backend module in apps/api/src/modules/[feature]/
3. Frontend components in apps/web/src/components/features/[feature]/
4. Frontend services in apps/web/src/services/api/[feature].service.ts
5. Frontend hooks in apps/web/src/hooks/use[Feature].ts

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md, rules/frontend-rules.md, and rules/backend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.

Feature requirements:
- [Describe feature functionality]
- API endpoints: [list endpoints]
- Frontend pages: [list pages]
- Forms: [list forms]
- [Additional specific requirements]

Generate all files in the correct locations with proper imports and type usage.
```

**Example**:
```
Generate a complete feature for user management including:
1. Shared types in packages/shared/src/types/user.types.ts
2. Backend module in apps/api/src/modules/user/
3. Frontend components in apps/web/src/components/features/user/
4. Frontend services in apps/web/src/services/api/user.service.ts
5. Frontend hooks in apps/web/src/hooks/useUsers.ts

Requirements:
- Do NOT rewrite entire files unless explicitly asked.
- Follow rules/global-rules.md, rules/frontend-rules.md, and rules/backend-rules.md.
- Generated code must pass ESLint, TypeScript strict mode, and Prettier.
- NO console.log, NO debugger, NO any types, NO default exports.
- Use double quotes, semicolons, 2-space indent, trailing commas, max 120 characters per line.

Feature requirements:
- CRUD operations for users
- API endpoints: GET /api/v1/users, GET /api/v1/users/:id, POST /api/v1/users, PUT /api/v1/users/:id, DELETE /api/v1/users/:id
- Frontend pages: /users (list), /users/:id (detail), /users/new (create), /users/:id/edit (edit)
- Forms: CreateUserForm, UpdateUserForm
- Authentication: All endpoints protected except POST /api/v1/users (registration)
- Validation: email (required, valid), name (required), password (required, min 8 chars)

Generate all files in the correct locations with proper imports and type usage.
```

---

## Prompt Best Practices

1. **Be Specific**: Include exact file paths, function names, and requirements
2. **Reference Rules**: Always mention the rule files
3. **List Types**: Specify which shared types to use
4. **Include Examples**: Provide examples when possible
5. **Iterate**: Start with one file, then expand if needed
6. **Verify**: Always check generated code against rules before committing

## Common Mistakes to Avoid

- ❌ Forgetting to include rule file references
- ❌ Not specifying file locations
- ❌ Using `any` types
- ❌ Using default exports
- ❌ Forgetting to use shared types
- ❌ Not handling errors properly
- ❌ Using console.log instead of proper logging
- ❌ Not following formatting standards

