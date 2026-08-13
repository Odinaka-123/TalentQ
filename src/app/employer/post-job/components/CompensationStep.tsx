"use client";

import { Clock } from "lucide-react";

type CompensationData = {
  currency: string;
  minBudget: string;
  maxBudget: string;
  experienceLevel: string;
  projectDuration: string;
  paymentType: string;
  applicationDeadline: string;
};

type CompensationStepProps = {
  data: CompensationData;
  onChange: (data: CompensationData) => void;
};

const currencies = ["USD", "NGN", "GHS", "KES"];
const experienceLevels = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead / Principal",
];
const paymentTypes = ["Fixed price", "Hourly rate", "Milestone-based"];

export default function CompensationStep({
  data,
  onChange,
}: CompensationStepProps) {
  const update = (key: keyof CompensationData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="rounded-2xl bg-white px-6 py-6 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
      <h2 className="text-base font-semibold text-[#1F2A22] mb-5">
        Compensation & Timeline
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
        <div>
          <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
            Currency
          </label>
          <select
            value={data.currency}
            onChange={(e) => update("currency", e.target.value)}
            className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A] bg-white"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
            Min Budget
          </label>
          <input
            type="text"
            value={data.minBudget}
            onChange={(e) => update("minBudget", e.target.value)}
            placeholder="e.g. 3000"
            className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
            Max Budget
          </label>
          <input
            type="text"
            value={data.maxBudget}
            onChange={(e) => update("maxBudget", e.target.value)}
            placeholder="e.g. 5000"
            className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
            Payment Type
          </label>
          <select
            value={data.paymentType}
            onChange={(e) => update("paymentType", e.target.value)}
            className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A] bg-white"
          >
            {paymentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
            Project Duration
          </label>
          <input
            type="text"
            value={data.projectDuration}
            onChange={(e) => update("projectDuration", e.target.value)}
            placeholder="e.g. 3+ months"
            className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
            Experience Level
          </label>
          <select
            value={data.experienceLevel}
            onChange={(e) => update("experienceLevel", e.target.value)}
            className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A] bg-white"
          >
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-wide text-[#1F2A22] uppercase mb-2">
            Application Deadline
          </label>
          <input
            type="date"
            value={data.applicationDeadline}
            onChange={(e) => update("applicationDeadline", e.target.value)}
            className="w-full rounded-lg border border-[#E5E0D6] px-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
          />
        </div>
      </div>

      <div className="rounded-xl bg-[#DDEEE2] px-4 py-3 flex items-start gap-2">
        <Clock size={16} className="text-[#3E8E5A] shrink-0 mt-0.5" />
        <p className="text-xs text-[#2E6B44]">
          <span className="font-semibold">Escrow Protection:</span> TalentQ
          holds funds securely via Paystack &amp; Flutterwave. Release only on
          your milestone approval.
        </p>
      </div>
    </div>
  );
}
