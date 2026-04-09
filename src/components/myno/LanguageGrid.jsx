import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LANGUAGES } from "@/curriculum";

export default function LanguageGrid({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {LANGUAGES.map((lang, i) => {
        const isSelected = selected === lang.name;
        return (
          <motion.button
            key={lang.code}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => onSelect(lang.name)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer",
              isSelected
                ? "border-secondary bg-secondary/10 shadow-sea/20 shadow-md scale-[1.04]"
                : "border-border bg-card hover:border-primary hover:bg-accent/50"
            )}
          >
            <span className="text-3xl leading-none">{lang.flag}</span>
            <span className={cn(
              "text-[11px] font-bold leading-tight text-center",
              isSelected ? "text-secondary" : "text-foreground"
            )}>
              {lang.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}