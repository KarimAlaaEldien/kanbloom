import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kanbloom - Real-Time Collaborative Task Board",
  description: "Watch your workflow bloom. Organize tasks, collaborate with your team in real time, and turn chaos into a beautiful, visual structure.",
  keywords: ["kanban", "trello alternative", "task board", "collaboration", "real-time database", "project management"],
  authors: [{ name: "Kanbloom Team" }],
  metadataBase: new URL("https://kanbloom.vercel.app"), // Fallback domain for metadata
  verification: {
    google: "UDVCQQICNGOvt78c8GhKQeIxExkRqO5NJofXI52paj8",
  },
  openGraph: {
    title: "Kanbloom - Real-Time Collaborative Task Board",
    description: "Watch your workflow bloom. Organize tasks, collaborate with your team in real time, and turn chaos into a beautiful, visual structure.",
    url: "/",
    siteName: "Kanbloom",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kanbloom Task Board - Watch your workflow bloom",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kanbloom - Real-Time Collaborative Task Board",
    description: "Watch your workflow bloom. Organize tasks and collaborate with your team in real time.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full font-body bg-bg-light dark:bg-bg-dark text-text-primary dark:text-neutral-100 flex flex-col antialiased">
        <AuthProvider>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              className: "rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-800 font-body text-sm dark:bg-neutral-900 dark:text-neutral-100",
              duration: 4000,
              success: {
                iconTheme: {
                  primary: "#22C55E",
                  secondary: "#FFFFFF",
                },
              },
              error: {
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#FFFFFF",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
