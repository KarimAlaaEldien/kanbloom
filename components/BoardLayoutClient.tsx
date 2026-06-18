"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { LogOut, Sun, Moon, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import UserAvatar from "@/components/UserAvatar";
import ProfileSettingsModal from "@/components/ProfileSettingsModal";

export default function BoardLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading, logOut } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sync theme
  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
      toast.success("Good morning! Light mode activated ☀️", { id: "theme-toggle" });
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
      toast.success("Good evening! Dark mode activated 🌙", { id: "theme-toggle" });
    }
  };

  // Auth protection guard
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || !mounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg-light dark:bg-bg-dark min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Logo size="lg" iconOnly={true} className="animate-pulse" />
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-bloom-green animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2.5 h-2.5 rounded-full bg-blossom-pink animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2.5 h-2.5 rounded-full bg-bloom-green animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="font-heading font-semibold text-text-secondary dark:text-neutral-300 text-sm animate-pulse">
            Tending to the garden... 🌿
          </span>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully. See you soon! 🌿");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed.");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-light dark:bg-bg-dark text-text-primary dark:text-neutral-100 transition-colors duration-200">
      {/* Board Navbar */}
      <header className="border-b border-neutral-200/50 dark:border-neutral-800/80 bg-white/70 backdrop-blur-md dark:bg-neutral-900/60 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard">
              <Logo size="sm" />
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-2 text-xs font-semibold text-bloom-green hover:text-bloom-green-hover px-2.5 py-1 rounded-full bg-bloom-green/10 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Go to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark mode button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-neutral-500 hover:text-bloom-green hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile badge */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2.5 pl-2 border-l border-neutral-200 dark:border-neutral-800 hover:opacity-80 transition-all text-left"
              title="Profile Settings"
            >
              <UserAvatar
                src={userProfile?.photoURL || user.photoURL}
                name={userProfile?.displayName || user.displayName}
                uid={user.uid}
                size="sm"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold leading-none text-text-primary dark:text-neutral-200">
                  {userProfile?.displayName || user.displayName || "Gardener"}
                </span>
                <span className="text-[10px] text-text-secondary dark:text-neutral-400 mt-0.5 max-w-[120px] truncate font-body">
                  {user.email}
                </span>
              </div>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all ml-1"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Board Page content */}
      <main className="flex-1 flex flex-col w-full h-[calc(100vh-4rem)] overflow-hidden">
        {children}
      </main>
      {/* Profile Settings Modal */}
      {isProfileOpen && (
        <ProfileSettingsModal onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  );
}
