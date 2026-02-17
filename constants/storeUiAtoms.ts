import { atom } from "jotai";

export type ThemeMode = "light" | "dark";
export type LanguageCode = "es" | "en" | "ca";

export const themeAtom = atom<ThemeMode>("light");
export const languageAtom = atom<LanguageCode>("es");