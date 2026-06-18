"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Logo from "@/components/Logo";
import { Lock, Mail, User, ArrowRight } from "lucide-react";

export default function SignupForm() {
  const { signUpWithEmail, signInWithGoogle, user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all details 💧");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long! 🔒");
      return;
    }
    setEmailLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      toast.success("Welcome, Gardener! Your account has taken root 🌱");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      let message = "Could not create account. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        message = "Email is already registered. Try logging in! 🌸";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email format. 📧";
      } else if (err.code === "auth/weak-password") {
        message = "Password is too weak. Choose at least 6 characters. 🔒";
      }
      toast.error(message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    
    // Safety timeout to reset loading state if popup gets stuck/blocked by browser
    const timeoutId = setTimeout(() => {
      setGoogleLoading(false);
    }, 15000);

    try {
      await signInWithGoogle();
      clearTimeout(timeoutId);
      toast.success("Signed in with Google! Time to grow 🌸");
      router.push("/dashboard");
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error(err);
      if (err.code !== "auth/popup-closed-by-user") {
        toast.error("Google registration failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-neutral-200/50 dark:border-neutral-800/80 animate-pop-in">
      <div className="flex flex-col items-center mb-8">
        <Link href="/">
          <Logo size="md" className="mb-4" />
        </Link>
        <h2 className="font-heading text-2xl font-bold text-text-primary dark:text-white">Start Your Garden</h2>
        <p className="text-sm text-text-secondary dark:text-neutral-400 mt-1.5 text-center">
          Create a space where your ideas can grow, blossom, and succeed. Plant your first board today! 🌱
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-neutral-400 mb-2">
            Gardener's Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Basil Bloom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bloom-green focus:border-transparent dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-neutral-400 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
            <input
              type="email"
              placeholder="gardener@kanbloom.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bloom-green focus:border-transparent dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-neutral-400 mb-2">
            Choose Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bloom-green focus:border-transparent dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={emailLoading || googleLoading || authLoading}
          className="w-full py-3.5 bg-bloom-green hover:bg-bloom-green-hover text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {emailLoading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              Sow the Seeds <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
        </div>
        <span className="relative px-3 text-xs bg-white dark:bg-neutral-900 text-text-secondary dark:text-neutral-400">
          Or continue with
        </span>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={emailLoading || googleLoading || authLoading}
        className="w-full py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 text-text-primary dark:text-neutral-100 font-semibold rounded-xl shadow-sm transition-all duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {googleLoading ? (
          <div className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-600 border-t-bloom-green animate-spin" />
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.5 3.77v3.13h4.04c2.37-2.18 3.73-5.39 3.73-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.04-3.13c-1.12.75-2.56 1.2-3.92 1.2-3.02 0-5.58-2.04-6.5-4.79H1.38v3.23C3.36 21.6 7.42 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.5 14.37A7.17 7.17 0 0 1 5.1 12c0-.83.14-1.64.4-2.37V6.4H1.38A11.96 11.96 0 0 0 0 12c0 2.1.55 4.1 1.38 5.85l4.12-3.48z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.05 15.24 0 12 0 7.42 0 3.36 2.4 1.38 6.4l4.12 3.23c.92-2.75 3.48-4.88 6.5-4.88z"
              />
            </svg>
            Google Account
          </>
        )}
      </button>

      <p className="text-center text-xs text-text-secondary dark:text-neutral-400 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-bloom-green hover:underline font-semibold">
          Log in to your garden 🌿
        </Link>
      </p>
    </div>
  );
}
