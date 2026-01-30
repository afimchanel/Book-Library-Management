export interface JwtPayload {
  sub: string;
  username: string;
}

/**
 * Authenticated User interface
 * Represents the user object available in request after JWT authentication
 * This is populated by JwtStrategy.validate() and attached to request
 */
export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}
