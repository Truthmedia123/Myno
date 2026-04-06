import React from "react";
import { motion } from "framer-motion";

export default function OnboardingStep({ children, direction = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full flex flex-col items-center"
    >
      {children}
    </motion.div>
  );
}