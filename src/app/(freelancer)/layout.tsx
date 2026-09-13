import DashboardShell from "./components/DashboardShell";
import { CurrencyProvider } from "@/lib/currency/CurrencyContext";
import SessionHeartbeat from "@/components/SessionHeartbeat";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrencyProvider>
      <SessionHeartbeat />
      <DashboardShell>{children}</DashboardShell>
    </CurrencyProvider>
  );
}
