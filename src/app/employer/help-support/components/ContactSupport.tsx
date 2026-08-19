import { MessageCircle, Mail, Users } from "lucide-react";
import ContactChannelCard from "./ContactChannelCard";
import SupportTicketForm from "./SupportTicketForm";

const channels = [
  {
    icon: MessageCircle,
    iconColor: "#8A5FC7",
    iconBg: "#EDE4F7",
    title: "Live Chat",
    description: "Avg. response: 8 min",
    actionLabel: "Start Chat",
  },
  {
    icon: Mail,
    iconColor: "#C755A0",
    iconBg: "#F7DFEF",
    title: "Email Support",
    description: "Response within 4 hours",
    actionLabel: "Send Email",
  },
  {
    icon: Users,
    iconColor: "#8A5FC7",
    iconBg: "#EDE4F7",
    title: "Employer Community",
    description: "Help from other employers",
    actionLabel: "Open Forum",
  },
];

export default function ContactSupport() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <ContactChannelCard
            key={channel.title}
            {...channel}
            onAction={() => {
              // TODO: wire up live chat / mailto / forum link once decided
            }}
          />
        ))}
      </div>

      <SupportTicketForm />
    </div>
  );
}
