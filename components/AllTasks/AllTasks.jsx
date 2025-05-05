import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useNavigation } from "expo-router";

// import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  errandsAtom,
  listsAtom,
  themeAtom,
  userAtom,
} from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import FullErrand from "../../Utils/fullErrand";
import { themes } from "../../constants/themes";

function AllTasks() {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [errands] = useAtom(errandsAtom);
  const [lists] = useAtom(listsAtom);
  const [theme] = useAtom(themeAtom);

  const openSwipeableRef = useRef(null);

  const [selectedTab, setSelectedTab] = useState("all");

  const tabs = useMemo(() => {
    return [
      // {
      //   label: "Pendientes",
      //   value: "pending",
      //   errandsList: errands.filter((errand) => !errand.completed),
      // },
      // {
      //   label: "Completados",
      //   value: "completed",
      //   errandsList: errands.filter((errand) => errand.completed),
      // },
      // { label: "Hoy", value: "today" },
      {
        label: "Todos",
        value: "all",
        errandsList: errands.filter((errand) => !errand.completed),
      },
      {
        label: "Míos",
        value: "mine",
        errandsList: errands.filter(
          (errand) =>
            user.id === errand.ownerId &&
            user.id === errand.assignedId &&
            !errand.completed
        ),
      },
      {
        label: "Recibidos",
        value: "received",
        errandsList: errands.filter(
          (errand) =>
            user.id !== errand.ownerId &&
            user.id === errand.assignedId &&
            !errand.completed
        ),
      },
      {
        label: "Enviados",
        value: "submitted",
        errandsList: errands.filter(
          (errand) =>
            user.id === errand.ownerId &&
            user.id !== errand.assignedId &&
            !errand.completed
        ),
      },
      // { label: "Marcados", value: "marked" },
    ];
  }, [errands, user]);

  useEffect(() => {
    navigation.setOptions({
      title: tabs.find((tab) => tab.value === selectedTab).label,
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
  }, [navigation, theme, selectedTab, tabs]);

  // const headerIndices = [];

  // let currentIndex = 0;
  // lists.forEach((list) => {
  //   headerIndices.push(currentIndex); // Agrega el índice del header
  //   currentIndex += 1; // Cuenta el header
  //   currentIndex += errands.filter(
  //     (errand) => errand.listId === list.id,
  //   ).length; // Cuenta las tareas de la lista
  // });

  const selectedTabObj = tabs.find((tab) => tab.value === selectedTab);

  return (
    <View
      className={`h-full bg-[${themes[theme].background}]`}
      onStartShouldSetResponder={() => {
        if (openSwipeableRef.current) {
          openSwipeableRef.current.close();
          openSwipeableRef.current = null;
          return true;
        }
        return false;
      }}
    >
      <View className="mb-3 mt-1 flex-row justify-center gap-3">
        {tabs.map((tab) => (
          <Pressable
            key={tab.value}
            onPress={() => {
              setSelectedTab(tab.value);
            }}
            className={`px-4 py-2 rounded-full shadow ${theme === "light" ? "shadow-gray-200" : "shadow-neutral-950"} ${
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
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {lists.map(
          (list) =>
            selectedTabObj.errandsList.filter(
              (errand) => errand.listId === list.id
            ).length > 0 && (
              <Pressable key={list.id} className="mb-4">
                {/* Header list */}
                <View className="flex-row justify-center items-center gap-1 mb-2">
                  <Ionicons name={list.icon} size={19} color={list.color} />
                  <Text
                    className={`text-[${themes[theme].listTitle}] text-2xl font-bold`}
                  >
                    {list.title}
                  </Text>
                </View>
                {/* List reminders */}
                {selectedTabObj.errandsList
                  .filter((errand) => errand.listId === list.id)
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
                    <FullErrand
                      key={errand.id}
                      errand={errand}
                      openSwipeableRef={openSwipeableRef}
                    />
                  ))}
              </Pressable>
            )
        )}
        {selectedTabObj.errandsList.filter(
          (errand) => errand.listId === "" && !errand.completed
        ).length > 0 && (
          <View key="no-list">
            <View className="flex-row justify-center items-center gap-1 mb-2">
              <Ionicons name="list" size={19} color="stone" />
              <Text
                className={`text-[${themes[theme].listTitle}] text-xl font-bold`}
              >
                Sin lista
              </Text>
            </View>
            {selectedTabObj.errandsList
              .filter((errand) => errand.listId === "" && !errand.completed)
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
                <FullErrand
                  key={errand.id}
                  errand={errand}
                  openSwipeableRef={openSwipeableRef}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
export default AllTasks;
