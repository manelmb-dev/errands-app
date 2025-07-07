import i18n from "./i18n";

export default function formatDayShort(dateErrand) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  // Compare the dates
  if (dateErrand === today.toISOString().split("T")[0]) {
    return i18n.t("today");
  }
  if (dateErrand === yesterday.toISOString().split("T")[0]) {
    return i18n.t("yesterday");
  }
  if (dateErrand === twoDaysAgo.toISOString().split("T")[0]) {
    return i18n.t("twoDaysAgo");
  }
  if (dateErrand === tomorrow.toISOString().split("T")[0]) {
    return i18n.t("tomorrow");
  }
  if (dateErrand === dayAfterTomorrow.toISOString().split("T")[0]) {
    return i18n.t("inTwoDays");
  }

  // If none of the above, return the full date in string format
  const formatDayShort = (dateString) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);

    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };
    return date.toLocaleDateString(i18n.locale, options);
  };

  return formatDayShort(dateErrand); // This will return in DD/MM/AA format
}
