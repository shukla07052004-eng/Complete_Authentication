"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  inputClass,
  labelClass,
  buttonClass,
  errorBoxClass,
  successBoxClass,
} from "../../Style/fromStyles";
import AuthCard from "@/Style/AuthCard";

interface VerifyResponse {
  success: boolean;
  message: string;
}

interface VerifyFormProps {
  // Pre-filled from the ?email= query param set by SignupForm, but the
  // field stays editable in case the user landed here directly.
  initialUsername?: string;
}

export default function VerifyForm({ initialUsername = "" }: VerifyFormProps) {
  const router = useRouter();

  const [username, setUsername] = useState(initialUsername);
  const [code, setCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  async function handleSubmit(e: any) {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/validCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          code,
        }),
      });

      const data: VerifyResponse = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Verification failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccess(
        data.message || "Email verified! Redirecting to login..."
      );

      router.push("/login");

    } catch {
      setError("Could not reach the server. Please check your connection.");
      setIsLoading(false);
    }

  }
   

  return (
    <AuthCard title="Verify your account" subtitle="Get started in a few seconds">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <div className={errorBoxClass}>{error}</div>}
        {success && <div className={successBoxClass}>{success}</div>}

        <div>
          <label htmlFor="Username" className={labelClass}>
            Username
          </label>
          <input
            id="username"
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="janebabu"
            className={inputClass}
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="code" className={labelClass}>
            Verification code
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter the code sent to your email"
            className={inputClass}
            disabled={isLoading}
            autoComplete="one-time-code"
            required
          />
        </div>

        <button type="submit" className={buttonClass} disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Wrong Username?{" "}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to signup
          </Link>
        </p>
      </form>
    </AuthCard>
  )}