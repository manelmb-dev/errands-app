import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // 👈 Importante
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { useAtom } from "jotai";

import { themeAtom } from "../constants/storeAtoms";
import { themes } from "../constants/themes";

import "../App.css";

export default function Layout() {
  const [theme] = useAtom(themeAtom);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className={`flex-1 bg-[${themes[theme].background}]`}>
            <Stack />
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
