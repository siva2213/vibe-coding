# Backend Rules (Nest.js)

## 1. Module Structure

**MANDATORY**: Follow Nest.js module structure for `apps/api`:

```
apps/api/
  src/
    modules/
      user/
        user.module.ts
        user.controller.ts
        user.service.ts
        dto/
          create-user.dto.ts
          update-user.dto.ts
          user-response.dto.ts
      auth/
        auth.module.ts
        auth.controller.ts
        auth.service.ts
        strategies/
          jwt.strategy.ts
    common/
      filters/
        http-exception.filter.ts
      interceptors/
        logging.interceptor.ts
      guards/
        jwt-auth.guard.ts
      decorators/
        public.decorator.ts
    config/
      database.config.ts
      app.config.ts
    main.ts
```

**Module Rules**:
- One module per domain: `UserModule`, `AuthModule`
- Module file: `user.module.ts`
- Controller file: `user.controller.ts`
- Service file: `user.service.ts`
- DTOs in `dto/` subdirectory
- Import shared types from `@monorepo/shared`

**Module Structure**:
```typescript
// user.module.ts
import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export if used by other modules
})
export class UserModule {}
```

**Rules**:
- Each module in its own folder
- Module declares controllers and providers
- Export services used by other modules
- Import other modules as needed
- NO circular dependencies

## 2. Controller Rules

**MANDATORY**: All controllers MUST follow these rules:

**Controller Structure**:
```typescript
// user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { Public } from "../common/decorators/public.decorator";

@Controller("api/v1/users")
@UseGuards(JwtAuthGuard) // Apply guard at controller level
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public() // Override guard for public endpoints
  @Get()
  async findAll(@Query() query: any): Promise<UserResponseDto[]> {
    return this.userService.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
```

**Controller Rules**:
- Use `@Controller("api/v1/resource")` with version prefix
- All methods MUST have explicit return types
- Use DTOs for request bodies (`@Body()`)
- Use DTOs for responses (typed return)
- Apply guards at controller or method level
- Use `@HttpCode()` for non-200 status codes
- Use `@Public()` decorator to override guards
- NO `any` types in parameters or returns
- Inject services via constructor

**Route Naming**:
- RESTful routes: `GET /api/v1/users`, `POST /api/v1/users`
- Resource-based: `/api/v1/users/:id`
- NO verbs in URLs: `/api/v1/getUsers` ❌, `/api/v1/users` ✅

## 3. Service Rules

**MANDATORY**: All services MUST follow these rules:

**Service Structure**:
```typescript
// user.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { UserType } from "@monorepo/shared";

@Injectable()
export class UserService {
  constructor(
    // Inject repositories, other services, etc.
  ) {}

  async findAll(query?: any): Promise<UserResponseDto[]> {
    // Business logic
    const users: UserType[] = []; // Fetch from DB
    return users.map((user) => this.toResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Validation handled by DTO
    // Business logic
    const user = await this.saveUser(createUserDto);
    return this.toResponseDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Update logic
    const updated = await this.saveUser({ ...user, ...updateUserDto });
    return this.toResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.deleteUser(id);
  }

  private toResponseDto(user: UserType): UserResponseDto {
    // Map entity to DTO
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      // Exclude sensitive fields
    };
  }
}
```

**Service Rules**:
- Use `@Injectable()` decorator
- All methods MUST have explicit return types
- Throw NestJS exceptions: `NotFoundException`, `BadRequestException`, etc.
- Use private methods for internal logic
- Map entities to DTOs in response methods
- NO business logic in controllers - move to services
- NO direct database access in controllers - use services
- Inject dependencies via constructor

**Error Handling**:
- Use NestJS built-in exceptions
- Throw appropriate HTTP exceptions
- Include meaningful error messages
- Log errors (using Winston, not console)

## 4. DTO Rules (class-validator)

**MANDATORY**: All DTOs MUST use class-validator:

**DTO Structure**:
```typescript
// dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";
import { CreateUserRequest } from "@monorepo/shared";

export class CreateUserDto implements CreateUserRequest {
  @IsEmail({}, { message: "Invalid email address" })
  email: string;

  @IsString()
  @MinLength(1, { message: "Name is required" })
  name: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  password: string;
}

// dto/update-user.dto.ts
import { IsOptional, IsString, IsEmail, MinLength } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}

// dto/user-response.dto.ts
import { UserType } from "@monorepo/shared";

export class UserResponseDto implements UserType {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**DTO Rules**:
- Use `class-validator` decorators for validation
- Implement shared types from `@monorepo/shared`
- Request DTOs: Validate input data
- Response DTOs: Define output structure
- Use `PartialType` for update DTOs
- Include validation messages
- NO `any` types in DTOs

**Validation**:
- Enable global validation pipe in `main.ts`
- Use `ValidationPipe` with `whitelist: true`
- Reject unknown properties
- Transform payloads to DTOs automatically

**Main.ts Setup**:
```typescript
import { ValidationPipe } from "@nestjs/common";

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

## 5. Error Handling

**MANDATORY**: Proper error handling throughout:

**Exception Filters**:
```typescript
// common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { Logger } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${JSON.stringify(message)}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

**Error Handling Rules**:
- Use NestJS built-in exceptions
- Create custom exception filters for global handling
- Log all errors (Winston, not console)
- Return consistent error response format
- Include error codes for client handling
- NO unhandled exceptions

**Exception Types**:
- `BadRequestException` - 400
- `UnauthorizedException` - 401
- `ForbiddenException` - 403
- `NotFoundException` - 404
- `ConflictException` - 409
- `InternalServerErrorException` - 500

## 6. Logging (Winston)

**MANDATORY**: Use Winston for all logging (NO console.log):

**Winston Setup**:
```typescript
// config/logger.config.ts
import { WinstonModule } from "nest-winston";
import * as winston from "winston";

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return `${timestamp} [${context}] ${level}: ${message}`;
        }),
      ),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: winston.format.json(),
    }),
  ],
});
```

**Logging Usage**:
```typescript
import { Logger } from "@nestjs/common";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    try {
      // Business logic
      this.logger.log(`User created successfully: ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

**Logging Rules**:
- NO `console.log`, `console.error`, `console.warn`
- Use NestJS `Logger` (wraps Winston)
- Log levels: `log`, `error`, `warn`, `debug`, `verbose`
- Include context in logs (service name, request ID)
- Log errors with stack traces
- NO sensitive data in logs (passwords, tokens, PII)

## 7. Auth (JWT)

**MANDATORY**: JWT authentication setup:

**JWT Strategy**:
```typescript
// auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request) => request?.cookies?.accessToken, // Cookie fallback
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<any> {
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

**JWT Guard**:
```typescript
// common/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
```

**Public Decorator**:
```typescript
// common/decorators/public.decorator.ts
import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**Auth Rules**:
- Use JWT for authentication
- Store JWT in httpOnly cookies (preferred) or Authorization header
- Use guards to protect routes
- Use `@Public()` decorator for public endpoints
- Validate JWT on every protected request
- Refresh tokens for long-lived sessions

## 8. API Versioning

**MANDATORY**: Version all API endpoints:

**Versioning Strategy**:
- URL versioning: `/api/v1/users`, `/api/v2/users`
- Controller-level: `@Controller("api/v1/users")`
- NO query parameter versioning
- NO header versioning

**Version Rules**:
- Start with `v1` for new APIs
- Increment version for breaking changes
- Maintain backward compatibility when possible
- Document breaking changes
- Deprecate old versions before removal

**Controller Versioning**:
```typescript
@Controller("api/v1/users") // Version in controller decorator
export class UserController {
  // All routes inherit /api/v1/users prefix
}
```

## 9. Prisma/DB Standards

**MANDATORY**: Database access rules (if using Prisma):

**Prisma Setup**:
- Schema in `prisma/schema.prisma`
- Migrations in `prisma/migrations/`
- Prisma Client generated to `@prisma/client`

**Service Pattern**:
```typescript
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UserType[]> {
    return this.prisma.user.findMany({
      where: { deletedAt: null }, // Soft delete
      select: {
        id: true,
        email: true,
        name: true,
        // Exclude sensitive fields
      },
    });
  }
}
```

**Database Rules**:
- Use Prisma Service (injectable)
- Use transactions for multi-step operations
- Handle database errors properly
- Use soft deletes (deletedAt) when appropriate
- NO raw SQL unless necessary
- Index frequently queried fields
- Validate data before database operations

## 10. Shared Types Rules

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

**Type Usage**:
- DTOs implement shared types: `class CreateUserDto implements CreateUserRequest`
- Services use shared types for internal logic
- Responses match shared types
- NO duplicate type definitions in backend

**Rules**:
- All API contracts in `@monorepo/shared`
- DTOs implement shared request/response types
- Use shared types for service method signatures
- Create backend-specific types only for internal use
- NO `any` types - use shared types or create proper types

## 11. Testing

**MANDATORY**: Write tests for all services and controllers:

**Unit Test Structure**:
```typescript
// user.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { NotFoundException } from "@nestjs/common";

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findOne", () => {
    it("should return a user", async () => {
      const result = await service.findOne("1");
      expect(result).toBeDefined();
    });

    it("should throw NotFoundException if user not found", async () => {
      await expect(service.findOne("999")).rejects.toThrow(NotFoundException);
    });
  });
});
```

**Test Rules**:
- Unit tests for all services
- Unit tests for all controllers
- E2E tests for critical flows
- Test file naming: `*.spec.ts`
- Test coverage target: 80%+
- Mock external dependencies
- Test error cases

**Test Commands**:
- `npm run test` - Run unit tests
- `npm run test:watch` - Watch mode
- `npm run test:cov` - Coverage report
- `npm run test:e2e` - E2E tests

## 12. Backend AI Rules (strict)

**MANDATORY**: When using AI to generate backend code:

1. **Always include in prompts**:
   - "Follow rules/global-rules.md and rules/backend-rules.md"
   - "Use Nest.js module structure"
   - "Use class-validator for DTOs"
   - "Use shared types from @monorepo/shared"
   - "NO console.log, NO debugger, NO any types, NO default exports"
   - "Use Winston for logging"
   - "Use JWT for authentication"
   - "Version API endpoints: /api/v1/"

2. **Module Generation**:
   - Generate module, controller, service files
   - Generate DTOs in `dto/` subdirectory
   - Use `@Injectable()` for services
   - Use proper NestJS decorators

3. **Controller Generation**:
   - Use `@Controller("api/v1/resource")`
   - Type all methods with return types
   - Use DTOs for `@Body()` parameters
   - Apply guards appropriately

4. **Service Generation**:
   - Use `@Injectable()` decorator
   - Type all methods
   - Throw NestJS exceptions
   - Use shared types

5. **DTO Generation**:
   - Use class-validator decorators
   - Implement shared types
   - Include validation messages
   - Use `PartialType` for update DTOs

6. **Code Quality Checks**:
   - [ ] No console.log or debugger
   - [ ] No any types
   - [ ] No default exports
   - [ ] ESLint passes
   - [ ] TypeScript strict passes
   - [ ] Prettier formatted
   - [ ] Uses shared types
   - [ ] DTOs use class-validator
   - [ ] Proper error handling
   - [ ] Uses Winston for logging

**Violation Consequences**:
- Pre-commit hooks will reject
- Code review will request fixes
- CI/CD will fail

