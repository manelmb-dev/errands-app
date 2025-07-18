import Animated, { LinearTransition } from "react-native-reanimated";
import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text } from "react-native";
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
import i18n from "../../constants/i18n";
import UndoDeleteErrandButton from "../../Utils/UndoDeleteErrandButton";

function AllTasksComp() {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [lists] = useAtom(listsAtom);
  const [theme] = useAtom(themeAtom);

  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  // const [selectedTab, setSelectedTab] = useState("all");
  const [possibleUndoCompleteErrand, setPossibleUndoCompleteErrand] =
    useState(null);
  const [possibleUndoDeleteErrand, setPossibleUndoDeleteErrand] =
    useState(null);

  const {
    onCompleteWithUndo,
    undoCompleteErrand,
    onDeleteWithUndo,
    undoDeleteErrand,
  } = useErrandActions({
    setErrands,
    setPossibleUndoCompleteErrand,
    setPossibleUndoDeleteErrand,
    possibleUndoCompleteErrand,
    possibleUndoDeleteErrand,
  });

  // const tabs = useMemo(() => {
  //   return [
  //     // {
  //     //   label: i18n.t("pending"),
  //     //   value: "pending",
  //     //   errandsList: errands.filter((errand) => !errand.deleted).filter((errand) => !errand.completed),
  //     // },
  //     // {
  //     //   label: i18n.t("completed"),
  //     //   value: "completed",
  //     //   errandsList: errands.filter((errand) => !errand.deleted).filter((errand) => errand.completed),
  //     // },
  //     {
  //       label: i18n.t("all"),
  //       value: "all",
  //       errandsList: errands
  //         .filter((errand) => !errand.deleted)
  //         .filter((errand) => !errand.completed),
  //     },
  //     {
  //       label: i18n.t("mine"),
  //       value: "mine",
  //       errandsList: errands
  //         .filter((errand) => !errand.deleted)
  //         .filter(
  //           (errand) =>
  //             user.id === errand.ownerId &&
  //             user.id === errand.assignedId &&
  //             !errand.completed
  //         ),
  //     },
  //     {
  //       label: i18n.t("incoming"),
  //       value: "incoming",
  //       errandsList: errands
  //         .filter((errand) => !errand.deleted)
  //         .filter(
  //           (errand) =>
  //             user.id !== errand.ownerId &&
  //             user.id === errand.assignedId &&
  //             !errand.completed
  //         ),
  //     },
  //     {
  //       label: i18n.t("outgoing"),
  //       value: "outgoing",
  //       errandsList: errands
  //         .filter((errand) => !errand.deleted)
  //         .filter(
  //           (errand) =>
  //             user.id === errand.ownerId &&
  //             user.id !== errand.assignedId &&
  //             !errand.completed
  //         ),
  //     },
  //   ];
  // }, [errands, user]);

  // const selectedTabObj = tabs.find((tab) => tab.value === selectedTab);

  useEffect(() => {
    navigation.setOptions({
      // title: tabs.find((tab) => tab.value === selectedTab).label,
      title: i18n.t("all"),
      headerBackTitle: i18n.t("back"),
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

  const flatListData = useMemo(() => {
    const items = lists
      .sort((a, b) => {
        const aIsShared = a.usersShared?.length > 1;
        const bIsShared = b.usersShared?.length > 1;

        if (!aIsShared && bIsShared) return -1;
        if (aIsShared && !bIsShared) return 1;
        return 0;
      })
      .map((list) => ({
        ...list,
        // errands: selectedTabObj.errandsList
        errands: errands
          .filter((errand) => !errand.deleted)
          .filter((errand) => !errand.completed)
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

    // const sharedErrands = selectedTabObj.errandsList
    const sharedErrands = errands
      .filter((e) => !e.deleted && !e.completed && e.listId === "unassigned")
      .sort((a, b) => {
        const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
        const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
        return dateA - dateB;
      });

    if (sharedErrands.length > 0) {
      items.push({
        id: "sharedErrandsId",
        title: i18n.t("shared"),
        icon: "people",
        color: "slate",
        errands: sharedErrands,
      });
    }

    return items;
  }, [lists, errands]);

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
      {/* <View className="mb-1.5 mt-1 flex-row justify-center gap-3">
        {tabs.map((tab) => (
          <Pressable
            key={tab.value}
            onPress={() => {
              setSelectedTab(tab.value);
            }}
            className={`px-4 py-2 rounded-full shadow ${theme === "light" ? "shadow-gray-200" : "shadow-neutral-950"} ${
              selectedTab === tab.value
                ? "bg-blue-300"
                : `bg-[${themes[theme].surfaceBackground}]`
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
      </View> */}
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={flatListData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item: list, index }) => (
          <View key={list.id}>
            {/* Header */}
            <View
              className={`${index !== 0 ? "mt-7" : "mt-3"} mb-5 flex-row justify-center items-center gap-3`}
            >
              <Ionicons
                className={`${theme === "light" ? `bg-${list.color}-300` : `bg-${list.color}-600`} p-1.5 rounded-xl`}
                name={list.icon}
                size={19}
                color={`${themes[theme].text}`}
              />
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
                  onDeleteWithUndo={onDeleteWithUndo}
                />
              ))}
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 flex-col mt-14 mx-12 justify-center items-center gap-6">
            <Text
              className={`text-[${themes[theme].text}] text-xl font-semibold`}
            >
              {i18n.t("wellDone!")}
            </Text>
            <Text
              className={`text-[${themes[theme].text}] text-lg text-center`}
            >
              {i18n.t("allYourTasksAreCompleted")}
            </Text>
          </View>
        )}
      />

      {possibleUndoCompleteErrand && (
        <UndoCompleteErrandButton
          possibleUndoCompleteErrand={possibleUndoCompleteErrand}
          undoCompleteErrand={undoCompleteErrand}
          openSwipeableRef={openSwipeableRef}
          setPossibleUndoCompleteErrand={setPossibleUndoCompleteErrand}
        />
      )}
      {possibleUndoDeleteErrand && (
        <UndoDeleteErrandButton
          possibleUndoDeleteErrand={possibleUndoDeleteErrand}
          undoDeleteErrand={undoDeleteErrand}
          openSwipeableRef={openSwipeableRef}
          setPossibleUndoDeleteErrand={setPossibleUndoDeleteErrand}
        />
      )}
    </View>
  );
}
export default AllTasksComp;
