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
  { id: "1239dsf87", title: "Personal", icon: "person", color: "blue" },
  { id: "1212439ñl", title: "Supermercado", icon: "restaurant", color: "red" },
  { id: "1239dsmnb", title: "Trabajo", icon: "business", color: "steal" },
  { id: "p979dsf87", title: "Cumpleaños", icon: "balloon", color: "orange" },
  { id: "4239dwe32", title: "Universidad", icon: "book", color: "green" },
  { id: "kds39dwe3", title: "Sin lista", icon: "list", color: "steal" },
];

const userId = "user123";

function AllTasks() {
  const [theme, setTheme] = useAtom(themeAtom);

  const [listas, setListas] = useState(initialListas);

  const [errands, setErrands] = useState(errandsData);

  const router = useRouter();

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const headerIndices = [];

  let currentIndex = 0;
  listas.forEach((list) => {
    headerIndices.push(currentIndex); // Agrega el índice del header
    currentIndex += 1; // Cuenta el header
    currentIndex += errands.filter(
      (errand) => errand.list === list.title,
    ).length; // Cuenta las tareas de la lista
  });

  return (
    <View className="h-full">
      <View className="w-full flex-row items-center justify-between mb-2 mt-0.5">
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
          Todo
        </Text>
        <Pressable onPress={toggleTheme}>
          <Ionicons
            className="px-3 ml-9"
            name="options"
            size={26}
            color={themes[theme].blueHeadText}
          />
        </Pressable>
      </View>
      <ScrollView stickyHeaderIndices={[headerIndices]}>
        {listas.map((list) => (
          <View key={list.title}>
            {/* Header list */}
            <View className="flex-row justify-center items-center gap-1 mb-2">
              <Ionicons name={list.icon} size={21} color={list.color} />
              <Text
                className={`text-[${themes[theme].listTitle}] text-2xl font-bold`}
              >
                {list.title}
              </Text>
            </View>
            {/* List reminders */}
            {errands
              .filter((errand) => !errand.completed)
              .filter((errand) => errand.list === list.title)
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
          </View>
        ))}
      </ScrollView>
      <View className="flex-row justify-center w-full gap-6 mt-4">
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
        <Pressable className="flex-row gap-2">
          <Ionicons className="pb-2" name="send" size={22} color="#3F3F3F" />
          <Text
            className={`text-lg text-[${themes[theme].sendTaskButtonText}] text font-bold`}
          >
            Enviar recordatorio
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
export default AllTasks;
