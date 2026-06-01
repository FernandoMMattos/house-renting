"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Form from "@/components/Form";
import Input from "@/components/Input";
import FormButton from "@/components/FormButton";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import FormField from "@/components/FormField";

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      title="Welcome!"
      className="
        mx-auto
        flex
        max-w-md
        flex-col
        gap-4
        rounded-2xl
        border
        p-8
        text-center
      "
    >
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
        <Input type="password" id="password" name="password" required />
      </FormField>

      {error && <p>{error}</p>}

      <p className="text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="hover:text-blue-500">
          Register
        </Link>
      </p>

      <FormButton type="submit" disabled={false}>
        Enter
      </FormButton>
    </Form>
  );
};

export default LoginPage;
