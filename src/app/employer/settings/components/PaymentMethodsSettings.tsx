import { Landmark, Globe } from "lucide-react";

type PaymentMethod = {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  name: string;
  meta: string;
  status: "active" | "connect";
};

const methods: PaymentMethod[] = [
  {
    icon: Landmark,
    iconColor: "#3E8E5A",
    iconBg: "#DDEEE2",
    name: "Paystack",
    meta: "•••• •••• 6435 · Nigeria",
    status: "connect",
  },
  {
    icon: Globe,
    iconColor: "#3E7AC7",
    iconBg: "#DCE9F7",
    name: "Flutterwave",
    meta: "Connected",
    status: "active",
  },
];

export default function PaymentMethodsSettings() {
  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6 mt-6">
      <h3 className="text-base font-semibold text-[#1F2A22]">
        Payment Methods
      </h3>
      <p className="text-xs text-[#8A8A7E] mb-4">
        Where you fund escrow and pay talent.
      </p>

      <div className="flex flex-col gap-3">
        {methods.map((method) => (
          <div
            key={method.name}
            className="flex items-center justify-between rounded-xl border border-[#E5E0D6] px-4 py-3.5"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
                style={{ backgroundColor: method.iconBg }}
              >
                <method.icon size={16} style={{ color: method.iconColor }} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1F2A22]">
                  {method.name}
                </p>
                <p className="text-xs text-[#8A8A7E]">{method.meta}</p>
              </div>
            </div>

            {method.status === "active" ?
              <span className="rounded-full bg-[#D8E7DE] px-3 py-1 text-xs text-[#3E8E5A]">
                Active
              </span>
            : <button
                type="button"
                className="rounded-full bg-[#FBEADB] px-3 py-1 text-xs text-[#DE814A] hover:bg-[#F2DFC8] transition-colors"
              >
                Connect
              </button>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
