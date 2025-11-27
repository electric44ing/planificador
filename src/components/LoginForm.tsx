"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type LoginFormProps = {
  error?: string;
};

// A mapping of error codes to user-friendly messages
const errorMessages: { [key: string]: string } = {
  CredentialsSignin: "Credenciales inválidas. Por favor, inténtalo de nuevo.",
  // Add other generic NextAuth errors if needed
};

export default function LoginForm({ error: initialError }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If there's an error in the URL, use it. NextAuth puts the thrown message here.
  // Otherwise, use the generic error code mapping.
  const error = initialError
    ? errorMessages[initialError] || initialError
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // We don't use redirect: false anymore.
    // NextAuth will handle the redirection automatically on success,
    // or redirect back to this page with an error on failure.
    // The callbackUrl from the URL is also handled automatically.
    await signIn("credentials", {
      email,
      password,
    });

    // This part might not be reached if signIn redirects, but it's good practice
    // to stop the loading state in case of an unexpected issue.
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </form>
  );
}
