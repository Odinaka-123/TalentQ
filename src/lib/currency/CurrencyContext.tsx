"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchExchangeRates,
  getPreferredCurrency,
  updatePreferredCurrency,
  type CurrencyCode,
  type ExchangeRates,
} from "@/lib/queries/currency";

const SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  NGN: "₦",
  EUR: "€",
  GBP: "£",
};

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  loading: boolean;
  /**
   * Converts and formats an amount stored in NGN into the user's preferred
   * currency. Pass signed=true to prefix positive amounts with "+" (for
   * transaction-style credit/debit displays) — negative amounts always
   * show their own "-" regardless of this flag.
   */
  formatCurrency: (ngnAmount: number, signed?: boolean) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("NGN");
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const [ratesResult, preferenceResult] = await Promise.allSettled([
        fetchExchangeRates(),
        user ? getPreferredCurrency(user.id) : Promise.resolve("NGN" as CurrencyCode),
      ]);

      if (user) setUserId(user.id);
      if (ratesResult.status === "fulfilled") setRates(ratesResult.value);
      if (preferenceResult.status === "fulfilled") {
        setCurrencyState(preferenceResult.value);
      }

      setLoading(false);
    };

    init();
  }, []);

  const setCurrency = useCallback(
    (next: CurrencyCode) => {
      setCurrencyState(next);
      if (userId) {
        updatePreferredCurrency(userId, next).catch(() => {
          // best-effort — keep the local selection even if persisting fails
        });
      }
    },
    [userId],
  );

  const formatCurrency = useCallback(
    (ngnAmount: number, signed = false): string => {
      const rate = rates ? (rates[currency] ?? 1) : 1;
      const rateInNgn = rates?.NGN || 1;
      const converted = rates ? (ngnAmount / rateInNgn) * rate : ngnAmount;
      const symbol = rates ? SYMBOLS[currency] : "₦";

      const abs = Math.abs(converted).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      if (!signed) return `${symbol}${abs}`;
      return converted < 0 ? `-${symbol}${abs}` : `+${symbol}${abs}`;
    },
    [rates, currency],
  );

  const value = useMemo(
    () => ({ currency, setCurrency, loading, formatCurrency }),
    [currency, setCurrency, loading, formatCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
