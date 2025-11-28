import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * The shape of the user object in the session.
   */
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      id: string;
      role: string;
      employeeId?: string | null;
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object returned by the adapter or authorize function.
   */
  interface User extends DefaultUser {
    role: string;
    employeeId?: string | null;
  }
}

declare module "next-auth/jwt" {
  /**
   * The shape of the JWT token.
   */
  interface JWT extends NextAuthJWT {
    id: string;
    role: string;
    employeeId?: string | null;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}
