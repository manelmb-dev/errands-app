import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import formatErrandDate from "../../constants/formatErrandDate";


import errandsData from "../../errands";
import formatCompletedErrandDate from "../../constants/formatCompletedErrandDate";
let initialListas = [
  { title: "Personal", icon: "person", color: "blue" },
  { title: "Supermercado", icon: "restaurant", color: "red" },
  { title: "Trabajo", icon: "business", color: "gray" },
  { title: "Cumpleaños", icon: "balloon", color: "orange" },
  { title: "Universidad", icon: "book", color: "green" },
];
const userId = "user123";

function CompletedTasks() {
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
          <Ionicons name="chevron-back" size={26} color="#0033ff" />
          <Text className="text-[#0033ff] text-xl">Listas</Text>
        </Pressable>
        <Text className="text-[#0033ff] text-xl">Completados</Text>

        <Ionicons
          className="px-3 ml-9"
          name="options"
          size={26}
          color="#0033ff"
        />
      </View>
      <ScrollView>
        {/* List reminders */}
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
            <View key={errand.id}>
              <View className="flex-row rounded-xl pr-3 pt-3 pb-2">
                <View className="pl-4">
                  <Octicons name="check-circle-fill" size={18} color="green" />
                </View>
                <View className="flex-1 pl-3">
                  <TextInput
                    className="text-[#6E727A]"
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
                        <Text className="text-sm text-[#6E727A]">
                          {`${formatErrandDate(errand)}, ${errand.timeErrand}`}
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
                  <View className="flex-row items-center">
                    <Text className="text-sm text-[#6E727A]">
                      {`Completado: ${formatCompletedErrandDate(errand)}, ${errand.completedTimeErrand}`}
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-end">
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
              <View className={`h-[1px] w-full bg-gray-200 ml-11`} />
            </View>
          ))}
      </ScrollView>
    </View>
  );
}
export default CompletedTasks;
