import AuthCard from "@/Style/AuthCard";
import SignupForm from "./signup/page";

export default function SignupPage() {
  return (
    <AuthCard title="Create your account" subtitle="Get started in a few seconds">
      <SignupForm />
    </AuthCard>
  );
}
