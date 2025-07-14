import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "expo-router";
import { Text, View } from "react-native";

import { useAtom } from "jotai";
import {
  errandsAtom,
  listsAtom,
  themeAtom,
  userAtom,
} from "../../constants/storeAtoms";

import Ionicons from "react-native-vector-icons/Ionicons";

import UndoCompleteErrandButton from "../../Utils/UndoCompleteErrandButton";
import SwipeableFullErrand from "../../Utils/SwipeableFullErrand";
import { useErrandActions } from "../../hooks/useErrandActions";
import CompletedErrand from "../../Utils/CompletedErrand";
import { themes } from "../../constants/themes";
import RenderRightActionsCompletedErrand from "../../Utils/RenderRightActionsCompletedErrand";
import i18n from "../../constants/i18n";
import UndoDeleteErrandButton from "../../Utils/UndoDeleteErrandButton";

function FilterTasksComp() {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [lists] = useAtom(listsAtom);

  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

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

  const [uncompletedErrands, setUncompletedErrands] = useState(0);
  const [todayErrands, setTodayErrands] = useState(0);
  const [personalErrands, setPersonalErrands] = useState(0);
  const [incomingErrands, setIncomingErrands] = useState(0);
  const [outgoingErrands, setOutgoingErrands] = useState(0);
  const [markedErrands, setMarkedErrands] = useState(0);

  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);
  const [taskSearchInput, settaskSearchInput] = useState("");
  const [filteredErrands, setFilteredErrands] = useState(errands);

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      // headerSearchBarOptions: {
      //   placeholder: {i18n.t("search")},
      //   obscureBackground: taskSearchInput.length > 0 ? false : true,
      //   onChangeText: (event) => {
      //     settaskSearchInput(event.nativeEvent.text);
      //   },
      // },
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme, taskSearchInput]);

  {
    /* Filter errands*/
  }
  useEffect(() => {
    setFilteredErrands(
      errands
        .filter((errand) => !errand.deleted)
        .filter((errand) =>
          errand.title.toLowerCase().includes(taskSearchInput.toLowerCase())
        )
    );
  }, [taskSearchInput, errands]);

  {
    /* Prepare errands for FlatList */
  }
  const flatListData = useMemo(() => {
    const items = lists
      .sort((a, b) => {
        const aIsNotShared = a.usersShared?.length === 1;
        const bIsNotShared = b.usersShared?.length === 1;

        if (aIsNotShared && !bIsNotShared) return -1;
        if (!aIsNotShared && bIsNotShared) return 1;
        return 0;
      })
      .map((list) => ({
        ...list,
        errands: filteredErrands.filter((errand) => errand.listId === list.id),
      }))
      .filter((list) => list.errands.length > 0);

    const sharedErrands = filteredErrands.filter((e) => e.listId === "");
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
  }, [filteredErrands, lists]);

  useEffect(() => {
    const notCompleted = errands
      .filter((errand) => !errand.deleted)
      .filter((errand) => !errand.completed);

    const todayDate = new Date().toISOString().split("T")[0];
    const today = errands
      .filter((errand) => !errand.deleted)
      .filter((errand) => {
        if (errand.dateErrand === "") return false;
        const errandDate = new Date(errand.dateErrand)
          .toISOString()
          .split("T")[0];
        return errandDate <= todayDate && !errand.completed;
      });

    const personal = errands
      .filter((errand) => !errand.deleted)
      .filter(
        (errand) =>
          user.id === errand.ownerId &&
          user.id === errand.assignedId &&
          !errand.completed
      );

    const incoming = errands
      .filter((errand) => !errand.deleted)
      .filter(
        (errand) =>
          user.id !== errand.ownerId &&
          user.id === errand.assignedId &&
          !errand.completed
      );

    const outgoing = errands
      .filter((errand) => !errand.deleted)
      .filter(
        (errand) =>
          user.id === errand.ownerId &&
          user.id !== errand.assignedId &&
          !errand.completed
      );

    const marked = errands
      .filter((errand) => !errand.deleted)
      .filter((errand) => errand.marked && !errand.completed);

    setUncompletedErrands(notCompleted.length);
    setTodayErrands(today.length);
    setPersonalErrands(personal.length);
    setIncomingErrands(incoming.length);
    setOutgoingErrands(outgoing.length);
    setMarkedErrands(marked.length);
  }, [errands, user]);

  return (
    <View className={`flex-1 flex-row bg-[${themes[theme].background}]`}>
      <View
        className="flex-1"
        onStartShouldSetResponder={() => {
          if (openSwipeableRef.current) {
            openSwipeableRef.current.close();
            openSwipeableRef.current = null;
            return true;
          }
          return false;
        }}
      >
        <Animated.FlatList
          itemLayoutAnimation={LinearTransition}
          data={flatListData}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyExtractor={(item) => item.id || "no-list"}
          renderItem={({ item: list, index }) => (
            <View key={list.id}>
              {/* Header */}
              <View
                className={`${index !== 0 ? "mt-7" : "mt-3"} mb-5 flex-row justify-center items-center gap-3`}
              >
                <Ionicons
                  className={`bg-${list.color}-300 p-1.5 rounded-xl`}
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

              {/* Uncompleted */}
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

              {/* Completed */}
              {list.errands
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
                .map((errand) => (
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
                ))}
            </View>
          )}
          ListEmptyComponent={
            <Text
              className={`text-[${themes[theme].listTitle}] text-lg font-bold text-center mt-40`}
            >
              {i18n.t("noSearchErrands")}
            </Text>
          }
        />
      </View>

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

export default FilterTasksComp;
