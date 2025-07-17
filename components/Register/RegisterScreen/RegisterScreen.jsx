// components/RegisterScreen.jsx
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryPicker from "react-native-country-picker-modal";
import { getCallingCode } from "react-native-country-picker-modal";
import * as Localization from "expo-localization";

import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";
import { countryCodes } from "./countryCodes";
import { countryNames } from "./countryNames";

const langToTranslationCode = {
  en: "common", // default (inglés)
  es: "spa",
  ca: "spa", // catalán → fallback a español
  fr: "fra",
  de: "deu",
  pt: "por",
  it: "ita",
  ja: "jpn",
  zh: "zho",
  ru: "rus",
  nl: "nld",
  fi: "fin",
  sv: "svk", // sueco → fallback aproximado
  he: "isr", // hebreo (isr usado aquí)
  hr: "hrv",
};

export default function RegisterScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [theme] = useAtom(themeAtom);

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryName, setCountryName] = useState("España");
  const [callingCode, setCallingCode] = useState("34");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  useEffect(() => {
    const region = Localization.getLocales()[0];
    const regionCode = region?.regionCode;

    if (regionCode && countryCodes.includes(regionCode)) {

      const lang = Localization.getLocales()[0]?.languageCode || "en";
      const translatedName =
        countryNames[regionCode]?.[lang] ||
        countryNames[regionCode]?.en ||
        regionCode;

      setCountryName(translatedName);

      getCallingCode(regionCode)
        .then((code) => {
          setCallingCode(code);
        })
        .catch((err) => {
          console.warn("No calling code found", err);
        });
    } else {
      // Fallback manual
      const fallbackCode = "ES";
      setCountryName(countryNames[fallbackCode]?.es || "España");
      setCallingCode("34");
    }
  }, []);

  const handleRegister = async () => {
    if (!phone) return Alert.alert(i18n.t("inserValidPhoneNumber"));

    const fullPhone = `+${callingCode}${phone.replace(/\s+/g, "")}`;

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });

      const data = await response.json();
      if (data.success) {
        await AsyncStorage.setItem("userPhoneNumber", fullPhone);
        await AsyncStorage.setItem("password", data.password); // temporal
        Alert.alert("Usuario registrado");
        // Redirigir a la app
      } else {
        Alert.alert("Error en el registro");
        router.push("/verifyCode");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error de conexión");
    }
  };

  const lang = Localization.getLocales()[0]?.languageCode || "en";
  const translationCode = langToTranslationCode[lang] || "common";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className={`flex-1 px-10 justify-center gap-60 bg-[${themes[theme].background}]`}
      >
        <Text
          className={`text-4xl font-bold text-[${themes[theme].text}] self-center`}
        >
          Errands
        </Text>
        <View className="w-full gap-4">
          <Text
            className={`p-1 text-xl font-semiboldtext-[${themes[theme].text}]`}
          >
            {i18n.t("enterPhoneNumber")}
          </Text>
          <View>
            <TouchableOpacity
              className={`p-5 flex-row items-center justify-between rounded-3xl border border-[${themes[theme].borderColor}] bg-[${themes[theme].buttonMenuBackground}]`}
              activeOpacity={0.8}
              onPress={() => setShowCountryPicker(true)}
            >
              <Text className={`text-2xl text-[${themes[theme].blueHeadText}]`}>
                {countryName}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={themes["light"].text}
              />
            </TouchableOpacity>
          </View>
          <View
            className={`flex-row rounded-3xl border border-[${themes[theme].borderColor}] bg-[${themes[theme].buttonMenuBackground}]`}
          >
            <Text
              className={`p-5 text-2xl leading-tight text-[${themes[theme].text}] border-r border-[${themes[theme].borderColor}]`}
            >
              {`+${callingCode}`}
            </Text>
            <TextInput
              className={`p-5 text-2xl
              leading-tight text-[${themes[theme].text}]`}
              value={phone}
              onChangeText={setPhone}
              placeholder={i18n.t("phoneNumber")}
              keyboardType="phone-pad"
            />
          </View>
          <TouchableOpacity
            className={`p-3 rounded-3xl items-center justify-center bg-[${themes[theme].blueHeadText}]`}
            activeOpacity={0.6}
            onPress={handleRegister}
          >
            <Text
              className={`p-2 text-2xl font-semibold text-[${themes[theme === "dark" ? "light" : "dark"].text}]`}
            >
              {i18n.t("next")}
            </Text>
          </TouchableOpacity>
        </View>
        <CountryPicker
          containerButtonStyle={{ display: "none" }}
          visible={showCountryPicker}
          translation={translationCode}
          countryCodes={countryCodes}
          theme={{
            backgroundColor: themes[theme].background,
            onBackgroundTextColor: themes[theme].text,
          }}
          withFilter
          withFlag
          withCallingCode
          withEmoji
          // withAlphaFilter
          filterProps={{
            fontSize: 22,
            placeholderTextColor: themes[theme].text,
            placeholder: i18n.t("searchYourCountry"),
            paddingVertical: 15,
          }}
          preferredCountries={["ES", "GB", "US", "FR", "IT", "DE", "PT"]}
          onClose={() => setShowCountryPicker(false)}
          onSelect={(country) => {
            setCallingCode(country.callingCode[0]);
            setCountryName(country.name);
            setShowCountryPicker(false);
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
