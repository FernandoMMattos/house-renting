"use client";

import { useState } from "react";
import Form from "@/components/Form";
import Input from "@/components/Input";
import FormButton from "@/components/FormButton";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import FormField from "@/components/FormField";

const RegisterPage = () => {
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      setDone(true);
    } catch (err: any) {
      setError(
        err.userMessage ||
          err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border p-6 md:p-8 text-center">
          <h1 className="text-2xl font-semibold">Check your inbox</h1>
          <p className="text-sm text-gray-600">
            We&apos;ve sent a verification link to your email address. Click it to
            activate your account, then log in.
          </p>
          <Link href="/login" className="text-sm hover:text-blue-500">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-10">
      <Form
        onSubmit={handleSubmit}
        title="Create your account"
        className="flex flex-col gap-4 rounded-2xl border p-6 md:p-8 text-center w-full max-w-sm"
      >
        <FormField label="Name" htmlFor="name">
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            required
          />
        </FormField>

        <FormField label="Email" htmlFor="email">
          <Input
            type="email"
            placeholder="johndoe@domain.com"
            name="email"
            id="email"
            required
          />
        </FormField>

        <FormField label="Password" htmlFor="password">
          <Input
            type="password"
            placeholder="••••••••"
            name="password"
            id="password"
            required
          />
        </FormField>

        <FormField label="Confirm Password" htmlFor="confirmPassword">
          <Input
            type="password"
            placeholder="••••••••"
            name="confirmPassword"
            id="confirmPassword"
            required
          />
        </FormField>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/login" className="hover:text-blue-500">
            Login
          </Link>
        </p>

        <FormButton type="submit" disabled={loading}>
          Register
        </FormButton>
      </Form>
    </div>
  );
};

export default RegisterPage;
