import type { ThemeMode } from "./storeUiAtoms";

export type ThemeTokens = {
  background: string;
  surfaceBackground: string;
  iconColor: string;
  blueHeadText: string;
  text: string;
  taskTitle: string;
  taskSecondText: string;
  addNewTaskText: string;
  outgoingTaskToBg: string;
  taskIncomingFromBg: string;
  taskAssignedSharedListBg: string;
  listTitle: string;
  borderColor: string;
  popupShadow: string;
};

export const themes: Record<ThemeMode, ThemeTokens> = {
  light: {
    background: "#F5F5F5",
    surfaceBackground: "#FFFFFF",
    iconColor: "#333333",
    blueHeadText: "#007AFF",
    text: "#1E1E1E",
    taskTitle: "#1E1E1E",
    taskSecondText: "#6E727A",
    addNewTaskText: "#A2A6AD",
    outgoingTaskToBg: "#D3F3E0",
    taskIncomingFromBg: "#F0EEFD",
    taskAssignedSharedListBg: "#bad6f0",
    listTitle: "#161618",
    borderColor: "#e0e0e0",
    popupShadow: "#000000",
  },
  dark: {
    background: "#121212",
    surfaceBackground: "#1f2120",
    iconColor: "#FDFDFD",
    blueHeadText: "#007AFF",
    text: "#FDFDFD",
    taskTitle: "#FDFDFD",
    taskSecondText: "#6E727A",
    addNewTaskText: "#4B4F55",
    outgoingTaskToBg: "#254C3B",
    taskIncomingFromBg: "#2F2B45",
    taskAssignedSharedListBg: "#064c8a",
    listTitle: "#FDFDFD",
    borderColor: "#3A3A3A",
    popupShadow: "#4A4A4A",
  },
};