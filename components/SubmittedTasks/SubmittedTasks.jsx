import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAtom } from "jotai";
import {
  errandsAtom,
  listsAtom,
  themeAtom,
  userAtom,
} from "../../constants/storeAtoms";

import CompletedErrand from "../../Utils/CompletedErrand";
import { themes } from "../../constants/themes";
import FullErrand from "../../Utils/fullErrand";

function SubmittedTasks() {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [lists, setLists] = useAtom(listsAtom);

  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Enviados",
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
      <ScrollView>
        <Pressable>
          {/* List reminders */}
          {errands
            .filter((errand) => !errand.completed)
            .filter(
              (errand) =>
                errand.ownerId === user.id && user.id !== errand.assignedId
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
          <View className="flex-row rounded-xl pr-3 pt-3 pb-2">
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

          {/* Completed tasks */}
          <View className="flex-row w-full justify-center mt-6 mb-3">
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
                .filter((errand) => errand.completed)
                .filter(
                  (errand) =>
                    errand.ownerId === user.id && user.id !== errand.assignedId
                ).length > 0 && (
                <>
                  {errands
                    .filter((errand) => errand.completed)
                    .filter(
                      (errand) =>
                        errand.ownerId === user.id &&
                        user.id !== errand.assignedId
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
                </>
              )}
            </View>
          )}
        </Pressable>
      </ScrollView>
      <View className="flex-row justify-end w-full pr-3 mb-1.5 mt-4">
        <Pressable className="flex-row gap-2">
          <Ionicons className="pb-1" name="send" size={22} color="#3F3F3F" />
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
export default SubmittedTasks;
