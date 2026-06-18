import type { Metadata } from "next";
import BoardLayoutClient from "@/components/BoardLayoutClient";

export const metadata: Metadata = {
  title: "Board View | Kanbloom - Watch Your Workflow Bloom",
  description: "View and collaborate on your task board.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return <BoardLayoutClient>{children}</BoardLayoutClient>;
}
