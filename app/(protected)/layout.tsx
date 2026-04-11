import { RequireAuth } from "../../features/auth/components/RequireAuth";

/**
 * All routes under this segment require an authenticated session.
 * Add more pages beside `account/` as needed; they inherit this guard.
 */
export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequireAuth>{children}</RequireAuth>;
}
