export default function formatErrandDate(errand) {
  const errandDate = new Date(
    `${errand.dateErrand}T${errand.timeErrand || "24:00"}`,
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
    return errand.timeErrand ? `Hoy, ${errand.timeErrand}` : "Hoy";
  }
  if (
    errandDate.toISOString().split("T")[0] ===
    yesterday.toISOString().split("T")[0]
  ) {
    return "Ayer";
  }
  if (
    errandDate.toISOString().split("T")[0] ===
    twoDaysAgo.toISOString().split("T")[0]
  ) {
    return "Anteayer";
  }
  if (
    errandDate.toISOString().split("T")[0] ===
    tomorrow.toISOString().split("T")[0]
  ) {
    return errand.timeErrand ? `Mañana, ${errand.timeErrand}` : "Mañana";
  }
  if (
    errandDate.toISOString().split("T")[0] ===
    dayAfterTomorrow.toISOString().split("T")[0]
  ) {
    return errand.timeErrand
      ? `Pasado mañana, ${errand.timeErrand}`
      : "Pasado mañana";
  }

  // If none of the above, return the full date in DD/MM/YY format
  const formattedDate = errandDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return formattedDate; // This will return in DD/MM/AA format
}
