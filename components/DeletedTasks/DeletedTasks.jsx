import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";

import { errandsAtom, themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import FullErrand from "../../Utils/fullErrand";
import { themes } from "../../constants/themes";

function DeletedTasks() {
  const navigation = useNavigation();

  const [theme, setTheme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  useEffect(() => {
    navigation.setOptions({
      title: "Tareas eliminadas",
      headerBackTitle: "Listas",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerRight: () => (
        <Ionicons name="options" color={themes[theme].blueHeadText} size={24} />
      ),
    });
  }, [navigation, theme]);

  return (
    <View className={`h-full bg-[${themes[theme].background}]`}>
      <Text>Tareas eliminadas</Text>
    </View>
  );
}
export default DeletedTasks;
