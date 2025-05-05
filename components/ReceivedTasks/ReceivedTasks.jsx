import { View, Text, Pressable, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";

import Ionicons from "react-native-vector-icons/Ionicons";

import {
  errandsAtom,
  listsAtom,
  themeAtom,
  userAtom,
} from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import CompletedErrand from "../../Utils/CompletedErrand";
import { themes } from "../../constants/themes";
import FullErrand from "../../Utils/fullErrand";

function ReceivedTasks() {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [lists, setLists] = useAtom(listsAtom);

  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Recibidos",
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
                errand.ownerId !== user.id && user.id === errand.assignedId
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
          {/* Completed tasks */}
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
                        errand.ownerId !== user.id &&
                        user.id === errand.assignedId
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
    </View>
  );
}
export default ReceivedTasks;
