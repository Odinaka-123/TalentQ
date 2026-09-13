// layout.tsx
import EmployerShell from "./components/EmployerShell";
import SessionHeartbeat from "@/components/SessionHeartbeat";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionHeartbeat />
      <EmployerShell>{children}</EmployerShell>
    </>
  );
}
