export function messagesLink(
  role: "employer" | "freelancer" | "admin",
  conversationId: string,
) {
  return role === "employer"
    ? `/employer/messages?conversation=${conversationId}`
    : `/messages?conversation=${conversationId}`;
}
