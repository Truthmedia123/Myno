import React from "react";

export default function StatCard({ icon: Icon, value, label, color = "primary" }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-card rounded-2xl p-4 shadow-sm border border-border min-w-[120px]">
      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-1">
        <Icon className="w-5 h-5 text-secondary" />
      </div>
      <span className="text-2xl font-extrabold text-foreground">{value}</span>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}