export function getFuelLevelColor(percentage: number): string {
  if (percentage <= 20) return "bg-red-500";
  if (percentage <= 40) return "bg-amber-500";
  return "bg-emerald-500";
}

export function getFuelLevelHexColor(percentage: number): string {
  if (percentage <= 20) return "#ef4444";
  if (percentage <= 40) return "#f59e0b";
  return "#22c55e";
}
