export default function formatErrandDate(dateErrand) {
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
    return "Hoy";
  }
  if (dateErrand === yesterday.toISOString().split("T")[0]) {
    return "Ayer";
  }
  if (dateErrand === twoDaysAgo.toISOString().split("T")[0]) {
    return "Anteayer";
  }
  if (dateErrand === tomorrow.toISOString().split("T")[0]) {
    return "Mañana";
  }
  if (dateErrand === dayAfterTomorrow.toISOString().split("T")[0]) {
    return "Pasado mañana";
  }

  // If none of the above, return the full date in string format
  const formattedDate = (dateString) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);

    const options = {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  return formattedDate(dateErrand); // This will return in DD/MM/AA format
}
