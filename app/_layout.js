import {
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MenuProvider } from "react-native-popup-menu";
import * as Localization from "expo-localization";
import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";

import { languageAtom, themeAtom } from "../constants/storeUiAtoms";
import { userAtom } from "../constants/storeAtoms";
import { useAtom } from "jotai";

import { useDeviceContactsSync } from "../hooks/useDeviceContactsSync";
import { themes } from "../constants/themes";
import I18n from "../constants/i18n";
import "../App.css";

export default function Layout() {
  const system = useColorScheme() ?? "light";
  const [theme, setTheme] = useAtom(themeAtom);
  const [, setLanguage] = useAtom(languageAtom);
  const [user, setUser] = useAtom(userAtom)

  const [ready, setReady] = useState(false);

  const [userExists, setUserExists] = useState(null);

  useEffect(() => {
    const loadPreferences = async () => {
      const savedTheme = await AsyncStorage.getItem("themePreference");
      const savedLang = await AsyncStorage.getItem("languagePreference");
      const phone = await AsyncStorage.getItem("userPhoneE164");

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

  useDeviceContactsSync(ready && !!user?.uid);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          style={theme === "dark" ? "light" : "dark"}
          animated
          translucent
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <MenuProvider>
            <ActionSheetProvider>
              <View className={`flex-1 bg-[${themes[theme].background}]`}>
                {ready ? (
                  user && userExists === true ? (
                    <Stack />
                  ) : (
                    <>
                      {/* <Redirect href="/wellcome" /> */}
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
