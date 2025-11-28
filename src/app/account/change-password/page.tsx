import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);

  // Protect the route
  if (!session) {
    redirect("/login?callbackUrl=/account/change-password");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Cambiar Contraseña
        </h1>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
