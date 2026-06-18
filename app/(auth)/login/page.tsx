import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Log In | Kanbloom - Watch Your Workflow Bloom",
  description: "Log in to your Kanbloom account to manage your projects, collaborate with your team, and track your boards in real time.",
};

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12 bg-bg-light dark:bg-bg-dark min-h-[calc(100vh-4rem)]">
      <LoginForm />
    </main>
  );
}
