// constants/i18n.js
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "./translations.json";

// 1️⃣ Define dictionaries:
const i18n = new I18n(translations);

// 2️⃣ Default language: system language
const systemLocale = Localization.getLocales()[0].languageCode;
i18n.locale = systemLocale;

// 3️⃣ Fallbacks
i18n.fallbacks = true;

export default i18n;
