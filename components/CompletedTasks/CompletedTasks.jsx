import { View, Text, Pressable, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../constants/themes";
import { errandsAtom, listsAtom, themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";
import CompletedErrand from "../../constants/CompletedErrand";
import ConfirmDeleteTasks from "./ConfirmDeleteTasks/ConfirmDeleteTasks";

function CompletedTasks() {
  const navigation = useNavigation();

  const [theme, setTheme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [lists, setListas] = useAtom(listsAtom);

  const [confirmDeleteTasksModalVisisble, setConfirmDeleteTasksModalVisisble] =
    useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: "Completados",
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
      <View className="w-full flex-row items-center justify-center gap-2">
        <Text
          className={`text-[${themes[theme].listTitle}]`}
        >{`${errands.filter((errand) => errand.completed).length} completados`}</Text>
        <Text className={`text-[${themes[theme].listTitle}] font-bold`}>-</Text>
        <Pressable onPress={() => setConfirmDeleteTasksModalVisisble(true)}>
          <Text className={`text-[${themes[theme].blueHeadText}] font-bold`}>
            Eliminar
          </Text>
        </Pressable>
      </View>
      <ScrollView>
        {/* Completed Tasks */}
        <Pressable>
          {errands
            .filter((errand) => errand.completed)
            .sort((a, b) => {
              const dateA = new Date(
                `${a.dateErrand}T${a.timeErrand || "20:00"}`
              );
              const dateB = new Date(
                `${b.dateErrand}T${b.timeErrand || "20:00"}`
              );
              return dateB - dateA;
            })
            .map((errand, index) => (
              <CompletedErrand key={errand.id} errand={errand} />
            ))}
        </Pressable>
      </ScrollView>
      <ConfirmDeleteTasks visible={confirmDeleteTasksModalVisisble} />
    </View>
  );
}
export default CompletedTasks;

// onPress={() =>
//             setErrands(errands.filter((errand) => !errand.completed))
//           }
