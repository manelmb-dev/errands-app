import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter, useGlobalSearchParams, useLocalSearchParams } from "expo-router";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import formatErrandDate from "../../constants/formatErrandDate";
import formatCompletedErrandDate from "../../constants/formatCompletedErrandDate";

import errandsData from "../../errands";
import { themes } from "../../constants/themes";
import { themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

let initialListas = [
  { title: "Personal", icon: "person", color: "blue" },
  { title: "Supermercado", icon: "restaurant", color: "red" },
  { title: "Trabajo", icon: "business", color: "gray" },
  { title: "Cumpleaños", icon: "balloon", color: "orange" },
  { title: "Universidad", icon: "book", color: "green" },
];
const userId = "user123";

function ListTasks() {
  const [theme, setTheme] = useAtom(themeAtom);

  const { listId } = useLocalSearchParams();

  const [errands, setErrands] = useState(errandsData);
  const [showCompleted, setShowCompleted] = useState(false);

  const router = useRouter();

  return (
    <View className={`h-full bg-[${themes[theme].background}]`}>
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
            {listId}
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
          .filter(
            (errand) =>
              errand.creatorId === userId || userId === errand.assignedId
          )
          .filter((errand) => errand.marked)
          .filter((errand) => !errand.completed)
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
                    className={`text-[${themes[theme].taskTitle}]`}
                    defaultValue={errand.title}
                  />
                  {userId !== errand.creatorId &&
                    userId === errand.assignedId && (
                      <View className="flex-row">
                        <View
                          className={`flex-row my-0.5 px-2 p-1 bg-[${themes[theme].taskReceivedFromBg}] rounded-lg items-center gap-2`}
                        >
                          <Ionicons
                            name="send"
                            size={10}
                            color="#6E727A"
                            style={{ transform: [{ rotateY: "180deg" }] }}
                          />
                          <Text
                            className={`text-sm text-[${themes[theme].taskSecondText}]`}
                          >
                            {errand.creatorId}
                          </Text>
                        </View>
                      </View>
                    )}
                  {errand.creatorId === userId &&
                    userId !== errand.assignedId && (
                      <View className="flex-row">
                        <View
                          className={`flex-row my-0.5 px-2 p-1 bg-[${themes[theme].taskSentToBg}] rounded-lg items-center gap-2`}
                        >
                          <Ionicons name="send" size={10} color="#6E727A" />
                          <Text
                            className={`text-sm text-[${themes[theme].taskSecondText}]`}
                          >
                            {errand.assignedId}
                          </Text>
                        </View>
                      </View>
                    )}
                  {errand.description && (
                    <View>
                      <Text
                        className={`text-sm text-[${themes[theme].taskSecondText}]`}
                      >
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
                              : `text-[${themes[theme].taskSecondText}]`
                          }`}
                        >
                          {formatErrandDate(errand)}
                        </Text>
                      </View>
                    )}
                    {errand.repeat && errand.repeat !== "never" && (
                      <View className="flex-row items-center ml-2">
                        <Ionicons name="repeat" size={16} color="#6E727A" />
                        <Text
                          className={`text-sm text-[${themes[theme].taskSecondText}] ml-1`}
                        >
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
              <View
                className={`h-[0.5px] w-full bg-[${themes[theme].listsSeparator}] ml-11`}
              />
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
              placeholderTextColor={themes[theme].addNewTaskText}
            />
            {/* <View className="justify-center">
                  <Text className="text-sm text-[#6E727A]">Notas</Text>
                </View> */}
          </View>
        </View>
        <View className="flex-row w-full justify-center mt-9 mb-3">
          <Pressable
            className="flex-row items-center bg-green-200 rounded-xl p-3 overflow-hidden gap-2"
            onPress={() => setShowCompleted(!showCompleted)}
          >
            <Ionicons name={showCompleted ? "eye-off" : "eye"} size={18} />
            <Text>
              {showCompleted ? "Ocultar completados" : "Mostrar Completados"}
            </Text>
          </Pressable>
        </View>
        {showCompleted && (
          <View>
            {errands
              .filter(
                (errand) =>
                  errand.creatorId === userId || userId === errand.assignedId
              )
              .filter((errand) => errand.marked)
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
                            <View
                              className={`flex-row my-0.5 px-2 p-1 bg-[${themes[theme].taskReceivedFromBg}] rounded-lg items-center gap-2`}
                            >
                              <Ionicons
                                name="send"
                                size={10}
                                color="#6E727A"
                                style={{ transform: [{ rotateY: "180deg" }] }}
                              />
                              <Text
                                className={`text-sm text-[${themes[theme].taskSecondText}]`}
                              >
                                {errand.creatorId}
                              </Text>
                            </View>
                          </View>
                        )}
                      {errand.creatorId === userId &&
                        userId !== errand.assignedId && (
                          <View className="flex-row">
                            <View
                              className={`flex-row my-0.5 px-2 p-1 bg-[${themes[theme].taskSentToBg}] rounded-lg items-center gap-2`}
                            >
                              <Ionicons name="send" size={10} color="#6E727A" />
                              <Text
                                className={`text-sm text-[${themes[theme].taskSecondText}]`}
                              >
                                {errand.assignedId}
                              </Text>
                            </View>
                          </View>
                        )}
                      {errand.description && (
                        <View>
                          <Text
                            className={`text-sm text-[${themes[theme].taskSecondText}]`}
                          >
                            {errand.description}
                          </Text>
                        </View>
                      )}
                      <View className="flex-row">
                        {errand.dateErrand && (
                          <View className="flex-row items-center">
                            <Text
                              className={`text-sm text-[${themes[theme].taskSecondText}]`}
                            >
                              {`${formatErrandDate(errand)}, ${errand.timeErrand}`}
                            </Text>
                          </View>
                        )}
                        {errand.repeat && errand.repeat !== "never" && (
                          <View className="flex-row items-center ml-2">
                            <Ionicons name="repeat" size={16} color="#6E727A" />
                            <Text
                              className={`text-sm text-[${themes[theme].taskSecondText}] ml-1`}
                            >
                              {errand.repeat}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View className="flex-row items-center">
                        <Text
                          className={`text-sm text-[${themes[theme].taskSecondText}]`}
                        >
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
                  <View
                    className={`h-[0.5px] w-full bg-[${themes[theme].listsSeparator}] ml-11`}
                  />
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
export default ListTasks;
