import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "expo-router";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { errandsAtom, themeAtom, userAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import RenderRightActionsCompletedErrand from "../../Utils/RenderRightActionsCompletedErrand";
import UndoCompleteErrandButton from "../../Utils/UndoCompleteErrandButton";
import SwipeableFullErrand from "../../Utils/SwipeableFullErrand";
import { useErrandActions } from "../../hooks/useErrandActions";
import CompletedErrand from "../../Utils/CompletedErrand";
import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";
import UndoDeleteErrandButton from "../../Utils/UndoDeleteErrandButton";

function TodayTasks() {
  const navigation = useNavigation();
  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const [selectedTab, setSelectedTab] = useState("pending");

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

  const sortByDate = (a, b) =>
    new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`) -
    new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("today"),
      headerBackTitle: i18n.t("back"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  const tabs = [
    {
      label: i18n.t("pending"),
      value: "pending",
      emptyListText: i18n.t("youAreUpToDate"),
      errandsList: errands
        .filter(
          (errand) => !errand.completed && !errand.deleted && errand.dateErrand
        )
        .filter(
          (errand) =>
            new Date(errand.dateErrand).toISOString().split("T")[0] <=
            new Date().toISOString().split("T")[0]
        ),
    },
    {
      label: i18n.t("completed"),
      value: "completed",
      emptyListText: i18n.t("thereAreNoCompletedErrands"),
      errandsList: errands
        .filter(
          (errand) =>
            !errand.completed &&
            !errand.deleted &&
            errand.dateErrand &&
            errand.completedDateErrand
        )
        .filter(
          (errand) =>
            new Date(errand.dateErrand).toISOString().split("T")[0] ===
              new Date().toISOString().split("T")[0] ||
            new Date(errand.completedDateErrand).toISOString().split("T")[0] ===
              new Date().toISOString().split("T")[0]
        ),
    },
  ];

  const selectedTabObj = tabs.find((tab) => tab.value === selectedTab);

  const errandsAssignedToMe = useMemo(() => {
    return (
      selectedTabObj?.errandsList?.filter(
        (errand) =>
          errand.assignedId === user.id || errand.assignedId === "unassigned"
      ) || []
    );
  }, [selectedTabObj, user.id]);

  const errandsOutgoingFromMe = useMemo(() => {
    return (
      selectedTabObj?.errandsList
        ?.filter((errand) => errand.ownerId === user.id)
        .filter((errand) => errand.assignedId !== user.id)
        .filter((errand) => errand.assignedId !== "unassigned") || []
    );
  }, [selectedTabObj, user.id]);

  const todayDateFormatted = new Date().toLocaleDateString(i18n.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View
      className={`flex-1 bg-[${themes[theme].background}]`}
      onStartShouldSetResponder={() => {
        if (openSwipeableRef.current) {
          openSwipeableRef.current.close();
          openSwipeableRef.current = null;
          return true;
        }
        return false;
      }}
    >
      {/* Tabs */}
      <View className="mb-4 mt-1 flex-row justify-center gap-3">
        {tabs.map((tab) => (
          <Pressable
            key={tab.value}
            onPress={() => {
              setSelectedTab(tab.value);
            }}
            className={`px-4 items-center justify-center py-3 rounded-full min-w-[90px] ${
              selectedTab === tab.value
                ? `${theme === "light" ? "bg-gray-300" : "bg-gray-700"}`
                : `bg-[${themes[theme].surfaceBackground}]`
            } shadow-sm ${theme === "light" ? "shadow-gray-200" : "shadow-neutral-950"}`}
          >
            <Text className={`text-[${themes[theme].text}] font-medium`}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Fecha */}
      <Text
        className={`ml-5 mb-2 text-2xl font-semibold text-[${themes[theme].text}]`}
      >
        {todayDateFormatted}
      </Text>

      {/* Lista de tareas */}
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={[...errandsAssignedToMe].sort(sortByDate)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={() => (
          <View className="flex-col items-center py-6 gap-1">
            <Octicons name="check-circle-fill" size={20} color="green" />
            <Text
              className={`w-full text-center text-2xl text-[${themes[theme].text}]`}
            >
              {selectedTabObj.emptyListText}
            </Text>
          </View>
        )}
        renderItem={({ item }) =>
          item.completed ? (
            <Swipeable
              ref={(ref) => (swipeableRefs.current[item.id] = ref)}
              renderRightActions={() => (
                <RenderRightActionsCompletedErrand
                  errand={item}
                  setErrands={setErrands}
                  onDeleteWithUndo={onDeleteWithUndo}
                />
              )}
              onSwipeableOpenStartDrag={() => {
                if (
                  openSwipeableRef.current &&
                  openSwipeableRef.current !== swipeableRefs.current[item.id]
                ) {
                  openSwipeableRef.current.close();
                }
                openSwipeableRef.current = swipeableRefs.current[item.id];
              }}
            >
              <CompletedErrand errand={item} />
            </Swipeable>
          ) : (
            <SwipeableFullErrand
              errand={item}
              setErrands={setErrands}
              openSwipeableRef={openSwipeableRef}
              swipeableRefs={swipeableRefs}
              onCompleteWithUndo={onCompleteWithUndo}
              onDeleteWithUndo={onDeleteWithUndo}
            />
          )
        }
        ListFooterComponent={() =>
          errandsOutgoingFromMe.length > 0 ? (
            <View className="mt-6">
              <View className="flex-row justify-center items-center gap-2 mb-2">
                <Ionicons name="send" size={18} color="#161618" />
                <Text
                  className={`text-[${themes[theme].listTitle}] text-2xl font-bold`}
                >
                  {i18n.t("outgoing")}
                </Text>
              </View>
              {errandsOutgoingFromMe.sort(sortByDate).map((errand) => {
                return errand.completed ? (
                  <Swipeable
                    key={errand.id}
                    ref={(ref) => (swipeableRefs.current[errand.id] = ref)}
                    renderRightActions={() => (
                      <RenderRightActionsCompletedErrand
                        errand={errand}
                        setErrands={setErrands}
                        onDeleteWithUndo={onDeleteWithUndo}
                      />
                    )}
                    onSwipeableOpenStartDrag={() => {
                      if (
                        openSwipeableRef.current &&
                        openSwipeableRef.current !==
                          swipeableRefs.current[errand.id]
                      ) {
                        openSwipeableRef.current.close();
                      }
                      openSwipeableRef.current =
                        swipeableRefs.current[errand.id];
                    }}
                  >
                    <CompletedErrand errand={errand} />
                  </Swipeable>
                ) : (
                  <SwipeableFullErrand
                    key={errand.id}
                    errand={errand}
                    setErrands={setErrands}
                    openSwipeableRef={openSwipeableRef}
                    swipeableRefs={swipeableRefs}
                    onCompleteWithUndo={onCompleteWithUndo}
                    onDeleteWithUndo={onDeleteWithUndo}
                  />
                );
              })}
            </View>
          ) : null
        }
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

export default TodayTasks;
