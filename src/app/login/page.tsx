"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
    inputClass,
    labelClass,
    buttonClass,
    errorBoxClass,
} from "../../Style/fromStyles";
import AuthCard from "@/Style/AuthCard";

export default function LoginForm() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState(""); // email OR username
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function validate(): string | null {
        if (identifier.trim().length === 0) {
            return "Please enter your email or username.";
        }
        if (password.length === 0) {
            return "Please enter your password.";
        }
        return null;
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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

    return (
        <AuthCard title="login your account" subtitle="Get started in a few seconds">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error && <div className={errorBoxClass}>{error}</div>}

                <div>
                    <label htmlFor="identifier" className={labelClass}>
                        Email or username
                    </label>
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
                    <label htmlFor="password" className={labelClass}>
                        Password
                    </label>
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
        </AuthCard>
    );
}
