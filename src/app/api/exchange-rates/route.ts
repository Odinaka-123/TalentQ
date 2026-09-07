import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const STALE_AFTER_MS = 12 * 60 * 60 * 1000; // 12 hours
const BASE_CURRENCY = "NGN";

export async function GET() {
  const admin = createAdminClient();

  const { data: cached } = await admin
    .from("exchange_rates")
    .select("rates, fetched_at")
    .eq("id", true)
    .maybeSingle();

  const isFresh =
    cached && Date.now() - new Date(cached.fetched_at).getTime() < STALE_AFTER_MS;

  if (isFresh) {
    return NextResponse.json({ base: BASE_CURRENCY, rates: cached.rates });
  }

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${BASE_CURRENCY}`);
    const data = await res.json();

    if (data.result !== "success" || !data.rates) {
      throw new Error("Unexpected response from exchange rate provider");
    }

    const rates = {
      USD: data.rates.USD,
      NGN: data.rates.NGN,
      EUR: data.rates.EUR,
      GBP: data.rates.GBP,
    };

    await admin.from("exchange_rates").upsert({
      id: true,
      base_currency: BASE_CURRENCY,
      rates,
      fetched_at: new Date().toISOString(),
    });

    return NextResponse.json({ base: BASE_CURRENCY, rates });
  } catch (err) {
    // If the fetch fails but we have a stale cache, serve it rather than
    // erroring out the whole app's currency display.
    if (cached) {
      return NextResponse.json({ base: BASE_CURRENCY, rates: cached.rates });
    }
    console.error("Failed to fetch exchange rates:", err);
    return NextResponse.json(
      { error: "Could not load exchange rates" },
      { status: 502 },
    );
  }
}
