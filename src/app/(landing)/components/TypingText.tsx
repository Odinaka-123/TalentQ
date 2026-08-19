"use client";

import { useEffect, useState } from "react";

type TypingTextProps = {
  text: string;
  speed?: number;
};

type TypingTextContentProps = {
  text: string;
  speed: number;
};

function TypingTextContent({ text, speed }: TypingTextContentProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className="relative inline-grid">
      <span className="invisible whitespace-nowrap">{text}</span>
      <span className="absolute inset-0 whitespace-nowrap">
        {displayed}
        <span className="animate-pulse">|</span>
      </span>
    </span>
  );
}

export default function TypingText({ text, speed = 40 }: TypingTextProps) {
  return <TypingTextContent key={`${text}-${speed}`} text={text} speed={speed} />;
}
