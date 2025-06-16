// constants/i18n.js
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from "./translations.json";

// 1️⃣ Define tus traducciones:
const i18n = new I18n(translations);

// 2️⃣ Idioma por defecto: detecta sistema
i18n.locale = Localization.locale.slice(0, 2); // "es", "en", "ca"
i18n.fallbacks = true;

export default i18n;
