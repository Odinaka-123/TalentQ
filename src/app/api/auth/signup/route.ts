import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeError, sanitizeError } from "@/lib/api/sanitizeError";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return safeError("Name, email, and password are required");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (error) {
    // Supabase returns a specific, safe-to-show message here (e.g. "User
    // already registered") — not a raw driver error, so it's fine to pass
    // through rather than flattening to a generic message.
    return safeError(error.message, 400);
  }

  if (!data.user) {
    return sanitizeError(new Error("signUp returned no user"), "auth/signup");
  }

  return NextResponse.json({ success: true });
}
