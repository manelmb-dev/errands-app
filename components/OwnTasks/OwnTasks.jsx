import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import errandsData from "../../errands";
import { themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";
import { themes } from "../../constants/themes";
import FullErrand from "../../constants/fullErrand";
let initialListas = [
  { title: "Personal", icon: "person", color: "blue" },
  { title: "Supermercado", icon: "restaurant", color: "red" },
  { title: "Trabajo", icon: "business", color: "gray" },
  { title: "Cumpleaños", icon: "balloon", color: "orange" },
  { title: "Universidad", icon: "book", color: "green" },
];
const userId = "user123";

function OwnTasks() {
  const [theme, setTheme] = useAtom(themeAtom);

  const [listas, setListas] = useState(initialListas);

  const [errands, setErrands] = useState(errandsData);

  const router = useRouter();

  return (
    <View className="h-full">
      <View className="w-full flex-row items-center justify-between mb-2">
        <Pressable
          className="flex-row items-center px-1"
          onPress={() => router.push("/")}
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color={themes[theme].blueHeadText}
          />
          <Text className={`text-[${themes[theme].blueHeadText}] text-xl`}>
            Listas
          </Text>
        </Pressable>
        <Pressable>
          <Text className={`text-[${themes[theme].blueHeadText}] text-xl`}>
            Mios
          </Text>
        </Pressable>
        <Ionicons
          className="px-3 ml-9"
          name="options"
          size={26}
          color={themes[theme].blueHeadText}
        />
      </View>
      <ScrollView>
        {/* List reminders */}
        {errands
          .filter((errand) => !errand.completed)
          .filter(
            (errand) =>
              errand.creatorId === userId && userId === errand.assignedId
          )
          .sort((a, b) => {
            const dateA = new Date(
              `${a.dateErrand}T${a.timeErrand || "20:00"}`
            );
            const dateB = new Date(
              `${b.dateErrand}T${b.timeErrand || "20:00"}`
            );
            return dateA - dateB;
          })
          .map((errand, index) => (
            <FullErrand key={errand.id} errand={errand} />
          ))}

        {/* New reminder */}
        <View className="flex-row rounded-xl pr-3 pt-3 pb-4">
          <View className="pl-4">
            <Octicons name="plus-circle" size={18} color="#6E727A" />
          </View>
          <View className="flex-1 pl-3">
            <TextInput
              className="text-[#161618]"
              placeholder="Añadir recordatorio"
              placeholderTextColor={themes[theme].addNewTaskText}
            />
            {/* <View className="justify-center">
                  <Text className="text-sm text-[#6E727A]">Notas</Text>
                </View> */}
          </View>
        </View>
      </ScrollView>
      <View className="flex-row w-full ml-3 mt-4">
        <Pressable className="flex-row gap-1">
          <Ionicons
            className="pb-2"
            name="add-circle"
            size={24}
            color={themes[theme].blueHeadText}
          />
          <Text
            className={`text-lg text-[${themes[theme].blueHeadText}] text font-bold`}
          >
            Nuevo recordatorio
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
export default OwnTasks;
