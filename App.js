import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Main from "./components/Main/Main";

import "./App.css";

export default function App() {
  return (
    <SafeAreaProvider>
      <View>
        <StatusBar style="light" />
        <Main />
      </View>
    </SafeAreaProvider>
  );
}
