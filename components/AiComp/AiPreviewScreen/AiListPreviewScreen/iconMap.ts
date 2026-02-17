// components/AiComp/iconMap.ts
import type { ComponentProps } from "react";

import { Ionicons } from "@expo/vector-icons";

import { LIST_ICONS, type ListIcon } from "../../../../constants/listOptions";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const ICON_SET = new Set<ListIcon>(LIST_ICONS);

export function isListIcon(value: unknown): value is ListIcon {
  return typeof value === "string" && ICON_SET.has(value as ListIcon);
}

export function safeListIcon(
  icon: unknown,
  fallback: ListIcon = "list",
): ListIcon {
  return isListIcon(icon) ? icon : fallback;
}

export function toIoniconName(
  icon: unknown,
  fallback: ListIcon = "list",
): IoniconName {
  return safeListIcon(icon, fallback) as IoniconName;
}
