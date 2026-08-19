import { createClient } from "@/lib/supabase/client";

export async function submitSupportTicket(
  userId: string,
  ticket: { category: string; subject: string; message: string },
) {
  const supabase = createClient();

  const { error } = await supabase.from("support_tickets").insert({
    user_id: userId,
    category: ticket.category,
    subject: ticket.subject,
    message: ticket.message,
  });

  if (error) throw error;
}
