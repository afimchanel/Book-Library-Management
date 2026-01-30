import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from 'src/auth/auth.interface';

/**
 * Custom decorator to extract current authenticated user from request
 * Use with JwtAuthGuard
 * 
 * The user object is populated by JwtStrategy.validate()
 * which returns a minimal user object with essential fields only
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
