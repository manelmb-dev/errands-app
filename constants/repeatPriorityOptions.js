import i18n from "./i18n";

export const repeatOptions = [
  { label: i18n.t("never"), value: "never" },
  { label: i18n.t("daily"), value: "daily" },
  { label: i18n.t("weekDays"), value: "weekDays" },
  { label: i18n.t("weekendDays"), value: "weekendDays" },
  { label: i18n.t("weekly"), value: "weekly" },
  { label: i18n.t("monthly"), value: "monthly" },
  { label: i18n.t("yearly"), value: "yearly" },
];

export const priorityOptions = [
  { label: i18n.t("high"), value: "high" },
  { label: i18n.t("medium"), value: "medium" },
  { label: i18n.t("low"), value: "low" },
  { label: i18n.t("none"), value: "none" },
];
