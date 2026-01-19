import {
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MenuProvider } from "react-native-popup-menu";
import * as Localization from "expo-localization";
import { StatusBar } from "expo-status-bar";
import { Redirect, Stack } from "expo-router";

import { useAtom } from "jotai";

import { languageAtom, themeAtom } from "../constants/storeAtoms";
import { themes } from "../constants/themes";

import "../App.css";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import I18n from "../constants/i18n";

export default function Layout() {
  const system = useColorScheme() ?? "light";
  const [theme, setTheme] = useAtom(themeAtom);
  const [, setLanguage] = useAtom(languageAtom);

  const [ready, setReady] = useState(false);

  const [userExists, setUserExists] = useState(null);

  // useEffect(() => {
  //   const resetStorage = async () => {
  //     await AsyncStorage.clear();
  //     console.log("✅ AsyncStorage cleared");
  //   };

  //   resetStorage();
  // }, []);

  useEffect(() => {
    const loadPreferences = async () => {
      const savedTheme = await AsyncStorage.getItem("themePreference");
      const savedLang = await AsyncStorage.getItem("languagePreference");
      const phone = await AsyncStorage.getItem("userPhoneNumber");
      console.log("Phone: ", phone);
      console.log("Device storage: ", await AsyncStorage.getAllKeys());
      console.log("Language storage: ", await AsyncStorage.getItem("languagePreference"))
      console.log("Phone Number storage: ", await AsyncStorage.getItem("userPhoneNumber"))
      console.log("Theme storage: ", await AsyncStorage.getItem("themePreference"))



      // Language
      const supportedLanguages = ["es", "en", "ca"];
      let langToUse = savedLang;

      if (!savedLang) {
        const deviceLang = Localization.getLocales()[0]?.languageCode || "en";
        langToUse = supportedLanguages.includes(deviceLang) ? deviceLang : "en";
        await AsyncStorage.setItem("languagePreference", langToUse);
      }

      I18n.locale = langToUse;
      setLanguage(langToUse);

      // Theme
      if (savedTheme === "auto") {
        setTheme(system);
      } else {
        setTheme(savedTheme || "light");
      }

      // User
      setUserExists(!!phone);
      setReady(true);
    };
    loadPreferences();
  }, [setLanguage, setTheme, system]);

  console.log("User exists: ", userExists);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <MenuProvider>
            <ActionSheetProvider>
              <View className={`flex-1 bg-[${themes[theme].background}]`}>
                {ready ? (
                  userExists === true ? (
                    <Stack />
                  ) : (
                    <>
                      <Redirect href="/wellcome" />
                      <Stack />
                    </>
                  )
                ) : (
                  <View className="flex-1 justify-center items-center">
                    <ActivityIndicator
                      size="large"
                      color={themes[system].text}
                    />
                  </View>
                )}
              </View>
            </ActionSheetProvider>
          </MenuProvider>
        </TouchableWithoutFeedback>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
