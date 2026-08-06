import React from "react";

interface BadgeProps {
  tone: "green" | "gray" | "amber";
  children: React.ReactNode;
}

const tones = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  gray: "bg-gray-50 text-gray-600 ring-gray-500/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

export default function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
}