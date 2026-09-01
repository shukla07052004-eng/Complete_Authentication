"use client";
import { useState } from "react";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { errorBoxClass } from "../../../Style/fromStyles";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import AuthCard from "@/Style/AuthCard";
import { ShootingStars } from "@/components/customCss/shooting-stars";
import { StarsBackground } from "@/components/customCss/stars-background";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { CardContent } from "@/components/ui/card";

export default function forgetPassword() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState(""); // email OR username
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("")
  const [validCode, setValidCode] = useState("")

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState("user");
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState("");

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

  const compareNumbers = () => {
    if (password !== confirm) {
     setResult("Wrong Password") ;
    } else{
      setResult("Password Changed successfully ")
      router.push("/sign-in")
  }
  };

  return (
    <AuthCard title="Reset your Password" subtitle="" >
      <div className="pointer-events-none absolute inset-0">
        <ShootingStars />
        <StarsBackground />
      </div>

      <div className="relative michroma-regular z-10 mt-4 mx-auto w-full max-w-md rounded-2xl bg-white p-4 shadow-input md:p-8 dark:bg-black">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && <div className={errorBoxClass}>{error}</div>}

            <div className="mb-4 flex w-full min-w-sm flex-col items-center justify-center space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <LabelInputContainer>
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email or Username"
                  disabled={isLoading}
                  autoComplete="username"
                  required
                />

                <button
                  className="group/btn relative cursor-pointer block h-10 w-full ounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                  type="submit"
                >
                  Verify &rarr;
                  <BottomGradient />
                </button>

              </LabelInputContainer>
            </div>

          </form>

          <div>

            <CardContent>
              <Field>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="xs" >
                    <RefreshCwIcon />
                    Resend Code
                  </Button>
                </div>
                <div className="mb-4 flex w-full min-w-sm flex-col items-center justify-center space-y-2 gap-2">

                  <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    value={validCode}
                    onChange={(value) => setValidCode(value)}
                  >
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator className="mx-2" />
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </Field>
            </CardContent>

          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && <div className={errorBoxClass}>{error}</div>}

              <div className="mb-4 flex w-full min-w-sm flex-col items-center justify-center space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <LabelInputContainer>
                  <Input
                    id="Password"
                    type="string"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    disabled={isLoading}
                    required
                  />
                  <Input
                    id="Confirm-Pass"
                    type="string"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Confirm Password"
                    required
                  />

                  <button
                    className="group/btn relative cursor-pointer block h-10 w-full ounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                    type="submit"
                    onClick={compareNumbers}
                  >
                    Submit &rarr;
                    <BottomGradient />
                  </button>
                  <p>{result}</p>

                </LabelInputContainer>
              </div>

            </form>
          </div>

        </div>
      </div>

    </AuthCard>
  )

}


const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex min-w-sm flex-col space-y-2", className)}>
      {children}
    </div>
  );
};