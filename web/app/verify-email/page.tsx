"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiVerifyEmail } from "@/lib/auth";
import Link from "next/link";

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    apiVerifyEmail(token)
      .then((data) => {
        setStatus("success");
        setMessage(data.message);
        setTimeout(() => router.push("/login"), 3000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Invalid or expired verification link."
        );
      });
  }, [token, router]);

  return (
    <div className="m-auto flex w-1/3 flex-col items-center gap-4 rounded-2xl border p-8 text-center">
      <h1 className="text-2xl font-semibold">Email Verification</h1>

      {status === "loading" && (
        <p className="text-sm text-gray-500">Verifying your email…</p>
      )}

      {status === "success" && (
        <>
          <p className="text-sm text-green-600">{message}</p>
          <p className="text-sm text-gray-500">Redirecting to login…</p>
        </>
      )}

      {status === "error" && (
        <>
          <p className="text-sm text-red-500">{message}</p>
          <Link href="/login" className="text-sm hover:text-blue-500">
            Back to Login
          </Link>
        </>
      )}
    </div>
  );
};

const VerifyEmailPage = () => (
  <Suspense>
    <VerifyEmailContent />
  </Suspense>
);

export default VerifyEmailPage;
