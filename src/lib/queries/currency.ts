import { createClient } from "@/lib/supabase/client";

export type CurrencyCode = "USD" | "NGN" | "EUR" | "GBP";

export type ExchangeRates = Record<CurrencyCode, number>;

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  const res = await fetch("/api/exchange-rates");
  if (!res.ok) throw new Error("Could not load exchange rates");
  const data = await res.json();
  return data.rates;
}

export async function getPreferredCurrency(
  userId: string,
): Promise<CurrencyCode> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("preferred_currency")
    .eq("id", userId)
    .single();

  return (data?.preferred_currency as CurrencyCode) ?? "NGN";
}

export async function updatePreferredCurrency(
  userId: string,
  currency: CurrencyCode,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ preferred_currency: currency })
    .eq("id", userId);

  if (error) throw error;
}
