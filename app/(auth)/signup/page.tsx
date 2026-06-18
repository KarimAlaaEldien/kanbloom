import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | Kanbloom - Watch Your Workflow Bloom",
  description: "Sign up for a free Kanbloom account. Create task boards, collaborate in real time, and watch your work grow from seed to bloom.",
};

export default function SignupPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12 bg-bg-light dark:bg-bg-dark min-h-[calc(100vh-4rem)]">
      <SignupForm />
    </main>
  );
}
