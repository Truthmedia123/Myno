import React from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatBubble({ message, onPlayAudio }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2 mb-3", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-3xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-secondary text-secondary-foreground rounded-br-lg"
            : "bg-card border border-border text-foreground rounded-bl-lg"
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        {!isUser && onPlayAudio && (
          <button
            onClick={() => onPlayAudio(message.content)}
            className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-secondary transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Play audio</span>
          </button>
        )}
      </div>
    </div>
  );
}