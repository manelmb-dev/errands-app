const formatErrandDate = (errand) => {
  const errandDate = new Date(
    `${errand.dateErrand}T${errand.timeErrand || "20:00"}`
  );

  const today = new Date();
  const stripTime = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const baseDate = stripTime(today);
  const targetDate = stripTime(errandDate);

  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));

  const dayNames = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const monthNames = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];
  if (diffDays === 0)
    return errand.timeErrand ? `Hoy, ${errand.timeErrand}` : "Hoy";
  if (diffDays === -1) return "Ayer";
  if (diffDays === -2) return "Anteayer";
  if (diffDays === 1)
    return errand.timeErrand ? `Mañana, ${errand.timeErrand}` : "Mañana";
  if (diffDays > 1 && diffDays < 7) {
    const weekday = dayNames[errandDate.getDay()];
    return errand.timeErrand ? `${weekday}, ${errand.timeErrand}` : weekday;
  }

  // Si está más allá de 6 días, mostrar fecha completa
  const day = errandDate.getDate();
  const month = monthNames[errandDate.getMonth()];
  return `${day} ${month}`;
}

export default formatErrandDate;
