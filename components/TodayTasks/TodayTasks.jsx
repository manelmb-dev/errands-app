import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import errandsData from "../../errands";
import { themes } from "../../constants/themes";
import { themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";
import FullErrand from "../../constants/fullErrand";
import CompletedErrand from "../../constants/CompletedErrand";

let initialListas = [
  { title: "Personal", icon: "person", color: "blue" },
  { title: "Supermercado", icon: "restaurant", color: "red" },
  { title: "Trabajo", icon: "business", color: "gray" },
  { title: "Cumpleaños", icon: "balloon", color: "orange" },
  { title: "Universidad", icon: "book", color: "green" },
];
const userId = "user123";

function TodayTasks() {
  const [theme, setTheme] = useAtom(themeAtom);

  const [listas, setListas] = useState(initialListas);

  const [errands, setErrands] = useState(errandsData);
  const [showCompletedOwn, setShowCompletedOwn] = useState(false);
  const [showCompletedSent, setShowCompletedSent] = useState(false);

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
          Hoy
        </Text>
        <Ionicons
          className="px-3 ml-9"
          name="options"
          size={26}
          color={themes[theme].blueHeadText}
        />
      </View>
      <ScrollView>
        {/* Own tasks */}
        <View className="flex-row justify-center items-center gap-2 my-1">
          <Ionicons name="list" size={21} color="#161618" />
          <Text
            className={`text-[${themes[theme].listTitle}] text-2xl font-bold`}
          >
            Mis recordatorios
          </Text>
        </View>
        {errands
          .filter((errand) => !errand.completed)
          .filter((errand) => errand.assignedId === userId)
          .filter(
            (errand) =>
              new Date(errand.dateErrand).toISOString().split("T")[0] <=
              new Date().toISOString().split("T")[0]
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
        <View className="flex-row rounded-xl pr-3 pt-3">
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
        <View className="flex-row w-full justify-center mt-6 mb-3">
          <Pressable
            className="flex-row items-center bg-green-200 rounded-xl p-3 overflow-hidden gap-2"
            onPress={() => setShowCompletedOwn(!showCompletedOwn)}
          >
            <Ionicons name={showCompletedOwn ? "eye-off" : "eye"} size={18} />
            <Text>
              {showCompletedOwn ? "Ocultar completados" : "Mostrar Completados"}
            </Text>
          </Pressable>
        </View>

        {/* Completed own tasks */}
        {showCompletedOwn && (
          <View>
            {errands
              .filter((errand) => errand.completed)
              .filter((errand) => errand.assignedId === userId)
              .filter(
                (errand) =>
                  new Date(errand.dateErrand).toISOString().split("T")[0] ===
                  new Date().toISOString().split("T")[0]
              )
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
          </View>
        )}

        {/* tasks sent */}
        <View className="flex-row justify-center items-center gap-2 mb-2 mt-6">
          <Ionicons name="send" size={21} color="#161618" />
          <Text
            className={`text-[${themes[theme].listTitle}] text-2xl font-bold`}
          >
            Enviados
          </Text>
        </View>
        {errands
          .filter((errand) => !errand.completed)
          .filter((errand) => errand.creatorId === userId)
          .filter((errand) => errand.assignedId !== userId)
          .filter(
            (errand) =>
              new Date(errand.dateErrand).toISOString().split("T")[0] <=
              new Date().toISOString().split("T")[0]
          )
          .map((errand, index) => (
            <FullErrand key={errand.id} errand={errand} />
          ))}

        {/* New reminder */}
        <View className="flex-row rounded-xl pr-3 pt-3">
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

        {/* Reminders sent completed */}
        <View className="flex-row w-full justify-center mt-6 mb-3">
          <Pressable
            className="flex-row items-center bg-green-200 rounded-xl p-3 overflow-hidden gap-2"
            onPress={() => setShowCompletedSent(!showCompletedSent)}
          >
            <Ionicons name={showCompletedSent ? "eye-off" : "eye"} size={18} />
            <Text>
              {showCompletedSent
                ? "Ocultar completados"
                : "Mostrar Completados"}
            </Text>
          </Pressable>
        </View>

        {/* Completed sent tasks */}
        {showCompletedSent && (
          <View>
            {errands
              .filter((errand) => errand.completed)
              .filter((errand) => errand.assignedId !== userId)
              .filter(
                (errand) =>
                  new Date(errand.dateErrand).toISOString().split("T")[0] ===
                  new Date().toISOString().split("T")[0]
              )
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
          </View>
        )}
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
export default TodayTasks;
