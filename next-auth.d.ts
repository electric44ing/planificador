import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Extiende los tipos por defecto de la sesión para incluir el rol y el id del usuario.
   */
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  /**
   * Extiende el tipo por defecto del usuario para incluir el rol.
   */
  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  /** Extiende el token JWT para incluir el rol y el id del usuario. */
  interface JWT {
    id: string;
    role: string;
  }
}
