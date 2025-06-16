import i18n from "./i18n";

const formatErrandDate = (errand) => {
  const errandDate = new Date(
    `${errand.dateErrand}T${errand.timeErrand || "20:00"}`,
  );

  const today = new Date();
  const stripTime = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const baseDate = stripTime(today);
  const targetDate = stripTime(errandDate);

  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));

  const dayNames = [
    i18n.t("sundayShort"),
    i18n.t("mondayShort"),
    i18n.t("tuesdayShort"),
    i18n.t("wednesdayShort"),
    i18n.t("thursdayShort"),
    i18n.t("fridayShort"),
    i18n.t("saturdayShort"),
  ];
  const monthNames = [
    i18n.t("januaryShort"),
    i18n.t("februaryShort"),
    i18n.t("marchShort"),
    i18n.t("aprilShort"),
    i18n.t("mayShort"),
    i18n.t("juneShort"),
    i18n.t("julyShort"),
    i18n.t("augustShort"),
    i18n.t("septemberShort"),
    i18n.t("octoberShort"),
    i18n.t("novemberShort"),
    i18n.t("decemberShort"),
  ];
  if (diffDays === 0)
    return errand.timeErrand
      ? `${i18n.t("today")}, ${errand.timeErrand}`
      : i18n.t("today");
  if (diffDays === -1) return i18n.t("yesterday");
  if (diffDays === -2) return i18n.t("twoDaysAgo");
  if (diffDays === 1)
    return errand.timeErrand
      ? `${i18n.t("tomorrow")}, ${errand.timeErrand}`
      : i18n.t("tomorrow");
  if (diffDays > 1 && diffDays < 7) {
    const weekday = dayNames[errandDate.getDay()];
    return errand.timeErrand ? `${weekday}, ${errand.timeErrand}` : weekday;
  }

  // Si está más allá de 6 días, mostrar fecha completa
  const day = errandDate.getDate();
  const month = monthNames[errandDate.getMonth()];
  return `${day} ${month}`;
};

export default formatErrandDate;
