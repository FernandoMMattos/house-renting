"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Form from "@/components/Form";
import Input from "@/components/Input";
import FormButton from "@/components/FormButton";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import FormField from "@/components/FormField";

const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const wasReset = searchParams.get("reset") === "1";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      const apiMessage = err.response?.data?.message;
      if (apiMessage === "EMAIL_NOT_VERIFIED") {
        setError("Please verify your email before logging in. Check your inbox.");
      } else {
        setError(err.userMessage || "Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-10">
      <Form
        onSubmit={handleSubmit}
        title="Welcome!"
        className="flex flex-col gap-4 rounded-2xl border p-6 md:p-8 text-center w-full max-w-sm"
      >
        {wasReset && (
          <p className="text-sm text-green-600">
            Password reset successfully. You can now log in.
          </p>
        )}

        <FormField label="Email" htmlFor="email">
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="johndoe@domain.com"
            required
          />
        </FormField>

        <FormField label="Password" htmlFor="password">
          <Input
            type="password"
            id="password"
            name="password"
            required
            minLength={5}
          />
        </FormField>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-col gap-1 text-sm">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="hover:text-blue-500">
              Register
            </Link>
          </p>
          <p>
            <Link href="/forgot-password" className="hover:text-blue-500">
              Forgot your password?
            </Link>
          </p>
        </div>

        <FormButton type="submit" disabled={loading}>
          Enter
        </FormButton>
      </Form>
    </div>
  );
};

const LoginPage = () => (
  <Suspense>
    <LoginForm />
  </Suspense>
);

export default LoginPage;
