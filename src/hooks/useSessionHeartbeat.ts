"use client";

import { useEffect, useRef } from "react";

const PING_INTERVAL_MS = 60 * 1000; // throttle: at most once/min

export function useSessionHeartbeat() {
  const lastPingRef = useRef(0);

  useEffect(() => {
    const ping = () => {
      const now = Date.now();
      if (now - lastPingRef.current < PING_INTERVAL_MS) return;
      lastPingRef.current = now;
      fetch("/api/auth/heartbeat", { method: "POST" }).catch(() => {});
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, ping, { passive: true }));

    const onVisible = () => {
      if (document.visibilityState === "visible") ping();
    };
    document.addEventListener("visibilitychange", onVisible);

    ping(); // stamp on mount

    return () => {
      events.forEach((e) => window.removeEventListener(e, ping));
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
}
