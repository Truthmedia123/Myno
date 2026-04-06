import React from "react";
import { motion } from "framer-motion";

const sizes = { sm: 64, md: 96, lg: 140, xl: 180 };

export default function MynoBird({ size = "lg", speaking = false, pulse = false }) {
  const px = sizes[size];

  return (
    <div className="relative flex items-center justify-center" style={{ width: px, height: px }}>
      {/* Ambient glow */}
      <div
        className="absolute rounded-full bg-primary/20"
        style={{ width: px * 1.4, height: px * 1.4, filter: "blur(24px)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
      />
      {/* Pulse ring when speaking */}
      {speaking && (
        <>
          <div className="absolute inset-0 rounded-full border-4 border-primary/40 animate-pulse-ring" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-ring" style={{ animationDelay: "0.7s" }} />
        </>
      )}
      <motion.div
        animate={{ y: pulse ? [0, -10, 0] : [0, -8, 0] }}
        transition={{ duration: speaking ? 1.5 : 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: px, height: px }}
      >
        <svg viewBox="0 0 200 200" width={px} height={px}>
          {/* Body gradient */}
          <defs>
            <radialGradient id="bodyGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#006880" />
              <stop offset="100%" stopColor="#003B4D" />
            </radialGradient>
            <radialGradient id="bellyGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#98FFD8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#98FFD8" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Body */}
          <ellipse cx="100" cy="118" rx="54" ry="58" fill="url(#bodyGrad)" />
          {/* Belly highlight */}
          <ellipse cx="100" cy="130" rx="32" ry="36" fill="url(#bellyGrad)" />

          {/* Head */}
          <circle cx="100" cy="63" r="40" fill="url(#bodyGrad)" />

          {/* White eye patches */}
          <ellipse cx="83" cy="57" rx="13" ry="12" fill="white" />
          <ellipse cx="117" cy="57" rx="13" ry="12" fill="white" />

          {/* Pupils */}
          <circle cx="86" cy="57" r="7" fill="#0D1B2A" />
          <circle cx="120" cy="57" r="7" fill="#0D1B2A" />

          {/* Pupil gleam */}
          <circle cx="88" cy="54" r="2.5" fill="white" />
          <circle cx="122" cy="54" r="2.5" fill="white" />

          {/* Beak */}
          <path d="M92 69 Q100 83 108 69 Q104 73 100 74 Q96 73 92 69Z" fill="#FFAB40" />

          {/* Crown feathers – mint accent */}
          <path d="M100 25 C103 14 96 18 100 10 C104 18 97 14 100 25" fill="#98FFD8" stroke="#004E64" strokeWidth="1" />
          <path d="M92 30 C90 18 84 22 86 14 C92 20 88 18 92 30" fill="#98FFD8" stroke="#004E64" strokeWidth="0.8" />
          <path d="M108 30 C110 18 116 22 114 14 C108 20 112 18 108 30" fill="#98FFD8" stroke="#004E64" strokeWidth="0.8" />

          {/* Wings */}
          <path d="M50 100 Q28 128 44 152 Q56 135 62 116 Z" fill="#005570" />
          <path d="M150 100 Q172 128 156 152 Q144 135 138 116 Z" fill="#005570" />

          {/* Wing mint trim */}
          <path d="M50 100 Q38 118 44 138" stroke="#98FFD8" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
          <path d="M150 100 Q162 118 156 138" stroke="#98FFD8" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />

          {/* Tail */}
          <path d="M84 172 Q76 194 70 198" stroke="#004E64" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M100 174 Q100 198 100 202" stroke="#004E64" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M116 172 Q124 194 130 198" stroke="#004E64" strokeWidth="5" fill="none" strokeLinecap="round" />

          {/* Feet */}
          <path d="M83 174 L76 188 M76 188 L69 191 M76 188 L83 191" stroke="#FFAB40" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M117 174 L124 188 M124 188 L117 191 M124 188 L131 191" stroke="#FFAB40" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}