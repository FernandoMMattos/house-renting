"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Form from "@/components/Form";
import Input from "@/components/Input";
import FormButton from "@/components/FormButton";
import FormField from "@/components/FormField";
import Link from "next/link";
import { apiResetPassword } from "@/lib/auth";

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    if (!token) {
      setError("Invalid reset link.");
      return;
    }

    setLoading(true);
    try {
      await apiResetPassword(token, password);
      router.push("/login?reset=1");
    } catch (err: any) {
      setError(
        err.userMessage ||
          err.response?.data?.message ||
          "Invalid or expired reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="m-auto flex w-1/3 flex-col items-center gap-4 rounded-2xl border p-8 text-center">
        <p className="text-sm text-red-500">Invalid reset link.</p>
        <Link href="/forgot-password" className="text-sm hover:text-blue-500">
          Request a new one
        </Link>
      </div>
    );
  }

  return (
    <Form
      onSubmit={handleSubmit}
      title="Reset Password"
      className="m-auto flex w-1/3 flex-col gap-4 rounded-2xl border p-8 text-center"
    >
      <FormField label="New Password" htmlFor="password">
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          required
          minLength={5}
        />
      </FormField>

      <FormField label="Confirm Password" htmlFor="confirmPassword">
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="••••••••"
          required
          minLength={5}
        />
      </FormField>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <FormButton type="submit" disabled={loading}>
        Reset Password
      </FormButton>
    </Form>
  );
};

const ResetPasswordPage = () => (
  <Suspense>
    <ResetPasswordContent />
  </Suspense>
);

export default ResetPasswordPage;
