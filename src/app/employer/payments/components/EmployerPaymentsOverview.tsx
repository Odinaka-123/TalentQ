import { PiggyBank, Lock, Wallet } from "lucide-react";
import EmployerStatCard from "./EmployerStatCard";
import ActiveEscrowMilestones from "./ActiveEscrowMilestones";
import PaymentPartners from "./PaymentPartners";

export default function EmployerPaymentsOverview() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <EmployerStatCard
          icon={PiggyBank}
          iconBg="#FBEADB"
          iconColor="#DE814A"
          value="$5,500"
          label="Total Funded"
        />
        <EmployerStatCard
          icon={Lock}
          iconBg="#DDEEE2"
          iconColor="#3E8E5A"
          value="$1,500"
          label="In Escrow"
        />
        <EmployerStatCard
          icon={Wallet}
          iconBg="#DCE9F7"
          iconColor="#3E7AC7"
          value="$112.50"
          label="Available Balance"
        />
      </div>

      <div className="rounded-2xl border border-[#E8A47E] bg-[#FBF0E4] px-5 py-4 mb-6">
        <p className="text-sm text-[#1F2A22]">
          All fees shown at the 10% TalentQ service rate. Withdrawal
          transactions carry no additional fee.
        </p>
      </div>

      <ActiveEscrowMilestones />
      <PaymentPartners />
    </div>
  );
}
