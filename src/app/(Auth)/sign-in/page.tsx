"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
    inputClass,
    buttonClass,
    errorBoxClass,
} from "../../../Style/fromStyles";
import AuthCard from "@/Style/AuthCard";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { Button } from "@/components/ui/moving-border";



export default function LoginForm() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState(""); // email OR username
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activePage, setActivePage] = useState("sign-in");

    function validate(): string | null {
        if (identifier.trim().length === 0) {
            return "Please enter your email or username.";
        }
        if (password.length === 0) {
            return "Please enter your password.";
        }
        return null;
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        // redirect: false lets us handle success/error ourselves instead of
        // Auth.js doing a full page redirect.
        const result = await signIn("credentials", {
            identifier,
            password,
            redirect: false,
        });

        setIsLoading(false);

        if (!result || result.error) {
            // Auth.js returns a generic "CredentialsSignin" error string by
            // default for failed credential checks — show a friendly message.
            setError("Invalid email/username or password.");
            return;
        }

        router.push("/dashboard");
    }

    async function handleGoogleLogin() {
        try {
            setError(null);
            setActivePage("processing");

            const result = await signIn("google", {
                redirect: false,
            });

            if (result?.error) {
                setActivePage("sign-in");
                setError("Google login failed. Please try again.");
                return;
            }

            if (result?.ok) {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error(error);
            setActivePage("sign-in");
            setError("Google login failed. Please try again.");
        }
    }

    return (
        <AuthCard title="login your account" subtitle="Get started in a few seconds">
            <div className="pointer-events-none absolute inset-0">
                <ShootingStars />
                <StarsBackground />
            </div>
            {activePage === "sign-in" && (

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {error && <div className={errorBoxClass}>{error}</div>}

                    <div >
                        <input
                            id="identifier"
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="jane@example.com or janedoe"
                            className={inputClass}
                            disabled={isLoading}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your password"
                            className={inputClass}
                            disabled={isLoading}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button type="submit" className={buttonClass} disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Log in"}
                    </button>

                    <p className="text-center text-sm text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </Link>
                    </p>
                </form>
            )}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={activePage === "processing"}
                className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            >
                {activePage === "processing"
                    ? "Connecting to Google..."
                    : "Continue with Google"}
            </button>
            {activePage === "processing" && (
                <div className="min-h-screen flex items-center justify-center bg-black">
                    <div className="flex flex-col items-center gap-6">
                        {/* Google-style loader */}
                        <div className="relative h-12 w-12">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />

                            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-500" />
                        </div>

                        <div className="text-center">
                            <p className="text-lg font-medium text-gray-700">
                                Loading...
                            </p>

                            <p className="mt-1 text-sm text-gray-400">
                                Please wait while we prepare everything
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </AuthCard>
    );
}
