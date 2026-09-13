"use client";

import { useSessionHeartbeat } from "@/hooks/useSessionHeartbeat";

// Renders nothing — just runs the heartbeat hook inside a server-component
// layout without converting the whole layout to a client component.
export default function SessionHeartbeat() {
  useSessionHeartbeat();
  return null;
}
