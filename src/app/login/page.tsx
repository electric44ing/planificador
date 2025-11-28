import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  // If the user is already logged in, redirect them.
  if (session) {
    const callbackUrl = searchParams?.callbackUrl || "/";
    redirect(Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl);
  }

  const error = searchParams?.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Iniciar Sesión
        </h1>
        <LoginForm error={Array.isArray(error) ? error[0] : error} />
      </div>
    </div>
  );
}
