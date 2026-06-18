"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/Logo";
import { Sprout, Users, Zap, ArrowRight, CheckCircle2, Lock, ShieldCheck, HeartPulse } from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="flex-1 flex flex-col bg-[#FAFAF9] text-text-primary dark:bg-bg-dark dark:text-neutral-100 transition-colors duration-300">
      
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/50 bg-[#FAFAF9]/80 backdrop-blur-md dark:bg-bg-dark/80 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo size="md" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary dark:text-neutral-300">
            <a href="#features" className="hover:text-bloom-green transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-bloom-green transition-colors">How It Works</a>
            <a href="#garden-concept" className="hover:text-bloom-green transition-colors">The Garden Concept</a>
          </nav>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full border-2 border-bloom-green/30 border-t-bloom-green animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-bloom-green hover:bg-bloom-green-hover shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-text-primary dark:text-neutral-200 hover:text-bloom-green transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-bloom-green hover:bg-bloom-green-hover shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Start Growing
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background Decorative Blurs */}
        <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-bloom-green/10 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-1/10 w-96 h-96 rounded-full bg-blossom-pink/10 blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bloom-green/10 text-bloom-green-hover dark:text-bloom-green text-sm font-semibold mb-6">
            <Sprout className="w-4 h-4" />
            <span>Introducing Kanbloom</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Watch your <span className="text-bloom-green">workflow</span> bloom.
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-text-secondary dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Turn chaotic work into a visual, growing structure. Collaborate in real time, customize stages of growth, and cultivate projects with ease.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-bloom-green hover:bg-bloom-green-hover shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                Start Growing Your Boards
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-bloom-green hover:bg-bloom-green-hover shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-text-primary dark:text-neutral-100 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 shadow-md transition-all duration-200"
                >
                  Live Demo
                </Link>
              </>
            )}
          </div>

          {/* Interactive UI Mockup Showcase */}
          <div className="mt-16 md:mt-20 max-w-5xl mx-auto rounded-2xl p-3 bg-white dark:bg-neutral-800 shadow-2xl border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-900/40 p-6 flex flex-col gap-6 select-none border border-neutral-100 dark:border-neutral-800">
              {/* Fake Board Header */}
              <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-bloom-green/10 text-bloom-green font-heading font-semibold text-sm">
                    🌿 Product Launch Garden
                  </div>
                  <span className="text-xs text-text-secondary">Last updated just now</span>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 bg-bloom-green text-white text-xs font-bold flex items-center justify-center">A</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 bg-blossom-pink text-white text-xs font-bold flex items-center justify-center">M</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-400 text-white text-xs font-bold flex items-center justify-center">+2</div>
                </div>
              </div>

              {/* Fake Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Column 1 */}
                <div className="bg-neutral-100/70 dark:bg-neutral-900/60 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between font-heading font-semibold text-sm text-text-primary dark:text-neutral-200 px-1">
                    <span>To Do 🌱</span>
                    <span className="bg-neutral-200 dark:bg-neutral-800 text-xs px-2 py-0.5 rounded-full">2</span>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 p-3.5 rounded-xl shadow-sm border border-neutral-200/30 dark:border-neutral-700/30 flex flex-col gap-2">
                    <div className="font-semibold text-xs text-bloom-green uppercase tracking-wider font-heading">Research</div>
                    <div className="text-sm font-medium">Draft initial release plan</div>
                    <div className="text-xs text-text-secondary">Research competitors and prepare core timeline.</div>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 p-3.5 rounded-xl shadow-sm border border-neutral-200/30 dark:border-neutral-700/30 flex flex-col gap-2">
                    <div className="font-semibold text-xs text-blossom-pink uppercase tracking-wider font-heading">Design</div>
                    <div className="text-sm font-medium">Finalize marketing assets</div>
                    <div className="text-xs text-text-secondary">Needs to align with garden theme branding.</div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="bg-neutral-100/70 dark:bg-neutral-900/60 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between font-heading font-semibold text-sm text-text-primary dark:text-neutral-200 px-1">
                    <span>In Progress 🌿</span>
                    <span className="bg-neutral-200 dark:bg-neutral-800 text-xs px-2 py-0.5 rounded-full">1</span>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 p-3.5 rounded-xl shadow-md border-2 border-bloom-green/20 dark:border-bloom-green/10 flex flex-col gap-2 relative transform rotate-1 scale-[1.02]">
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-blossom-pink/20 text-blossom-pink text-[10px] font-bold">Active</div>
                    <div className="font-semibold text-xs text-bloom-green uppercase tracking-wider font-heading">Development</div>
                    <div className="text-sm font-medium">Build Firebase Sync logic</div>
                    <div className="text-xs text-text-secondary">Implementing real-time listeners for collaboration.</div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="bg-neutral-100/70 dark:bg-neutral-900/60 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between font-heading font-semibold text-sm text-text-primary dark:text-neutral-200 px-1">
                    <span>Blooming 🌸</span>
                    <span className="bg-neutral-200 dark:bg-neutral-800 text-xs px-2 py-0.5 rounded-full">1</span>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 p-3.5 rounded-xl shadow-sm border border-neutral-200/30 dark:border-neutral-700/30 flex flex-col gap-2 opacity-75">
                    <div className="font-semibold text-xs text-neutral-400 uppercase tracking-wider font-heading line-through">Setup</div>
                    <div className="text-sm font-medium line-through">Configure landing page router</div>
                    <div className="text-xs text-text-secondary">Statically generated for optimal crawler accessibility.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-neutral-900/30 border-t border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-text-primary dark:text-white sm:text-4xl">
              Nurtured for real-time collaboration.
            </h2>
            <p className="mt-4 text-text-secondary dark:text-neutral-400">
              Kanbloom makes task management visual and organic, providing the features you need to collaborate with your team without the corporate clutter.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-[#FAFAF9] dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-bloom-green/10 text-bloom-green flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">Instant Real-Time Sync</h3>
              <p className="text-text-secondary dark:text-neutral-400 text-sm leading-relaxed">
                Powered by Firestore WebSockets. Any card move, edit, or column addition updates instantly across all active collaborators' screens with zero delay.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-[#FAFAF9] dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-blossom-pink/10 text-blossom-pink flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">Multi-User Gardens</h3>
              <p className="text-text-secondary dark:text-neutral-400 text-sm leading-relaxed">
                Invite team members using their email address. Collaborators gain read and write permissions to garden boards and can edit them live.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-[#FAFAF9] dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-bloom-green/10 text-bloom-green flex items-center justify-center mb-6">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">Intuitive Flow</h3>
              <p className="text-text-secondary dark:text-neutral-400 text-sm leading-relaxed">
                Drag-and-drop columns and cards with butter-smooth animations using `@dnd-kit`. Tailored to represent stages of progressive task growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-text-primary dark:text-white sm:text-4xl">
              Plant, Grow, and Bloom
            </h2>
            <p className="mt-4 text-text-secondary dark:text-neutral-400">
              Kanbloom translates standard project management stages into a natural, progressive flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-bloom-green text-white font-bold flex items-center justify-center mb-6 shadow-md">
                1
              </div>
              <h3 className="font-heading text-lg font-bold mb-2">Plant (To Do) 🌱</h3>
              <p className="text-text-secondary dark:text-neutral-400 text-sm max-w-xs leading-relaxed">
                Create task cards at the seeds phase. Jot down details, attach information, and set priorities.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-bloom-green text-white font-bold flex items-center justify-center mb-6 shadow-md">
                2
              </div>
              <h3 className="font-heading text-lg font-bold mb-2">Cultivate (In Progress) 🌿</h3>
              <p className="text-text-secondary dark:text-neutral-400 text-sm max-w-xs leading-relaxed">
                Drag cards as they develop. Reorder within lists and work with teammates concurrently.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blossom-pink text-white font-bold flex items-center justify-center mb-6 shadow-md">
                3
              </div>
              <h3 className="font-heading text-lg font-bold mb-2">Bloom (Completed) 🌸</h3>
              <p className="text-text-secondary dark:text-neutral-400 text-sm max-w-xs leading-relaxed">
                Celebrate completion! Drag cards to the Blooming stage where they are stored, ready to show off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Badge */}
      <section className="py-12 bg-neutral-100/50 dark:bg-neutral-800/20 border-t border-neutral-200/50 dark:border-neutral-800/30">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-800 shadow-md flex items-center justify-center text-bloom-green">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-text-primary dark:text-white">Secure Data Architecture</h4>
            <p className="text-xs text-text-secondary dark:text-neutral-400 mt-1 max-w-lg">
              Kanbloom protects your garden workspace with Firebase Authentication and strict server-side Firestore security rules. Only authorized board owners and collaborators can read or edit board files.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo size="sm" />
            <p className="text-xs text-text-secondary dark:text-neutral-400 mt-1">
              Watch your workflow bloom.
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-xs text-text-secondary dark:text-neutral-400">
            <span>&copy; {new Date().getFullYear()} Kanbloom. All rights reserved.</span>
            <span className="flex items-center gap-1">Made with <HeartPulse className="w-3.5 h-3.5 text-blossom-pink fill-blossom-pink" /> for productivity</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
