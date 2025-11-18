# Frontend Rules (Next.js App Router)

## 1. Folder Structure

**MANDATORY**: Follow this exact structure for `apps/web`:

```
apps/web/
  src/
    app/                    # Next.js App Router pages (server components by default)
      (auth)/               # Route groups
        login/
          page.tsx
        register/
          page.tsx
      dashboard/
        page.tsx
        layout.tsx
      layout.tsx            # Root layout
      page.tsx              # Home page
      globals.css           # Global styles
    components/             # React components
      ui/                   # Reusable UI components
        Button.tsx
        Input.tsx
        Card.tsx
      features/             # Feature-specific components
        user/
          UserProfile.tsx
          UserList.tsx
    services/               # API service wrappers
      api/
        user.service.ts
        auth.service.ts
    hooks/                  # Custom React hooks
      useUser.ts
      useAuth.ts
    lib/                    # Utilities
      utils.ts
      constants.ts
    types/                  # Frontend-specific types (NOT shared types)
      local.types.ts
  public/                   # Static assets
  package.json
  tsconfig.json
  tailwind.config.ts
  next.config.js
```

**Rules**:
- All pages in `src/app/` directory
- All components in `src/components/` directory
- All API calls go through `src/services/` layer
- All shared types imported from `@monorepo/shared`
- NO direct API calls in components - use services layer

## 2. Component Architecture

**MANDATORY Component Rules**:

- **Named exports only** - NO default exports
- **TypeScript strict** - All props typed, all returns typed
- **File naming** - PascalCase: `UserProfile.tsx`, `LoginForm.tsx`
- **Component structure**:
  ```tsx
  import { UserType } from "@monorepo/shared";
  
  interface UserProfileProps {
    userId: string;
    onUpdate?: (user: UserType) => void;
  }
  
  export function UserProfile({ userId, onUpdate }: UserProfileProps): JSX.Element {
    // Component logic
    return <div>...</div>;
  }
  ```

**Component Types**:
- **Server Components** (default): No `"use client"` directive
- **Client Components**: Must have `"use client"` at top
- **Server Components preferred** - Use client components only when needed

**Component Organization**:
- One component per file
- Co-locate related components in feature folders
- Extract reusable UI to `components/ui/`
- Keep components small and focused

## 3. Client vs Server Components

**Server Components (Default)**:
- NO `"use client"` directive
- Can directly access server resources (DB, APIs)
- Cannot use React hooks (`useState`, `useEffect`, etc.)
- Cannot use browser APIs
- Can import Server Components
- Cannot import Client Components directly

**Client Components**:
- MUST have `"use client"` at top of file
- Can use React hooks
- Can use browser APIs
- Can handle user interactions
- Can import other Client Components
- Can import Server Components (but they become Client boundaries)

**Rules**:
- **Prefer Server Components** - Use for data fetching, static content
- **Use Client Components** - Only for interactivity, hooks, browser APIs
- **Minimize Client Components** - Keep client boundary small
- **Server Components fetch data** - Client Components receive props

**Example**:
```tsx
// app/users/page.tsx (Server Component)
import { UserList } from "@/components/features/user/UserList";
import { getUserList } from "@/services/api/user.service";

export default async function UsersPage(): Promise<JSX.Element> {
  const users = await getUserList();
  return <UserList users={users} />;
}

// components/features/user/UserList.tsx (Client Component)
"use client";

import { UserType } from "@monorepo/shared";

interface UserListProps {
  users: UserType[];
}

export function UserList({ users }: UserListProps): JSX.Element {
  const [filtered, setFiltered] = useState(users);
  // Client-side filtering logic
  return <div>...</div>;
}
```

## 4. API Call Structure

**MANDATORY**: All API calls MUST go through services layer:

**Service Structure** (`src/services/api/`):
```typescript
// services/api/user.service.ts
import { UserType, CreateUserRequest, UserResponse } from "@monorepo/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getUserList(): Promise<UserType[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // For cookies
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  const data: UserResponse = await response.json();
  return data.users;
}

export async function createUser(request: CreateUserRequest): Promise<UserType> {
  const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create user");
  }

  const data: UserType = await response.json();
  return data;
}
```

**Rules**:
- All API calls in `src/services/api/` directory
- Use shared types from `@monorepo/shared` for requests/responses
- Handle errors properly - throw errors, don't return null
- Use `credentials: "include"` for cookie-based auth
- NO direct `fetch` calls in components
- NO direct `fetch` calls in Server Components (use services in Server Actions)

## 5. Services Layer Rules

**Service File Structure**:
- One service per domain: `user.service.ts`, `auth.service.ts`
- Named exports only: `export async function getUserList()`
- All functions MUST have explicit return types
- All functions MUST use shared types
- Error handling: Throw errors, don't return null/undefined

**Service Functions**:
- Use async/await (NO callbacks)
- Type all parameters
- Type all return values
- Handle HTTP errors
- Validate responses match expected types

**Environment Variables**:
- Use `NEXT_PUBLIC_*` prefix for client-accessible env vars
- Store API URL in `NEXT_PUBLIC_API_URL`
- NO secrets in `NEXT_PUBLIC_*` variables

## 6. Form + Validation Rules

**MANDATORY**: Use React Hook Form + Zod for all forms:

**Form Structure**:
```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateUserRequest } from "@monorepo/shared";

const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export function CreateUserForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserFormData): Promise<void> => {
    try {
      const request: CreateUserRequest = {
        email: data.email,
        name: data.name,
        password: data.password,
      };
      await createUser(request);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

**Rules**:
- Use React Hook Form for form state
- Use Zod for validation schemas
- Validate on both client and server
- Show validation errors to users
- Disable submit button while submitting
- Handle async form submission properly

## 7. UI Rules (Tailwind)

**MANDATORY**: Use Tailwind CSS for all styling:

**Tailwind Configuration**:
- Config in `tailwind.config.ts`
- Use design tokens (colors, spacing, typography)
- NO inline styles (except dynamic values)
- NO CSS modules (use Tailwind classes)
- NO styled-components (use Tailwind)

**Class Organization**:
- Use Tailwind utility classes
- Group related classes logically
- Use `@apply` sparingly (only in `globals.css`)
- Keep components responsive (mobile-first)

**Component Styling**:
```tsx
export function Button({ children, onClick }: ButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </button>
  );
}
```

**Rules**:
- NO `style` prop (except for dynamic values like `width: ${value}px`)
- Use Tailwind classes for all styling
- Keep classes readable (use line breaks for long class lists)
- Extract repeated patterns to reusable components

## 8. State Management (React Query, Zustand)

**Server State (React Query)**:
- Use React Query for server state (API data)
- Cache API responses
- Handle loading and error states
- Refetch on focus, interval, or mutation

**Client State (Zustand)**:
- Use Zustand for global client state (UI state, user preferences)
- Keep state minimal - prefer props and local state
- NO global state for server data (use React Query)

**React Query Example**:
```tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserList, createUser } from "@/services/api/user.service";
import { UserType, CreateUserRequest } from "@monorepo/shared";

export function useUsers() {
  return useQuery<UserType[]>({
    queryKey: ["users"],
    queryFn: getUserList,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

**Zustand Example**:
```tsx
// stores/ui.store.ts
import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
```

**Rules**:
- React Query for server state
- Zustand for global client state
- Local state (`useState`) for component-specific state
- NO Redux (unless explicitly required)

## 9. Error Handling

**MANDATORY**: Proper error handling in all components:

**Error Boundaries**:
- Use React Error Boundaries for component error handling
- Catch errors at appropriate levels
- Show user-friendly error messages
- Log errors to error tracking service

**API Error Handling**:
```tsx
"use client";

import { useUsers } from "@/hooks/useUser";

export function UserList(): JSX.Element {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!users) return <div>No users found</div>;

  return <div>{/* Render users */}</div>;
}
```

**Form Error Handling**:
- Show validation errors inline
- Show submission errors at form level
- Clear errors on user input
- Provide actionable error messages

**Rules**:
- Always handle loading states
- Always handle error states
- Always handle empty states
- NO unhandled promise rejections
- NO silent failures

## 10. Performance

**MANDATORY Performance Rules**:

**Code Splitting**:
- Use dynamic imports for large components
- Lazy load routes when possible
- Split vendor bundles appropriately

**Image Optimization**:
- Use Next.js `Image` component (not `<img>`)
- Provide `width` and `height` or use `fill`
- Use appropriate image formats (WebP, AVIF)

**Rendering Optimization**:
- Use `React.memo` for expensive components
- Use `useMemo` for expensive calculations
- Use `useCallback` for stable function references
- Avoid unnecessary re-renders

**Bundle Size**:
- Monitor bundle size
- Remove unused dependencies
- Use tree-shaking friendly imports
- Analyze bundle with `@next/bundle-analyzer`

**Rules**:
- NO unnecessary re-renders
- NO large bundle sizes
- Optimize images
- Use code splitting
- Monitor performance metrics

## 11. Shared Types Usage

**MANDATORY**: Use shared types from `@monorepo/shared`:

**Import Shared Types**:
```typescript
import {
  UserType,
  CreateUserRequest,
  UserResponse,
  ApiError,
} from "@monorepo/shared";
```

**Rules**:
- NO duplicate type definitions in frontend
- Import all API types from `@monorepo/shared`
- Use shared types for all API requests/responses
- Create frontend-specific types only for UI state
- Frontend-specific types in `src/types/local.types.ts`

**Type Usage**:
- Use shared types for props that receive API data
- Use shared types for service function parameters/returns
- Use shared types for form data that maps to API requests
- NO `any` types - use shared types or create proper types

## 12. Frontend AI Rules (strict)

**MANDATORY**: When using AI to generate frontend code:

1. **Always include in prompts**:
   - "Follow rules/global-rules.md and rules/frontend-rules.md"
   - "Use Next.js 14 App Router"
   - "Server Components by default, Client Components only when needed"
   - "Use shared types from @monorepo/shared"
   - "NO console.log, NO debugger, NO any types, NO default exports"
   - "Use React Hook Form + Zod for forms"
   - "Use Tailwind CSS for styling"
   - "All API calls through services layer"

2. **Component Generation**:
   - Generate Server Components by default
   - Add `"use client"` only when hooks/interactivity needed
   - Use named exports: `export function ComponentName()`
   - Type all props with interfaces
   - Type all return values

3. **Service Generation**:
   - Generate in `src/services/api/` directory
   - Use shared types for requests/responses
   - Handle errors properly
   - Use `credentials: "include"` for auth

4. **Form Generation**:
   - Use React Hook Form
   - Use Zod for validation
   - Show validation errors
   - Handle async submission

5. **Code Quality Checks**:
   - [ ] No console.log or debugger
   - [ ] No any types
   - [ ] No default exports
   - [ ] ESLint passes
   - [ ] TypeScript strict passes
   - [ ] Prettier formatted
   - [ ] Uses shared types
   - [ ] Server/Client component correct
   - [ ] API calls through services
   - [ ] Proper error handling

**Violation Consequences**:
- Pre-commit hooks will reject
- Code review will request fixes
- CI/CD will fail

