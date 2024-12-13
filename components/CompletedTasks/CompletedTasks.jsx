import { View, Text, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import Ionicons from "react-native-vector-icons/Ionicons";

import errandsData from "../../errands";
import { themes } from "../../constants/themes";
import { themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";
import CompletedErrand from "../../constants/CompletedErrand";
import ConfirmDeleteTasks from "./ConfirmDeleteTasks/ConfirmDeleteTasks";

let initialListas = [
  { title: "Personal", icon: "person", color: "blue" },
  { title: "Supermercado", icon: "restaurant", color: "red" },
  { title: "Trabajo", icon: "business", color: "gray" },
  { title: "Cumpleaños", icon: "balloon", color: "orange" },
  { title: "Universidad", icon: "book", color: "green" },
];
const userId = "user123";

function CompletedTasks() {
  const [theme, setTheme] = useAtom(themeAtom);

  const [errands, setErrands] = useState(errandsData);
  const [listas] = useState(initialListas);
  const [confirmDeleteTasksModalVisisble, setConfirmDeleteTasksModalVisisble] =
    useState(true);

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
        <Text className={`text-[${themes[theme].blueHeadText}] text-xl`}>
          Completados
        </Text>
        <Ionicons
          className="px-3 ml-9"
          name="options"
          size={26}
          color={themes[theme].blueHeadText}
        />
      </View>
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
        {errands
          .filter((errand) => errand.completed)
          .sort((a, b) => {
            const dateA = new Date(
              `${a.dateErrand}T${a.timeErrand || "20:00"}`,
            );
            const dateB = new Date(
              `${b.dateErrand}T${b.timeErrand || "20:00"}`,
            );
            return dateB - dateA;
          })
          .map((errand, index) => (
            <CompletedErrand key={errand.id} errand={errand} />
          ))}
      </ScrollView>
      <ConfirmDeleteTasks visible={confirmDeleteTasksModalVisisble} />
    </View>
  );
}
export default CompletedTasks;

// onPress={() =>
//             setErrands(errands.filter((errand) => !errand.completed))
//           }
