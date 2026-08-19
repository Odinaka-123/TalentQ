type MessageBubbleProps = {
  text: string;
  time: string;
  fromMe: boolean;
};

export default function MessageBubble({
  text,
  time,
  fromMe,
}: MessageBubbleProps) {
  return (
    <div className={`flex ${fromMe ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-md rounded-2xl px-4 py-3 ${
          fromMe ?
            "bg-[#A8531E] text-white"
          : "bg-white text-[#1F2A22] shadow-[0px_1px_3px_0px_#00000014]"
        }`}
      >
        <p className="text-sm">{text}</p>
        <p
          className={`text-xs mt-1 ${
            fromMe ? "text-white/70" : "text-[#8A8A7E]"
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}
