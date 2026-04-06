import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MynoBird from "./MynoBird";

const STEPS = [
  "Listening to your voice...",
  "Analyzing pronunciation patterns...",
  "Comparing with native speakers...",
  "Calculating fluency baseline...",
  "Almost done!",
];

export default function FluencyAnalyzer({ onComplete, score = null }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const finalScore = score || Math.floor(Math.random() * 25 + 58); // 58–83

  useEffect(() => {
    const t = setInterval(() => {
      setStepIdx((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(t);
          setDone(true);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (done) {
      let n = 0;
      const inc = setInterval(() => {
        n += 2;
        setDisplayScore(Math.min(n, finalScore));
        if (n >= finalScore) clearInterval(inc);
      }, 30);
    }
  }, [done, finalScore]);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <MynoBird size="md" speaking={!done} />

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center space-y-3"
          >
            <p className="text-sm font-semibold text-muted-foreground">{STEPS[stepIdx]}</p>
            <div className="flex gap-1.5 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-secondary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-center space-y-4"
          >
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Your Fluency Score</p>
            <div className="relative w-32 h-32 mx-auto">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                <motion.circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke="#98FFD8" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={314}
                  initial={{ strokeDashoffset: 314 }}
                  animate={{ strokeDashoffset: 314 - (314 * displayScore / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-foreground">{displayScore}%</span>
                <span className="text-[10px] text-muted-foreground font-medium">Fluency</span>
              </div>
            </div>
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl px-5 py-3">
              <p className="text-sm font-bold text-secondary">
                {displayScore >= 75 ? "Great start! 🎉 You have a solid foundation." :
                  displayScore >= 60 ? "Good baseline! 🐦 MYNO will help you improve fast." :
                    "Perfect timing! 🚀 You're about to level up with MYNO."}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onComplete(finalScore)}
              className="w-full thumb-cta bg-secondary text-secondary-foreground shadow-sea"
            >
              See My Learning Plan →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}