import { NextResponse } from "next/server";

const GENERIC_MESSAGE = "Something went wrong. Please try again.";

export function sanitizeError(
  error: unknown,
  context: string,
  status = 500,
) {
  // Full detail server-side only.
  console.error(`[${context}]`, error);

  return NextResponse.json({ error: GENERIC_MESSAGE }, { status });
}

// For known/expected error shapes where you DO want to surface something
// specific (e.g. validation), pass an explicit safe message instead of
// letting the raw error reach the client.
export function safeError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
