// constants/i18n.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

import translations from "./translations.json";

// 1️⃣ Define dictionaries:
const i18n = new I18n(translations);

// 2️⃣ Fallbacks
i18n.fallbacks = true;

const supportedLanguages = ["en", "es", "ca"];

// Esta función se llama en tu app para configurar el idioma al iniciar
export const initLanguage = async () => {
  try {
    const storedLang = await AsyncStorage.getItem("language");

    if (storedLang && supportedLanguages.includes(storedLang)) {
      i18n.locale = storedLang;
    } else {
      const systemLang = Localization.getLocales()[0].languageCode;
      const defaultLang = supportedLanguages.includes(systemLang)
        ? systemLang
        : "en";
      i18n.locale = defaultLang;
      await AsyncStorage.setItem("language", defaultLang);
    }
  } catch (e) {
    i18n.locale = "en"; // fallback
  }
};

export default i18n;
