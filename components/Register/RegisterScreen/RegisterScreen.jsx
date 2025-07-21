// components/RegisterScreen.jsx
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Platform,
  Easing,
  Image,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryPicker from "react-native-country-picker-modal";
import { getCallingCode } from "react-native-country-picker-modal";
import * as Localization from "expo-localization";

import { useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import { themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";
import { countryCodes } from "./countryCodes";
import { countryNames } from "./countryNames";

const langToTranslationCode = {
  en: "common", // default (English)
  es: "spa",
  ca: "spa", // catalán → fallback to Spanish
  fr: "fra",
  de: "deu",
  pt: "por",
  it: "ita",
  ja: "jpn",
  zh: "zho",
  ru: "rus",
  nl: "nld",
  fi: "fin",
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

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardShow =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const keyboardHide =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(keyboardShow, () => {
      Animated.timing(translateY, {
        toValue: -100, // ajusta este valor según tu diseño
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(keyboardHide, () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [translateY]);

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
    if (!phone) return Alert.alert(i18n.t("insertValidPhoneNumber"));

    const fullPhone = `+${callingCode}${phone.replace(/\s+/g, "")}`;

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });

      const data = await response.json();
      console.log(data);

      if (!data.success) {
        return Alert.alert(i18n.t("registerErrorTryLater"));
      }

      await AsyncStorage.setItem("userPhoneNumber", fullPhone);
      await AsyncStorage.setItem("password", data.password); // temporal

      // Verify Code
      router.push({
        pathname: "/verifyCode",
        params: { callingCode, phone },
      });
    } catch (err) {
      console.error(err);
      Alert.alert(i18n.t("connectionError"));
    }
  };

  const lang = Localization.getLocales()[0]?.languageCode || "en";
  const translationCode = langToTranslationCode[lang] || "common";

  const isNumberValid = (number) => {
    const regex = /^[0-9]*$/;
    if (regex.test(number) && number.length > 8) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View
        style={{
          transform: [{ translateY }],
          flex: 1,
          backgroundColor: themes[theme].background,
          paddingHorizontal: 40,
          justifyContent: "center",
          gap: 20,
        }}
      >
        <View className="items-center gap-6">
          <Image
            source={require("../../../assets/icon.png")}
            style={{ width: 125, height: 125, borderRadius: 25 }}
          />
          <Text
            className={`text-5xl font-bold text-[${themes[theme].text}] self-center`}
          >
            Errands
          </Text>
        </View>
        <View className="w-full gap-1">
          <Text className={`p-1 text-xl text-[${themes[theme].text}]`}>
            {i18n.t("enterPhoneNumber")}
          </Text>
          <View className="gap-3">
            <View>
              <TouchableOpacity
                className={`p-5 flex-row items-center justify-between rounded-3xl border border-[${themes[theme].borderColor}] bg-[${themes[theme].surfaceBackground}]`}
                activeOpacity={0.7}
                onPress={() => setShowCountryPicker(true)}
              >
                <Text
                  className={`text-2xl text-[${themes[theme].blueHeadText}]`}
                >
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
              className={`flex-row rounded-3xl border border-[${themes[theme].borderColor}] bg-[${themes[theme].surfaceBackground}]`}
            >
              <Pressable
                className={`p-5 border-r border-[${themes[theme].borderColor}]`}
                onPress={() => setShowCountryPicker(true)}
              >
                <Text
                  className={`text-2xl leading-tight text-[${themes[theme].text}]`}
                >{`+${callingCode}`}</Text>
              </Pressable>
              <TextInput
                className={`flex-1 p-5 text-2xl
                leading-tight text-[${themes[theme].text}]`}
                value={phone}
                onChangeText={setPhone}
                placeholder={i18n.t("phoneNumber")}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
            <TouchableOpacity
              className={`p-3 rounded-3xl items-center justify-center bg-[${themes[theme].blueHeadText}] ${!isNumberValid(phone) ? "opacity-50" : ""}`}
              activeOpacity={0.6}
              disabled={!isNumberValid(phone)}
              onPress={handleRegister}
            >
              <Text
                className={`p-2 text-2xl font-semibold text-[${themes[theme === "dark" ? "light" : "dark"].text}]`}
              >
                {i18n.t("next")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <CountryPicker
          containerButtonStyle={{ display: "none" }}
          visible={showCountryPicker}
          translation={translationCode}
          countryCodes={countryCodes}
          theme={{
            backgroundColor: themes[theme].background,
            onBackgroundTextColor: themes[theme].text,
            paddingHorizontal: 20,
          }}
          flatListProps={{
            paddingHorizontal: 10,
          }}
          withFilter
          withFlag
          withCallingCode
          withEmoji
          withCloseButton
          // withAlphaFilter
          filterProps={{
            fontSize: 22,
            placeholderTextColor: themes[theme].text,
            placeholder: i18n.t("searchYourCountry"),
            marginVertical: 15,
          }}
          preferredCountries={["ES", "GB", "US", "FR", "IT", "DE", "PT"]}
          onClose={() => setShowCountryPicker(false)}
          onSelect={(country) => {
            setCallingCode(country.callingCode[0]);
            setCountryName(
              typeof country.name === "string"
                ? country.name
                : country.name.common,
            );
            setShowCountryPicker(false);
          }}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
