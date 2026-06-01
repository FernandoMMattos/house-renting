"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Form from "@/components/Form";
import Input from "@/components/Input";
import FormButton from "@/components/FormButton";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import FormField from "@/components/FormField";

const RegisterPage = () => {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    if (password !== confirmPassword) throw new Error("Password doesn't match");

    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      setError("Invalid credentials");
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      title="Create your account"
      className="
        mx-auto
        flex
        max-w-md
        flex-col
        gap-4
        rounded-2xl
        border
        p-8
        text-center"
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
          placeholder="123"
          name="password"
          id="password"
          required
        />
      </FormField>

      <FormField label="Confirm Password" htmlFor="confirmPassword">
        <Input
          type="password"
          placeholder="123"
          name="confirmPassword"
          id="confirmPassword"
          required
        />
      </FormField>

      {error && <p>{error}</p>}

      <p className="text-sm">
        Already has an account?{" "}
        <Link href="/login" className="hover:text-blue-500">
          Login
        </Link>
      </p>

      <FormButton type="submit" disabled={false}>Register</FormButton>
    </Form>
  );
};

export default RegisterPage;
