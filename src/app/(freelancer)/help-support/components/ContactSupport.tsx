"use client";

import { MessageCircle, Mail, Users } from "lucide-react";
import ContactChannelCard from "./ContactChannelCard";
import SupportTicketForm from "./SupportTicketForm";
import { openLiveChat } from "@/lib/tawk";

const SUPPORT_EMAIL = "contact.talentq@gmail.com";

export default function ContactSupport() {
  const channels = [
    {
      icon: MessageCircle,
      iconColor: "#8A5FC7",
      iconBg: "#EDE4F7",
      title: "Live Chat",
      description: "Avg. response: 8 min",
      actionLabel: "Start Chat",
      onAction: openLiveChat,
    },
    {
      icon: Mail,
      iconColor: "#C755A0",
      iconBg: "#F7DFEF",
      title: "Email Support",
      description: "Response within 4 hours",
      actionLabel: "Send Email",
      onAction: () => {
        window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
          "TalentQ Support Request",
        )}`;
      },
    },
    {
      icon: Users,
      iconColor: "#8A5FC7",
      iconBg: "#EDE4F7",
      title: "Community Forum",
      description: "Coming soon",
      actionLabel: "Coming Soon",
      onAction: () => {},
      disabled: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <ContactChannelCard key={channel.title} {...channel} />
        ))}
      </div>

      <SupportTicketForm />
    </div>
  );
}
