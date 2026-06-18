import type { Metadata } from "next";
import DashboardLayoutClient from "@/components/DashboardLayoutClient";

export const metadata: Metadata = {
  title: "Dashboard | Kanbloom - Watch Your Workflow Bloom",
  description: "Manage your boards and collaborate on tasks.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
