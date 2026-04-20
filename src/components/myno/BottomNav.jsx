import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon as HomeOutline,
  ChatBubbleLeftRightIcon as MessageCircleOutline,
  BookOpenIcon as BookOpenOutline,
  BookmarkIcon as BookmarkOutline,
  TrophyIcon as CrownOutline,
  ChartBarIcon as ChartBarOutline
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolid,
  ChatBubbleLeftRightIcon as MessageCircleSolid,
  BookOpenIcon as BookOpenSolid,
  BookmarkIcon as BookmarkSolid,
  TrophyIcon as CrownSolid,
  ChartBarIcon as ChartBarSolid
} from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  {
    path: "/",
    iconOutline: HomeOutline,
    iconSolid: HomeSolid,
    label: "Home"
  },
  {
    path: "/chat",
    iconOutline: MessageCircleOutline,
    iconSolid: MessageCircleSolid,
    label: "Practice"
  },
  {
    path: "/vault",
    iconOutline: BookOpenOutline,
    iconSolid: BookOpenSolid,
    label: "Vault"
  },
  {
    path: "/progress",
    iconOutline: ChartBarOutline,
    iconSolid: ChartBarSolid,
    label: "Progress"
  },
  {
    path: "/pro",
    iconOutline: CrownOutline,
    iconSolid: CrownSolid,
    label: "Pro"
  },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map(({ path, iconOutline: IconOutline, iconSolid: IconSolid, label }) => {
          const active = pathname === path;
          const Icon = active ? IconSolid : IconOutline;
          return (
            <Link key={path} to={path} className="relative flex flex-col items-center gap-0.5 px-5 py-2" aria-label={label}>
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