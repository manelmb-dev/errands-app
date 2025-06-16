import i18n from "./i18n";

export default function formatCompletedErrandDate(errand) {
  const errandDate = new Date(
    `${errand.completedDateErrand}T${errand.completedTimeErrand}`,
  );
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
  if (
    errandDate.toISOString().split("T")[0] === today.toISOString().split("T")[0]
  ) {
    return i18n.t("today");
  }
  if (
    errandDate.toISOString().split("T")[0] ===
    yesterday.toISOString().split("T")[0]
  ) {
    return i18n.t("yesterday");
  }
  if (
    errandDate.toISOString().split("T")[0] ===
    twoDaysAgo.toISOString().split("T")[0]
  ) {
    return i18n.t("twoDaysAgo");
  }

  // If none of the above, return the full date in DD/MM/YY format
  const formattedDate = errandDate.toLocaleDateString(i18n.locale, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return formattedDate; // This will return in DD/MM/AA format
}
