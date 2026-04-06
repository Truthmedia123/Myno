import React from "react";
import { Volume2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function WordCard({ word, onDelete, onPlayAudio }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold text-foreground">{word.word}</h3>
          {word.phonetic && (
            <span className="text-xs text-muted-foreground">{word.phonetic}</span>
          )}
        </div>
        <div className="flex gap-2">
          {onPlayAudio && (
            <button
              onClick={() => onPlayAudio(word.word)}
              className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center hover:bg-primary/25 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-secondary" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(word.id)}
              className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          )}
        </div>
      </div>
      {word.definition && (
        <p className="text-sm text-foreground/80 mb-2">{word.definition}</p>
      )}
      {word.example_sentence && (
        <p className="text-xs text-muted-foreground italic border-l-2 border-primary pl-3">
          "{word.example_sentence}"
        </p>
      )}
      {typeof word.mastery_level === "number" && (
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Mastery</span>
            <span>{word.mastery_level}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${word.mastery_level}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}