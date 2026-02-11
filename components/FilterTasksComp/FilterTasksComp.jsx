import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "expo-router";
import { Text, View, Pressable, Alert } from "react-native";

import { useAtom } from "jotai";
import { errandsAtom, listsAtom, themeAtom } from "../../constants/storeAtoms";

import Ionicons from "react-native-vector-icons/Ionicons";

import RenderRightActionsCompletedErrand from "../../Utils/RenderRightActionsCompletedErrand";
import UndoCompleteErrandButton from "../../Utils/UndoCompleteErrandButton";
import UndoDeleteErrandButton from "../../Utils/UndoDeleteErrandButton";
import SwipeableFullErrand from "../../Utils/SwipeableFullErrand";
import { useErrandActions } from "../../hooks/useErrandActions";
import CompletedErrand from "../../Utils/CompletedErrand";
import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const sortByDate = (a, b) => {
  const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
  const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
  return dateA - dateB;
};

const sortByDateDesc = (a, b) => {
  const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
  const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
  return dateB - dateA;
};

function FilterTasksComp() {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);
  const [lists] = useAtom(listsAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
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

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "",
      headerBackTitle: i18n.t("back"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: {
        placeholder: i18n.t("search"),
        hideWhenScrolling: false,
        obscureBackground: false,
        autoCapitalize: "none",
        onChangeText: (event) => {
          setSearchQuery(event.nativeEvent.text);
        },
      },
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  const filteredErrands = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    return errands
      .filter((errand) => !errand.deleted)
      .filter((errand) =>
        errand.title.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      );
  }, [searchQuery, errands]);

  const completedCount = useMemo(() => {
    return filteredErrands.filter((errand) => errand.completed).length;
  }, [filteredErrands]);

  const handleDeleteAllCompleted = () => {
    Alert.alert(
      i18n.t("deleteCompletedErrands"),
      i18n.t("areYouSureDeleteAllCompletedErrands"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("delete"),
          style: "destructive",
          onPress: () => {
            const completedErrands = filteredErrands.filter(
              (errand) => errand.completed,
            );
            const updatedErrands = errands.map((errand) => {
              if (completedErrands.find((ce) => ce.id === errand.id)) {
                return { ...errand, deleted: true };
              }
              return errand;
            });
            setErrands(updatedErrands);

            // FIRESTOREEEE FIXXX THIS
          },
        },
      ],
    );
  };

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
        errands: filteredErrands.filter((errand) => {
          if (errand.listId !== list.id) return false;
          if (!showCompleted && errand.completed) return false;
          return true;
        }),
      }))
      .filter((list) => list.errands.length > 0);

    const sharedErrands = filteredErrands.filter((e) => {
      if (e.deleted || e.listId !== "unassigned") return false;
      if (!showCompleted && e.completed) return false;
      return true;
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
  }, [filteredErrands, lists, showCompleted]);

  const hasResults = searchQuery.trim() && filteredErrands.length > 0;

  return (
    <View className="flex-1 w-full bg-[${themes[theme].background}]">
      <View
        className="flex-1 w-full pt-36"
        onStartShouldSetResponder={() => {
          if (openSwipeableRef.current) {
            openSwipeableRef.current.close();
            openSwipeableRef.current = null;
            return true;
          }
          return false;
        }}
      >
        {hasResults && (
          <View className="mx-4 mb-2 p-2 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text
                className={`text-[${themes[theme].taskSecondText}] text-base`}
              >
                {completedCount} {i18n.t("completed").toLowerCase()}
                {completedCount > 0 && "  |"}
              </Text>
              {completedCount > 0 && (
                <Pressable onPress={handleDeleteAllCompleted}>
                  <Text
                    className={`text-[${themes[theme].blueHeadText}] font-semibold text-base`}
                  >
                    {i18n.t("delete")}
                  </Text>
                </Pressable>
              )}
            </View>
            {completedCount > 0 && (
              <Pressable
                onPress={() => setShowCompleted(!showCompleted)}
                className="flex-row items-center gap-1.5"
              >
                <Text
                  className={`text-[${themes[theme].blueHeadText}] font-semibold text-base`}
                >
                  {showCompleted ? i18n.t("hide") : i18n.t("show")}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        <Animated.FlatList
          itemLayoutAnimation={LinearTransition}
          data={flatListData}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item: list, index }) => (
            <View key={list.id}>
              {/* List Header */}
              <View
                className={`${index !== 0 ? "mt-7" : "mt-3"} mb-5 flex-row justify-center items-center gap-3`}
              >
                <Ionicons
                  className={`${theme === "light" ? `bg-${list.color}-300` : `bg-${list.color}-600`} p-1.5 rounded-xl`}
                  name={list.icon}
                  size={19}
                  color={themes[theme].text}
                />
                <Text
                  className={`text-[${themes[theme].listTitle}] text-2xl font-bold`}
                >
                  {list.title}
                </Text>
              </View>

              {/* Uncompleted Errands */}
              {list.errands
                .filter((errand) => !errand.completed)
                .sort(sortByDate)
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

              {/* Completed Errands */}
              {showCompleted &&
                list.errands
                  .filter((errand) => errand.completed)
                  .sort(sortByDateDesc)
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
            <View className="flex-1 flex-col mt-14 mx-12 justify-center items-center gap-6">
              <Text
                className={`text-[${themes[theme].text}] text-xl font-semibold text-center`}
              >
                {searchQuery.trim()
                  ? i18n.t("noSearchErrands")
                  : i18n.t("searchForErrands")}
              </Text>
            </View>
          }
        />
      </View>

      {possibleUndoCompleteErrand && (
        <View>
          <UndoCompleteErrandButton
            possibleUndoCompleteErrand={possibleUndoCompleteErrand}
            undoCompleteErrand={undoCompleteErrand}
            openSwipeableRef={openSwipeableRef}
            setPossibleUndoCompleteErrand={setPossibleUndoCompleteErrand}
          />
        </View>
      )}
      {possibleUndoDeleteErrand && (
        <View>
          <UndoDeleteErrandButton
            possibleUndoDeleteErrand={possibleUndoDeleteErrand}
            undoDeleteErrand={undoDeleteErrand}
            openSwipeableRef={openSwipeableRef}
            setPossibleUndoDeleteErrand={setPossibleUndoDeleteErrand}
          />
        </View>
      )}
    </View>
  );
}

export default FilterTasksComp;
