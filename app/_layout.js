import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

import { View } from "react-native";
import { Slot } from "expo-router";
import { useAtom } from "jotai";

import { themeAtom } from "../constants/storeAtoms";
import { themes } from "../constants/themes";

import "../App.css";

export default function Layout() {
  const [theme] = useAtom(themeAtom);

  return (
    <SafeAreaProvider>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <SafeAreaView
        className={`flex-1 bg-[${themes[theme].background}]`}
        edges={["top", "bottom"]}
      >
        <View className="flex-1">
          <Slot />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>

    // <SafeAreaProvider>
    //   <StatusBar style={theme === "dark" ? "light" : "dark"} />
    //   <View className="flex-1">
    //     <SafeAreaView className={`flex-1 bg-[${themes[theme].background}]`}>
    //       <Stack
    //         screenOptions={{
    //           headerShown: false,
    //         }}
    //       >
    //         <Stack.Screen name="index" />
    //         <Stack.Screen name="allTasks" />
    //         <Stack.Screen name="completedTasks" />
    //         <Stack.Screen name="contacts" />
    //         <Stack.Screen name="listTasks" />
    //         <Stack.Screen name="markedTasks" />
    //         <Stack.Screen
    //           name="newTaskModal"
    //           options={{
    //             presentation: "modal",
    //             animation: "slide",
    //           }}
    //         />
    //         <Stack.Screen name="ownTasks" />
    //         <Stack.Screen name="receivedTasks" />
    //         <Stack.Screen name="sentTasks" />
    //         <Stack.Screen name="todayTasks" />
    //       </Stack>
    //     </SafeAreaView>
    //   </View>
    // </SafeAreaProvider>
  );
}
