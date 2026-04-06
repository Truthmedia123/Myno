import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, BookOpen, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/chat", icon: MessageCircle, label: "Coach" },
  { path: "/vault", icon: BookOpen, label: "Vault" },
  { path: "/pro", icon: Crown, label: "Pro" },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = pathname === path;
          return (
            <Link key={path} to={path} className="relative flex flex-col items-center gap-0.5 px-5 py-2">
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-primary/20 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "w-5 h-5 relative z-10 transition-colors",
                  active ? "text-secondary" : "text-muted-foreground"
                )}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span className={cn(
                "text-[10px] font-semibold relative z-10 transition-colors",
                active ? "text-secondary" : "text-muted-foreground"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}