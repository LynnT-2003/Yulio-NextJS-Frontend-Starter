import { RequireAuth } from "../../features/auth/components/RequireAuth";
import { AccountDashboard } from "../../features/account/components/AccountDashboard";

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountDashboard />
    </RequireAuth>
  );
}
