import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import formatErrandDate from "../../constants/formatErrandDate";

import errandsData from "../../errands";
let initialListas = [
  { title: "Personal", icon: "person", color: "blue" },
  { title: "Supermercado", icon: "restaurant", color: "red" },
  { title: "Trabajo", icon: "business", color: "gray" },
  { title: "Cumpleaños", icon: "balloon", color: "orange" },
  { title: "Universidad", icon: "book", color: "green" },
  { title: "Sin lista", icon: "list", color: "steal" },
];

const userId = "user123";

function AllTasks() {
  const [listas, setListas] = useState(initialListas);

  const [errands, setErrands] = useState(errandsData);

  const router = useRouter();

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
      <View className="w-full flex-row items-center justify-between mb-2">
        <Pressable
          className="flex-row items-center px-1"
          onPress={() => router.push("/")}
        >
          <Ionicons name="chevron-back" size={26} color="#0033ff" />
          <Text className="text-[#0033ff] text-xl">Listas</Text>
        </Pressable>
        <Text className="text-[#0033ff] text-xl">Todo</Text>
        <Ionicons
          className="px-3 ml-9"
          name="options"
          size={26}
          color="#0033ff"
        />
      </View>
      <ScrollView stickyHeaderIndices={[headerIndices]}>
        {listas.map((list) => (
          <View key={list.title}>
            {/* Header list */}
            <View className="flex-row justify-center items-center gap-1 mb-2">
              <Ionicons name={list.icon} size={21} color={list.color} />
              <Text className="text-[#161618] text-2xl font-bold">
                {list.title}
              </Text>
            </View>
            {/* List reminders */}
            {errands
              .filter((errand) => !errand.completed)
              .filter((errand) => errand.list === list.title)
              .sort((a, b) => {
                const dateA = new Date(
                  `${a.dateErrand}T${a.timeErrand || "20:00"}`,
                );
                const dateB = new Date(
                  `${b.dateErrand}T${b.timeErrand || "20:00"}`,
                );
                return dateA - dateB;
              })
              .map((errand, index) => (
                <View key={errand.id}>
                  <View className="flex-row rounded-xl pr-3 pt-3 pb-2">
                    <View className="pl-4">
                      <Octicons name="circle" size={18} color="#6E727A" />
                    </View>
                    <View className="flex-1 pl-3">
                      <TextInput
                        className="text-[#161618]"
                        defaultValue={errand.title}
                      />
                      {userId !== errand.creatorId &&
                        userId === errand.assignedId && (
                          <View className="flex-row">
                            <View className="flex-row px-2 p-1 bg-[#CDC9FB] rounded-lg items-center gap-2">
                              <Ionicons
                                name="send"
                                size={10}
                                color="#6E727A"
                                style={{ transform: [{ rotateY: "180deg" }] }}
                              />
                              <Text className="text-sm text-[#6E727A]">
                                {errand.creatorId}
                              </Text>
                            </View>
                          </View>
                        )}
                      {errand.creatorId === userId &&
                        userId !== errand.assignedId && (
                          <View className="flex-row">
                            <View className="flex-row px-2 p-1 bg-[#CDE7E2] rounded-lg items-center gap-2">
                              <Ionicons name="send" size={10} color="#6E727A" />
                              <Text className="text-sm text-[#6E727A]">
                                {errand.assignedId}
                              </Text>
                            </View>
                          </View>
                        )}
                      {errand.description && (
                        <View>
                          <Text className="text-sm text-[#6E727A]">
                            {errand.description}
                          </Text>
                        </View>
                      )}
                      <View className="flex-row">
                        {errand.dateErrand && (
                          <View className="flex-row items-center">
                            <Text
                              className={`text-sm ${
                                new Date(
                                  `${errand.dateErrand}T${errand.timeErrand || "24:00"}`
                                ) < new Date()
                                  ? "text-red-600"
                                  : "text-[#6E727A]"
                              }`}
                            >
                              {formatErrandDate(errand)}
                            </Text>
                          </View>
                        )}
                        {errand.repeat && errand.repeat !== "never" && (
                          <View className="flex-row items-center ml-2">
                            <Ionicons name="repeat" size={16} color="#6E727A" />
                            <Text className="text-sm text-[#6E727A] ml-1">
                              {errand.repeat}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View className="flex-row justify-end">
                      {new Date(
                        `${errand.dateErrand}T${errand.timeErrand || "24:00"}`
                      ) < new Date() && (
                        <Pressable>
                          <Ionicons
                            className="mt-1 ml-1"
                            name="calendar-outline"
                            size={20}
                            color="#dc2626"
                          />
                        </Pressable>
                      )}
                      {errand.marked && (
                        <Ionicons
                          className="mt-1 ml-1"
                          name="flag"
                          size={20}
                          color="#FFC402"
                        />
                      )}
                      <Ionicons
                        className="ml-1"
                        name="information-circle-outline"
                        size={26}
                        color="#6E727A"
                      />
                    </View>
                  </View>
                  <View className={`h-[1px] w-full bg-gray-300 ml-11`} />
                </View>
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
                />
                {/* <View className="justify-center">
                  <Text className="text-sm text-[#6E727A]">Notas</Text>
                </View> */}
              </View>
              <Ionicons
                className="ml-1"
                name="information-circle-outline"
                size={26}
                color="#6E727A"
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
export default AllTasks;
