import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "../../../constants/i18n";

const getCurrentWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { startOfWeek: monday, endOfWeek: sunday };
};

const getDateTime = (e) =>
  new Date(`${e.dateErrand}T${e.timeErrand || "20:00"}`);

const enrichErrands = (errands) =>
  errands.map((e) => ({
    ...e,
    dateTime: getDateTime(e),
    completedDate: e.completedDateErrand ? new Date(e.completedDateErrand) : "",
  }));

const getPending = (errands, now, end) =>
  errands.filter((e) => e.dateTime >= now && e.dateTime <= end);

const getOverdue = (errands, now) => errands.filter((e) => e.dateTime <= now);

export const getSharedSlides = (errands, user) => {
  const rightNow = new Date();

  const { startOfWeek, endOfWeek } = getCurrentWeekRange();
  const enrichedErrands = enrichErrands(errands);

  // Sahred errands
  const outgoingErrands = enrichedErrands
    .filter((e) => !e.deleted)
    .filter(
      (e) =>
        e.ownerId === user.id &&
        e.assignedId !== user.id &&
        !e.completed &&
        e.dateErrand &&
        e.dateTime <= endOfWeek
    );

  const incomingErrands = enrichedErrands
    .filter((e) => !e.deleted)
    .filter(
      (e) =>
        e.ownerId !== user.id &&
        e.assignedId === user.id &&
        !e.completed &&
        e.dateErrand &&
        e.dateTime <= endOfWeek
    );

  const completedSharedErrands = enrichedErrands
    .filter((e) => !e.deleted)
    .filter(
      (e) =>
        e.ownerId !== e.assignedId &&
        e.completed &&
        ((e.completedDateErrand >= startOfWeek &&
          e.completedDateErrand <= endOfWeek) ||
          (e.dateErrand &&
            e.dateTime >= startOfWeek &&
            e.dateTime <= endOfWeek))
    );

  // Incoming errands
  const incomingPending = getPending(incomingErrands, rightNow, endOfWeek);

  const incomingOverdue = getOverdue(incomingErrands, rightNow);

  const incomingCompleted = completedSharedErrands.filter(
    (e) => e.ownerId !== user.id && e.assignedId === user.id,
  );

  // Outgoing errands
  const outgoingPending = getPending(outgoingErrands, rightNow, endOfWeek);

  const outgoingOverdue = getOverdue(outgoingErrands, rightNow);

  const outgoingCompleted = completedSharedErrands.filter(
    (e) => e.ownerId === user.id && e.assignedId !== user.id,
  );

  const sharedCards = [
    {
      label: i18n.t("outgoing"),
      value: outgoingErrands.length,
      route: "/sharedTasks",
      params: { type: "outgoing", status: "pending" },
    },
    {
      label: i18n.t("incoming"),
      value: incomingErrands.length,
      route: "/sharedTasks",
      params: { type: "incoming", status: "pending" },
    },
    {
      label: i18n.t("completed"),
      value: completedSharedErrands.length,
      route: "/sharedTasks",
      params: { type: "all", status: "completed" },
    },
  ];

  const incomingCards = [
    {
      label: i18n.t("pending"),
      value: incomingPending.length,
      route: "/sharedTasks",
      params: { type: "incoming", status: "pending" },
    },
    {
      label: i18n.t("overdue"),
      value: incomingOverdue.length,
      route: "/sharedTasks",
      params: { type: "incoming", status: "pending" },
    },
    {
      label: i18n.t("completed"),
      value: incomingCompleted.length,
      route: "/sharedTasks",
      params: { type: "incoming", status: "completed" },
    },
  ];

  const outgoingCards = [
    {
      label: i18n.t("pending"),
      value: outgoingPending.length,
      route: "/sharedTasks",
      params: { type: "outgoing", status: "pending" },
    },
    {
      label: i18n.t("overdue"),
      value: outgoingOverdue.length,
      route: "/sharedTasks",
      params: { type: "outgoing", status: "pending" },
    },
    {
      label: i18n.t("completed"),
      value: outgoingCompleted.length,
      route: "/sharedTasks",
      params: { type: "outgoing", status: "completed" },
    },
  ];

  const slides = [
    {
      title: i18n.t("shared"),
      secondTitle: i18n.t("thisWeek"),
      icon: { name: "account-group", lib: MaterialCommunityIcons, size: 29 },
      data: sharedCards,
      route: "/sharedTasks",
      params: { type: "all", status: "pending" },
    },
    {
      title: i18n.t("incoming"),
      secondTitle: i18n.t("thisWeek"),
      icon: { name: "tray-arrow-down", lib: MaterialCommunityIcons, size: 29 },
      data: incomingCards,
      route: "/sharedTasks",
      params: { type: "incoming", status: "pending" },
    },
    {
      title: i18n.t("outgoing"),
      secondTitle: i18n.t("thisWeek"),
      icon: { name: "call-made", lib: MaterialCommunityIcons, size: 29 },
      data: outgoingCards,
      route: "/sharedTasks",
      params: { type: "outgoing", status: "pending" },
    },
  ];

  return slides;
};
