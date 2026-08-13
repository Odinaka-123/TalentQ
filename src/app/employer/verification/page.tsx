import VerificationHero from "./components/VerificationHero";
import StatsStrip from "./components/StatsStrip";
import VerificationSteps from "./components/VerificationSteps";
import TrustBadgesEarned from "./components/TrustBadgesEarned";

export default function EmployerVerificationPage() {
  return (
    <div>
      <VerificationHero />
      <StatsStrip />
      <VerificationSteps />
      <TrustBadgesEarned />
    </div>
  );
}
