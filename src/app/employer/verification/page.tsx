import { Suspense } from "react";
import VerificationClient from "./components/VerificationClient";

export default function EmployerVerificationPage() {
  return (
    <Suspense fallback={null}>
      <VerificationClient />
    </Suspense>
  );
}
