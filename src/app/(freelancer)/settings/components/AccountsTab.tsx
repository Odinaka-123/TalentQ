import ProfileInformation from "./ProfileInformation";
import AvailabilityStatus from "./AvailabilityStatus";
import SettingsPaymentMethods from "./SettingsPaymentMethods";
import DangerZone from "./DangerZone";

export default function AccountsTab() {
  return (
    <div>
      <ProfileInformation />
      <AvailabilityStatus />
      <SettingsPaymentMethods />
      <DangerZone />
    </div>
  );
}
