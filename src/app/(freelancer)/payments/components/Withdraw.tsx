"use client";

import { useEffect, useState } from "react";
import { Building2, Plus } from "lucide-react";
import WithdrawConfirm from "./WithdrawConfirm";

const WITHDRAWAL_FEE_RATE = 0.1;

type PayoutAccount = {
  id: string;
  bank_name: string;
  bank_code: string;
  account_number_last4: string;
  account_name: string;
  is_default: boolean;
};

type WithdrawState = "loading" | "ready" | "confirm";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<WithdrawState>("loading");

  const numericAmount = Number(amount) || 0;
  const fee = numericAmount * WITHDRAWAL_FEE_RATE;
  const netReceived = numericAmount - fee;

  const selectedAccount = payoutAccounts.find(
    (account) => account.id === selectedAccountId,
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/payments/payout-account");

        if (!res.ok) {
          throw new Error("Could not load payout information");
        }

        const data = await res.json();

        setPayoutAccounts(data.accounts ?? []);
        setAvailableBalance(Number(data.availableBalance ?? 0));

        const defaultAccount =
          data.accounts?.find((account: PayoutAccount) => account.is_default) ??
          data.accounts?.[0];

        if (defaultAccount) {
          setSelectedAccountId(defaultAccount.id);
        }

        setState("ready");
      } catch (err) {
        setError(
          err instanceof Error ?
            err.message
          : "Could not load withdrawal information",
        );
        setState("ready");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleContinue = () => {
    if (!selectedAccountId) {
      setError("Please connect and select a bank account.");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid withdrawal amount.");
      return;
    }

    if (numericAmount > availableBalance) {
      setError("Withdrawal amount exceeds your available balance.");
      return;
    }

    setError(null);
    setState("confirm");
  };

  if (state === "loading" || loading) {
    return (
      <div className="rounded-2xl border border-[#E5E0D6] bg-white h-64 animate-pulse" />
    );
  }

  if (state === "confirm" && selectedAccount) {
    return (
      <WithdrawConfirm
        amount={numericAmount}
        methodName={`${selectedAccount.bank_name} · •••• ${selectedAccount.account_number_last4}`}
        payoutAccountId={selectedAccount.id}
        onBack={() => setState("ready")}
        onSuccess={() => {
          setAmount("");
          setState("ready");
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[#1F2A22] mb-2">
          Withdrawal
        </h2>

        <p className="text-xs text-[#8A8A7E]">Available balance</p>

        <p className="text-2xl font-bold text-[#C6543A] mt-1">
          ${availableBalance.toFixed(2)}
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-[#E8B7A9] bg-[#FFF4F0] px-4 py-3">
          <p className="text-sm text-[#C6543A]">{error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:max-w-xl rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#1F2A22]">
                Payout Account
              </h3>

              <p className="text-xs text-[#8A8A7E] mt-1">
                Where should TalentQ send your earnings?
              </p>
            </div>

            <Building2 size={20} className="text-[#A8531E]" />
          </div>

          {payoutAccounts.length === 0 ?
            <div className="rounded-xl border border-dashed border-[#D8D1C4] bg-[#FBF8F3] px-5 py-8 text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-[#F2DFC8] mb-3">
                <Building2 size={20} className="text-[#A8531E]" />
              </div>

              <h4 className="text-sm font-semibold text-[#1F2A22]">
                No bank account connected
              </h4>

              <p className="text-xs text-[#8A8A7E] mt-1 max-w-sm mx-auto">
                Connect your local bank account to receive your TalentQ
                earnings.
              </p>

              <a
                href="/payments/payout-account"
                className="inline-flex items-center gap-2 mt-5 rounded-full bg-[#A8531E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors"
              >
                <Plus size={15} />
                Connect Bank Account
              </a>
            </div>
          : <>
              <div className="flex flex-col gap-3">
                {payoutAccounts.map((account) => {
                  const selected = account.id === selectedAccountId;

                  return (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => setSelectedAccountId(account.id)}
                      className={`w-full flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition-colors ${
                        selected ?
                          "border-[#DE814A] bg-[#F2DFC8]"
                        : "border-[#E5E0D6] bg-white hover:border-[#DE814A]"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 ${
                          selected ? "border-[#A8531E]" : "border-[#C9C2B4]"
                        }`}
                      >
                        {selected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#A8531E]" />
                        )}
                      </span>

                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-[#1F2A22]">
                          {account.bank_name}
                        </span>

                        <span className="block text-xs text-[#8A8A7E] mt-0.5">
                          {account.account_name}
                        </span>

                        <span className="block text-xs text-[#8A8A7E]">
                          •••• {account.account_number_last4}
                        </span>
                      </span>

                      {account.is_default && (
                        <span className="text-[10px] font-medium text-[#A8531E] bg-[#FBF0E4] rounded-full px-2 py-1">
                          Default
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <a
                href="/payments/payout-account"
                className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-[#C6543A] hover:underline"
              >
                <Plus size={14} />
                Add another bank account
              </a>
            </>
          }

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-[#1F2A22] mb-3">
              Withdrawal Amount
            </h3>

            <div className="relative max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8A8A7E]">
                $
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                placeholder="0.00"
                max={availableBalance}
                className="w-full rounded-lg border border-[#E5E0D6] bg-white pl-8 pr-4 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
              />
            </div>

            <button
              type="button"
              onClick={() => setAmount(availableBalance.toFixed(2))}
              disabled={availableBalance <= 0}
              className="mt-2 text-xs text-[#C6543A] font-medium hover:underline disabled:opacity-50"
            >
              Withdraw maximum
            </button>
          </div>

          <button
            type="button"
            disabled={
              !amount ||
              numericAmount <= 0 ||
              numericAmount > availableBalance ||
              !selectedAccountId
            }
            onClick={handleContinue}
            className="w-full mt-6 rounded-full bg-[#A8531E] py-3 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to confirm
          </button>
        </div>

        <div className="w-full lg:max-w-sm rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6">
          <h3 className="text-sm font-semibold text-[#1F2A22] mb-4">
            Withdrawal Summary
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#8A8A7E]">Available</span>
              <span className="text-[#1F2A22] font-medium">
                ${availableBalance.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8A8A7E]">Amount</span>
              <span className="text-[#1F2A22] font-medium">
                ${numericAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8A8A7E]">Withdrawal fee (10%)</span>
              <span className="text-[#C6543A] font-medium">
                -${fee.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8A8A7E]">Bank</span>
              <span className="text-[#1F2A22] font-medium">
                {selectedAccount?.bank_name ?? "—"}
              </span>
            </div>

            <div className="border-t border-[#EFEBE2] my-2" />

            <div className="flex justify-between">
              <span className="text-[#1F2A22] font-semibold">
                You&apos;ll receive
              </span>

              <span className="text-[#C6543A] font-semibold">
                ${netReceived.toFixed(2)}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#8A8A7E] mt-4">
            TalentQ&apos;s 10% service fee was already applied when the payment
            was released from escrow. A separate 10% fee applies when
            withdrawing to your bank.
          </p>
        </div>
      </div>
    </div>
  );
}
