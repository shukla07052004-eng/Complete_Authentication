import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    inputClass,
    labelClass,
    buttonClass,
    errorBoxClass,
} from "../../../Style/fromStyles";
import AuthCard from "@/Style/AuthCard";

export default function forgetPassword() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState(""); // email OR username
    const [password, setPassword] = useState("");
    const [validCode, setValidCode] = useState("")

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activePage, setActivePage] = useState("sign-in");
    const [success, setSuccess] = useState<string | null>(null);

    function validate(): string | null {
        if (identifier.trim().length === 0) {
            return "Please enter your email or username.";
        }
        return null;
    }

    
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
          identifier,
          validCode,
          password
        }),
      });

      if (!res.ok) {
        setError("Verification failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccess(
        "Code Verified! Redirecting to login..."
      );

      router.push("/sign-in");

    } catch {
      setError("Could not reach the server. Please check your connection.");
      setIsLoading(false);
    }

  }

  return(
    
  )

}