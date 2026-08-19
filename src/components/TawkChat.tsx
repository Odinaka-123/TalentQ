"use client";

import Script from "next/script";
import { setupTawkAutoHide } from "@/lib/tawk";

const TAWK_PROPERTY_ID = "6a846e515981892f72ddf3ee";
const TAWK_WIDGET_ID = "1k0aktru2";

export default function TawkChat() {
  return (
    <Script
      id="tawk-to-widget"
      strategy="lazyOnload"
      src={`https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`}
      onReady={() => {
        // Tawk_API isn't fully populated the instant the script tag loads —
        // it finishes initializing shortly after, so wait a beat before hiding.
        setTimeout(setupTawkAutoHide, 1000);
      }}
    />
  );
}
