import DashboardShell from "./components/DashboardShell";
import { CurrencyProvider } from "@/lib/currency/CurrencyContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrencyProvider>
      <DashboardShell>{children}</DashboardShell>
    </CurrencyProvider>
  );
}
