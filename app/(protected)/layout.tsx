import type { ReactNode } from "react";
import { ProtectedLayoutClient } from "@/modules/auth/ProtectedLayoutClient";

/**
 * All routes under this segment require an authenticated session.
 */
export default function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>;
}
