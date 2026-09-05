// src/components/ui/RiskBadge.tsx
import type { RiskLevel } from "@/types";
import { cn } from "@/lib/utils";

const CONFIG: Record<
  RiskLevel,
  { label: string; classes: string }
> = {
  Critical: {
    label: "CRITICAL",
    classes: "bg-red-100 text-red-700 border border-red-200",
  },
  High: {
    label: "HIGH",
    classes: "bg-orange-100 text-orange-700 border border-orange-200",
  },
  Medium: {
    label: "MEDIUM",
    classes: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  Low: {
    label: "LOW",
    classes: "bg-green-100 text-green-700 border border-green-200",
  },
};

interface Props {
  level: RiskLevel;
  className?: string;
}

export default function RiskBadge({ level, className }: Props) {
  const cfg = CONFIG[level];
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide",
        cfg.classes,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}
