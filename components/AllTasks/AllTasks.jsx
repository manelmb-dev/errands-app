import Animated, { LinearTransition } from "react-native-reanimated";
import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "expo-router";

// import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAtom } from "jotai";
import {
  errandsAtom,
  listsAtom,
  themeAtom,
  userAtom,
} from "../../constants/storeAtoms";

import UndoCompleteErrandButton from "../../Utils/UndoCompleteErrandButton";
import SwipeableFullErrand from "../../Utils/SwipeableFullErrand";
import { useErrandActions } from "../../hooks/useErrandActions";
import { themes } from "../../constants/themes";

function AllTasks() {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [lists] = useAtom(listsAtom);
  const [theme] = useAtom(themeAtom);

  const [selectedTab, setSelectedTab] = useState("all");

  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [possibleUndoErrand, setPossibleUndoErrand] = useState(null);

  const { onCompleteWithUndo, undoCompleteErrand } = useErrandActions({
    setErrands,
    setPossibleUndoErrand,
  });

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
    ];
  }, [errands, user]);

  const selectedTabObj = tabs.find((tab) => tab.value === selectedTab);

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

  const flatListData = useMemo(() => {
    const items = lists
      .map((list) => ({
        ...list,
        errands: selectedTabObj.errandsList
          .filter((errand) => errand.listId === list.id)
          .sort((a, b) => {
            const dateA = new Date(
              `${a.dateErrand}T${a.timeErrand || "20:00"}`
            );
            const dateB = new Date(
              `${b.dateErrand}T${b.timeErrand || "20:00"}`
            );
            return dateA - dateB;
          }),
      }))
      .filter((list) => list.errands.length > 0);

    const unlistedErrands = selectedTabObj.errandsList
      .filter((e) => e.listId === "")
      .sort((a, b) => {
        const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
        const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
        return dateA - dateB;
      });

    if (unlistedErrands.length > 0) {
      items.push({
        id: "",
        title: "Sin lista",
        icon: "list",
        color: "gray",
        errands: unlistedErrands,
      });
    }

    return items;
  }, [selectedTabObj, lists]);

  return (
    <View
      className={`h-full w-full bg-[${themes[theme].background}]`}
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
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={flatListData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item: list }) => (
          <View key={list.id}>
            {/* Header */}
            <View className="flex-row justify-center items-center gap-1 mt-3 mb-2">
              <Ionicons name={list.icon} size={21} color={list.color} />
              <Text
                className={`text-[${themes[theme].listTitle}] text-2xl font-bold`}
              >
                {list.title}
              </Text>
            </View>

            {/* Uncompleted errands */}
            {list.errands
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
              .map((errand) => (
                <SwipeableFullErrand
                  key={errand.id}
                  errand={errand}
                  setErrands={setErrands}
                  openSwipeableRef={openSwipeableRef}
                  swipeableRefs={swipeableRefs}
                  onCompleteWithUndo={onCompleteWithUndo}
                />
              ))}
          </View>
        )}
      />

      {possibleUndoErrand && (
        <UndoCompleteErrandButton
          possibleUndoErrand={possibleUndoErrand}
          undoCompleteErrand={undoCompleteErrand}
          openSwipeableRef={openSwipeableRef}
          setPossibleUndoErrand={setPossibleUndoErrand}
        />
      )}
    </View>
  );
}
export default AllTasks;
