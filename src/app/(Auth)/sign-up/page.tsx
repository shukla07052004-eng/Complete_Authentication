"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    inputClass,
    labelClass,
    buttonClass,
    errorBoxClass,
} from "@/Style/fromStyles";
import AuthCard from "@/Style/AuthCard";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SignupResponse {
    success: boolean;
    message: string;
}

export default function SignupForm() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function checkUsername() {
        try {
            const res = await fetch("/api/unique-username-cheque", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const data: SignupResponse = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message || "Username is Already Taken. Please try With different one");
                setIsLoading(false);
                return;
            }

        } catch (error) {
            setError("Could not reach the server. Please check your connection.");
            setIsLoading(false);
        }
    }




    async function handleSubmit(e: any) {
        e.preventDefault();
        setError(null);

        setIsLoading(true);

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data: SignupResponse = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message || "Something went wrong. Please try again.");
                setIsLoading(false);
                return;
            }

            // Send the email along so the user doesn't have to retype it on /verify.
            router.push(`/verify`);
        } catch {
            setError("Could not reach the server. Please check your connection.");
            setIsLoading(false);
        }
    }

    return (
        <AuthCard title="Register Your Account" subtitle="Get started in a few seconds">

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error && <div className={errorBoxClass}>{error}</div>}

                <div className="flex items-center flex-col gap-1 justify-center ">
                    <div>
                        <label htmlFor="username" className={labelClass}>
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onBlur={checkUsername}
                            placeholder="janedoe"
                            className={inputClass}
                            disabled={isLoading}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className={labelClass}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="jane@example.com"
                            className={inputClass}
                            disabled={isLoading}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className={labelClass}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className={inputClass}
                            disabled={isLoading}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button type="submit" className={buttonClass} disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create account"}
                    </button>
                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log in
                        </Link>
                    </p>
                </div>

            </form>
        </AuthCard>
    );
}