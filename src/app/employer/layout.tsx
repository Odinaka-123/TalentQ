// layout.tsx
import EmployerShell from "./components/EmployerShell";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmployerShell>{children}</EmployerShell>;
}
