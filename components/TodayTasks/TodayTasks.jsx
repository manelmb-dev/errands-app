import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useNavigation, useRouter } from "expo-router";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../constants/themes";
import { errandsAtom, themeAtom, userAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";
import FullErrand from "../../constants/fullErrand";
import CompletedErrand from "../../constants/CompletedErrand";

function TodayTasks() {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const [selectedTab, setSelectedTab] = useState("pending");

  const sortByDate = (a, b) =>
    new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`) -
    new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);

  useEffect(() => {
    navigation.setOptions({
      title: "Hoy",
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

  const tabs = [
    {
      label: "Pendientes",
      value: "pending",
      errandsList: errands.filter((errand) => !errand.completed),
      emptyListText: "No tienes tareas pendientes",
    },
    {
      label: "Completados",
      value: "completed",
      errandsList: errands.filter((errand) => errand.completed),
      emptyListText: "No hay tareas completadas",
    },
  ];

  const selectedTabObj = tabs.find((tab) => tab.value === selectedTab);

  const errandsAssignedToMe = useMemo(() => {
    return (
      selectedTabObj?.errandsList
        ?.filter(
          (errand) =>
            new Date(errand.dateErrand).toISOString().split("T")[0] <=
            new Date().toISOString().split("T")[0],
        )
        .filter((errand) => errand.assignedId === user.id) || []
    );
  }, [selectedTabObj, user.id]);

  const errandsSubmittedFromMe = useMemo(() => {
    return (
      selectedTabObj?.errandsList
        ?.filter(
          (errand) =>
            new Date(errand.dateErrand).toISOString().split("T")[0] <=
            new Date().toISOString().split("T")[0],
        )
        .filter((errand) => errand.ownerId === user.id)
        .filter((errand) => errand.assignedId !== user.id) || []
    );
  }, [selectedTabObj, user.id]);

  return (
    <View className={`h-full bg-[${themes[theme].background}]`}>
      <View className="mb-4 flex-row justify-center gap-3">
        {tabs.map((tab) => (
          <Pressable
            key={tab.value}
            onPress={() => {
              setSelectedTab(tab.value);
            }}
            className={`px-4 py-2 rounded-full ${
              selectedTab === tab.value
                ? "bg-blue-300"
                : `bg-[${themes[theme].buttonMenuBackground}]`
            }`}
          >
            <Text
              className={`text-[${themes[theme].text}] text-lg font-semibold ${
                selectedTab === tab.value ? "text-blue-900" : ""
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View>
        <Text
          className={`ml-5 mb-2 text-2xl font-semibold text-[${themes[theme].text}]`}
        >
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </Text>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Pressable>
          {errandsAssignedToMe.length > 0 ? (
            errandsAssignedToMe
              .sort(sortByDate)
              .map((errand) =>
                errand.completed ? (
                  <CompletedErrand key={errand.id} errand={errand} />
                ) : (
                  <FullErrand key={errand.id} errand={errand} />
                )
              )
          ) : (
            <Text
              className={`w-full py-6 text-center text-2xl text-[${themes[theme].text}]`}
            >
              {selectedTabObj.emptyListText}
            </Text>
          )}

          {/* Submitted tasks */}
          {errandsSubmittedFromMe.length > 0 && (
            <>
              <View className="flex-row justify-center items-center gap-2 mb-2 mt-6">
                <Ionicons name="send" size={21} color="#161618" />
                <Text
                  className={`text-[${themes[theme].listTitle}] text-2xl font-bold`}
                >
                  Enviados
                </Text>
              </View>
              {errandsSubmittedFromMe
                .sort(sortByDate)
                .map((errand) =>
                  errand.completed ? (
                    <CompletedErrand key={errand.id} errand={errand} />
                  ) : (
                    <FullErrand key={errand.id} errand={errand} />
                  )
                )}
            </>
          )}
        </Pressable>
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
