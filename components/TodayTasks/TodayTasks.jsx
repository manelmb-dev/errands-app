import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import formatErrandDate from "../../constants/formatErrandDate";
import formatCompletedErrandDate from "../../constants/formatCompletedErrandDate";

import errandsData from "../../errands";
let initialListas = [
  { title: "Personal", icon: "person", color: "blue" },
  { title: "Supermercado", icon: "restaurant", color: "red" },
  { title: "Trabajo", icon: "business", color: "gray" },
  { title: "Cumpleaños", icon: "balloon", color: "orange" },
  { title: "Universidad", icon: "book", color: "green" },
];
const userId = "user123";

function TodayTasks() {
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
          <Ionicons name="chevron-back" size={26} color="#0033ff" />
          <Text className="text-[#0033ff] text-xl">Listas</Text>
        </Pressable>
        <Text className="text-[#0033ff] text-xl">Hoy</Text>
        <Ionicons
          className="px-3 ml-9"
          name="options"
          size={26}
          color="#0033ff"
        />
      </View>
      <ScrollView>
        {/* My reminders */}
        <View className="flex-row justify-center items-center gap-2 my-1">
          <Ionicons name="list" size={21} color="#161618" />
          <Text className="text-[#161618] text-xl font-bold">
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

        {/* New reminder */}
        <View className="flex-row rounded-xl pr-3 pt-3">
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
                <View key={errand.id}>
                  <View className="flex-row rounded-xl pr-3 pt-3 pb-2">
                    <View className="pl-4">
                      <Octicons
                        name="check-circle-fill"
                        size={18}
                        color="green"
                      />
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
                                {errand.assignedId}
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
          </View>
        )}

        {/* Reminders sent */}
        <View className="flex-row justify-center items-center gap-2 mb-2 mt-6">
          <Ionicons name="send" size={21} color="#161618" />
          <Text className="text-[#161618] text-xl font-bold">Enviados</Text>
        </View>
        {errands
          .filter((errand) => errand.completed)
          .filter((errand) => errand.creatorId !== userId)
          .filter((errand) => errand.assignedId === userId)
          .filter(
            (errand) =>
              new Date(errand.dateErrand).toISOString().split("T")[0] <=
              new Date().toISOString().split("T")[0]
          )
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

        {/* New reminder */}
        <View className="flex-row rounded-xl pr-3 pt-3">
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
                <View key={errand.id}>
                  <View className="flex-row rounded-xl pr-3 pt-3 pb-2">
                    <View className="pl-4">
                      <Octicons
                        name="check-circle-fill"
                        size={18}
                        color="green"
                      />
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
                                {errand.assignedId}
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
          </View>
        )}
      </ScrollView>
      <View className="flex-row justify-center w-full gap-6">
        <Pressable className="flex-row gap-1">
          <Ionicons
            className="pb-2"
            name="add-circle"
            size={24}
            color="#045BEB"
          />
          <Text className="text-lg text-[#045BEB] text font-bold">
            Nuevo recordatorio
          </Text>
        </Pressable>
        <Pressable className="flex-row gap-2">
          <Ionicons className="pb-2" name="send" size={22} color="#3F3F3F" />
          <Text className="text-lg text-[#3F3F3F] text font-bold">
            Enviar recordatorio
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
export default TodayTasks;
