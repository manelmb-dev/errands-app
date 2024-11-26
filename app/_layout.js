import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "../App.css";

export default function _layout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View className="flex-1">
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
          <Slot />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}
