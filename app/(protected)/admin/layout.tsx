import type { ReactNode } from "react";
import { AdminLayoutClient } from "@/modules/auth/AdminLayoutClient";

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
