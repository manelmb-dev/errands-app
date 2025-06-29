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
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

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

  useEffect(() => {
    const loadPreferences = async () => {
      const savedTheme = await AsyncStorage.getItem("themePreference");
      const savedLang = await AsyncStorage.getItem("languagePreference");

      if (savedTheme === "auto") {
        setTheme(system);
      } else {
        setTheme(savedTheme || "light");
      }

      setLanguage(savedLang || "es");
      I18n.locale = savedLang || "es";

      setReady(true);
    };
    loadPreferences();
  }, [setLanguage, setTheme, system]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <MenuProvider>
            <ActionSheetProvider>
              <View className={`flex-1 bg-[${themes[theme].background}]`}>
                {ready ? (
                  <Stack />
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
