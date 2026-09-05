"use client";

import { useEffect, useState } from "react";
import { Building2, CheckCircle2, Loader2 } from "lucide-react";

type Bank = { name: string; code: string };

export default function ConnectPayoutAccount({
  onConnected,
}: {
  onConnected: () => void;
}) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const [loadingBanks, setLoadingBanks] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedBank = banks.find((b) => b.code === bankCode);

  useEffect(() => {
    const loadBanks = async () => {
      try {
        const res = await fetch("/api/payments/banks");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setBanks(data.banks);
      } catch {
        setError("Could not load banks. Try refreshing the page.");
      } finally {
        setLoadingBanks(false);
      }
    };
    loadBanks();
  }, []);

  const handleResolve = async () => {
    setError(null);
    setResolved(false);
    setResolving(true);

    try {
      const res = await fetch("/api/payments/resolve-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber, bankCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (!data.accountName) {
        throw new Error(
          "Couldn't retrieve an account name for this number. Double-check the details and try again.",
        );
      }

      setAccountName(data.accountName);
      setResolved(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not verify this account",
      );
    } finally {
      setResolving(false);
    }
  };

  const handleSave = async () => {
    setError(null);

    if (!accountName) {
      setError("Please verify the account before saving.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/payments/payout-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountNumber,
          bankCode,
          bankName: selectedBank?.name,
          accountName,
          isDefault: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onConnected();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save this account",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E5E0D6] bg-white px-6 py-6 max-w-md">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FBEADB]">
          <Building2 size={18} className="text-[#DE814A]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#1F2A22]">
            Connect a bank account
          </h3>
          <p className="text-xs text-[#8A8A7E]">
            Nigerian bank accounts only, for now
          </p>
        </div>
      </div>

      {error && (
        <p className="text-xs text-[#C6543A] bg-[#FBEBE9] rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-[#1F2A22] mb-1.5 block">
            Bank
          </label>
          {loadingBanks ?
            <div className="h-10 rounded-lg bg-[#F5F1E9] animate-pulse" />
          : <select
              value={bankCode}
              onChange={(e) => {
                setBankCode(e.target.value);
                setResolved(false);
                setAccountName("");
              }}
              className="w-full rounded-lg border border-[#E5E0D6] px-3 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
            >
              <option value="">Select your bank</option>
              {banks.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          }
        </div>

        <div>
          <label className="text-xs font-medium text-[#1F2A22] mb-1.5 block">
            Account number
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value.replace(/\D/g, ""));
              setResolved(false);
              setAccountName("");
            }}
            placeholder="10-digit account number"
            className="w-full rounded-lg border border-[#E5E0D6] px-3 py-2.5 text-sm text-[#1F2A22] outline-none focus:border-[#DE814A]"
          />
        </div>

        {resolved ?
          <div className="flex items-center gap-2 rounded-lg bg-[#DDEEE2] px-3 py-2.5">
            <CheckCircle2 size={16} className="text-[#3E8E5A] shrink-0" />
            <p className="text-sm text-[#2E6B44]">{accountName}</p>
          </div>
        : <button
            type="button"
            onClick={handleResolve}
            disabled={!bankCode || accountNumber.length !== 10 || resolving}
            className="rounded-full border border-[#DE814A] py-2.5 text-sm font-medium text-[#C6543A] hover:bg-[#FBF0E4] transition-colors disabled:opacity-50"
          >
            {resolving ?
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Verifying...
              </span>
            : "Verify account"}
          </button>
        }

        <button
          type="button"
          onClick={handleSave}
          disabled={!resolved || saving}
          className="rounded-full bg-[#A8531E] py-2.5 text-sm font-medium text-white hover:bg-[#94481A] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save this account"}
        </button>
      </div>
    </div>
  );
}
