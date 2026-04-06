import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrophyIcon, ChatBubbleLeftRightIcon, MicrophoneIcon, WifiIcon, BoltIcon, CheckIcon } from "@heroicons/react/24/outline";
import MynoBird from "@/components/myno/MynoBird";
import { schedulePaywallDrip, requestNotificationPermission, scheduleStreakReminder } from "@/lib/notifications";

const BENEFITS = [
  { icon: ChatBubbleLeftRightIcon, text: "Unlimited AI conversations daily" },
  { icon: MicrophoneIcon, text: "Advanced pronunciation scoring" },
  { icon: WifiIcon, text: "Offline lesson packs" },
  { icon: BoltIcon, text: "Priority AI with faster responses" },
];

export default function Paywall() {
  const navigate = useNavigate();

  useEffect(() => {
    requestNotificationPermission().then(scheduleStreakReminder);
  }, []);

  const handleDismiss = async () => {
    await requestNotificationPermission();
    schedulePaywallDrip();
    navigate("/");
  };

  const handleSubscribe = () => {
    // In production: wire to Stripe/RevenueCat
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Hero gradient */}
      <div className="relative flex flex-col items-center pt-10 pb-6 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
            <MynoBird size="md" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/20 mb-3">
              <TrophyIcon className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider">MYNO Pro</span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground leading-tight">
              Reach 100% Fluency<br />in 30 Days.
            </h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              A full month of MYNO Pro costs less than<br />
              <span className="font-semibold text-foreground">a single hour with a private tutor.</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-6 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 mb-6"
        >
          {BENEFITS.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.08 }}
              className="flex items-center gap-3 bg-card rounded-2xl p-4 border border-border shadow-card"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-sm font-semibold text-foreground flex-1">{text}</p>
              <CheckIcon className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={3} />
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="bg-secondary rounded-3xl p-5 text-center text-secondary-foreground mb-4"
        >
          <p className="text-[11px] font-bold opacity-70 uppercase tracking-widest mb-1">Most Popular</p>
          <div className="flex items-end justify-center gap-1 mb-1">
            <span className="text-4xl font-extrabold">₹499</span>
            <span className="text-sm opacity-70 mb-1.5">/month</span>
          </div>
          <p className="text-xs opacity-60">Or ₹3,999/year — save 33%</p>
        </motion.div>
      </div>

      {/* CTAs — thumb zone */}
      <div className="px-6 pb-10 pt-2 space-y-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubscribe}
          className="thumb-cta w-full bg-secondary text-secondary-foreground shadow-sea flex items-center justify-center gap-2"
        >
          <TrophyIcon className="w-5 h-5" />
          Start 7-Day Free Trial
        </motion.button>

        <div className="flex justify-center">
          <button
            onClick={handleDismiss}
            className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors py-2"
          >
            Not now, thanks
          </button>
        </div>
      </div>
    </div>
  );
}
