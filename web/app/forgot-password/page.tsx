"use client";

import { useState } from "react";
import Form from "@/components/Form";
import Input from "@/components/Input";
import FormButton from "@/components/FormButton";
import FormField from "@/components/FormField";
import Link from "next/link";
import { apiForgotPassword } from "@/lib/auth";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const email = (
      (e.currentTarget).elements.namedItem("email") as HTMLInputElement
    ).value;

    try {
      await apiForgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.userMessage ||
          err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="m-auto flex w-1/3 flex-col items-center gap-4 rounded-2xl border p-8 text-center">
        <h1 className="text-2xl font-semibold">Check your inbox</h1>
        <p className="text-sm text-gray-600">
          If that email address is registered, we've sent a reset link. Check
          your spam folder if you don't see it within a few minutes.
        </p>
        <Link href="/login" className="text-sm hover:text-blue-500">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <Form
      onSubmit={handleSubmit}
      title="Forgot Password"
      className="m-auto flex w-1/3 flex-col gap-4 rounded-2xl border p-8 text-center"
    >
      <p className="text-sm text-gray-500">
        Enter your email and we'll send you a reset link.
      </p>

      <FormField label="Email" htmlFor="email">
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="johndoe@domain.com"
          required
        />
      </FormField>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <p className="text-sm">
        Remember your password?{" "}
        <Link href="/login" className="hover:text-blue-500">
          Login
        </Link>
      </p>

      <FormButton type="submit" disabled={loading}>
        Send Reset Link
      </FormButton>
    </Form>
  );
};

export default ForgotPasswordPage;
