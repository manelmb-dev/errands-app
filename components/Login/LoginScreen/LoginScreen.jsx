// components/Login/LoginScreen/LoginScreen.jsx
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

export default function LoginScreen() {
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

  const handleLogin = async () => {
    console.log("login");
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
            <View className="justify-center gap-2">
              <TouchableOpacity
                className={`p-3 rounded-3xl items-center justify-center bg-[${themes[theme].blueHeadText}]`}
                activeOpacity={0.6}
                onPress={handleLogin}
              >
                <Text
                  className={`p-2 text-2xl font-semibold text-[${themes[theme === "dark" ? "light" : "dark"].text}]`}
                >
                  {i18n.t("login")}
                </Text>
              </TouchableOpacity>
              <View className="flex-row items-center justify-center gap-2">
                <Text className={`text-sm text-[${themes[theme].text}]`}>
                  {i18n.t("noAccount")}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/register")}
                  activeOpacity={0.6}
                >
                  <Text
                    className={`text-sm font-semibold text-[${themes[theme].blueHeadText}]`}
                  >
                    {i18n.t("signUp")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
