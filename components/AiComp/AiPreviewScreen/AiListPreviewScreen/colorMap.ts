// components/AiComp/colorMap.ts
import { LIST_COLORS, type ListColor } from "../../../../constants/listOptions";

import { ThemeMode } from "../../../../constants/storeUiAtoms";

const COLOR_SET = new Set<ListColor>(LIST_COLORS);

export function isListColor(value: unknown): value is ListColor {
  return typeof value === "string" && COLOR_SET.has(value as ListColor);
}

export function safeListColor(
  color: unknown,
  fallback: ListColor = "blue",
): ListColor {
  return isListColor(color) ? color : fallback;
}

const BG_LIGHT: Record<ListColor, string> = {
  slate: "bg-slate-300",
  zinc: "bg-zinc-300",
  stone: "bg-stone-300",
  red: "bg-red-300",
  orange: "bg-orange-300",
  amber: "bg-amber-300",
  yellow: "bg-yellow-300",
  lime: "bg-lime-300",
  green: "bg-green-300",
  emerald: "bg-emerald-300",
  teal: "bg-teal-300",
  cyan: "bg-cyan-300",
  sky: "bg-sky-300",
  blue: "bg-blue-300",
  indigo: "bg-indigo-300",
  violet: "bg-violet-300",
  purple: "bg-purple-300",
  fuchsia: "bg-fuchsia-300",
  pink: "bg-pink-300",
  rose: "bg-rose-300",
};

const BG_DARK: Record<ListColor, string> = {
  slate: "bg-slate-600",
  zinc: "bg-zinc-600",
  stone: "bg-stone-600",
  red: "bg-red-600",
  orange: "bg-orange-600",
  amber: "bg-amber-600",
  yellow: "bg-yellow-600",
  lime: "bg-lime-600",
  green: "bg-green-600",
  emerald: "bg-emerald-600",
  teal: "bg-teal-600",
  cyan: "bg-cyan-600",
  sky: "bg-sky-600",
  blue: "bg-blue-600",
  indigo: "bg-indigo-600",
  violet: "bg-violet-600",
  purple: "bg-purple-600",
  fuchsia: "bg-fuchsia-600",
  pink: "bg-pink-600",
  rose: "bg-rose-600",
};

export function listColorBgClass(color: unknown, theme: ThemeMode) {
  const c = safeListColor(color);
  return theme === "light" ? BG_LIGHT[c] : BG_DARK[c];
}
