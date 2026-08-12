import ProfileInformation from "./ProfileInformation";
import AvailabilityStatus from "./AvailabilityStatus";
import PaymentMethodsSettings from "./PaymentMethodsSettings";
import DangerZone from "./DangerZone";

export default function AccountsTab() {
  return (
    <div>
      <ProfileInformation />
      <AvailabilityStatus />
      <PaymentMethodsSettings />
      <DangerZone />
    </div>
  );
}
