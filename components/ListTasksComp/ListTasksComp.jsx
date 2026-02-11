import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  currentListAtom,
  errandsAtom,
  themeAtom,
  userAtom,
  usersSharedWithAtom,
} from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import RenderRightActionsCompletedErrand from "../../Utils/RenderRightActionsCompletedErrand";
import UndoCompleteErrandButton from "../../Utils/UndoCompleteErrandButton";
import UndoDeleteErrandButton from "../../Utils/UndoDeleteErrandButton";
import SwipeableFullErrand from "../../Utils/SwipeableFullErrand";
import { useErrandActions } from "../../hooks/useErrandActions";
import ListSharedUsers from "./ListSharedUsers/ListSharedUsers";
import CompletedErrand from "../../Utils/CompletedErrand";
import { themes } from "../../constants/themes";
import ListPopup from "./ListPopup/ListPopup";
import i18n from "../../constants/i18n";

function ListTasksComp() {
  const navigation = useNavigation();
  const router = useRouter();

  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [currentList] = useAtom(currentListAtom);
  const [usersSharedWith, setUsersSharedWith] = useAtom(usersSharedWithAtom);

  const [showUsersSharedWith, setShowUsersSharedWith] = useState(false);
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
    setUsersSharedWith(currentList.usersShared.filter((id) => id !== user.id));
  }, [setUsersSharedWith, user.id, currentList.usersShared]);

  useEffect(() => {
    navigation.setOptions({
      title: currentList.title,
      headerBackTitle: i18n.t("back"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerRight: () => (
        <ListPopup
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
          completedErrandsFlatlistDataLength={
            completedErrandsFlatlistData.length
          }
        />
      ),
    });
  }, [
    navigation,
    theme,
    currentList.title,
    showCompleted,
    completedErrandsFlatlistData,
    errands
  ]);

  const flatListData = useMemo(
    () =>
      errands
        .filter(
          (errand) =>
            !errand.deleted &&
            !errand.completed &&
            errand.listId === currentList.id,
        )
        .sort((a, b) => {
          const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
          const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
          return dateA - dateB;
        }),
    [errands, currentList.id],
  );

  const completedErrandsFlatlistData = useMemo(
    () =>
      errands
        .filter(
          (errand) =>
            !errand.deleted &&
            errand.completed &&
            errand.listId === currentList.id,
        )
        .sort((a, b) => {
          const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
          const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
          return dateB - dateA;
        }),
    [errands, currentList.id],
  );

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
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={flatListData}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {usersSharedWith.length > 0 && (
              <>
                {/* Users shared with */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowUsersSharedWith((prev) => !prev);
                  }}
                >
                  <View
                    className={`flex-row items-center bg-[${themes[theme].background}] border-b border-[${themes[theme].borderColor}]`}
                  >
                    <MaterialCommunityIcons
                      className="mx-4 p-1.5 bg-slate-400 rounded-lg"
                      name="account-group"
                      size={24}
                      color={themes["light"].background}
                    />
                    <View
                      className={`py-4 flex-row flex-1 gap-4 items-center justify-between`}
                    >
                      <Text className={`text-lg text-[${themes[theme].text}]`}>
                        {i18n.t("listShared")}
                      </Text>
                      <View className="mr-4 flex-row gap-3 items-center">
                        <Text
                          className={`text-lg text-[${themes[theme].listTitle}]`}
                        >
                          {usersSharedWith.length}
                        </Text>
                        <Ionicons
                          name={
                            showUsersSharedWith
                              ? "chevron-down-outline"
                              : "chevron-forward-outline"
                          }
                          size={23}
                          color={themes["light"].taskSecondText}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                {showUsersSharedWith && (
                  <ListSharedUsers listOwner={currentList.ownerId} />
                )}
              </>
            )}
            <View className={`p-6 flex-row gap-5 items-center`}>
              <Text
                className={`text-2xl font-semibold text-[${themes[theme].text}]`}
              >
                {i18n.t("pendingTasks")}
              </Text>
              <Text
                className={`text-[${themes[theme].taskSecondText}] text-xl font-semibold`}
              >
                {flatListData.length}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => {
          return (
            <SwipeableFullErrand
              errand={item}
              setErrands={setErrands}
              openSwipeableRef={openSwipeableRef}
              swipeableRefs={swipeableRefs}
              onCompleteWithUndo={onCompleteWithUndo}
              onDeleteWithUndo={onDeleteWithUndo}
            />
          );
        }}
        ListFooterComponent={
          <View>
            <View className="flex-row mt-4 mb-2 p-6 w-full justify-between">
              <View className="flex-row gap-5 items-center">
                <Text
                  className={`text-[${themes[theme].listTitle}] text-2xl font-semibold`}
                >
                  {i18n.t("completedTasks")}
                </Text>
                <Text
                  className={`text-[${themes[theme].taskSecondText}] text-xl font-semibold`}
                >
                  {completedErrandsFlatlistData.length}
                </Text>
              </View>
              {completedErrandsFlatlistData.length > 0 && (
                <Pressable
                  onPress={() => setShowCompleted(!showCompleted)}
                  className="flex-row items-center"
                >
                    <Text
                      className={`text-[${themes[theme].blueHeadText}] font-semibold text-base`}
                    >
                      {showCompleted ? i18n.t("hide") : i18n.t("show")}
                    </Text>
                </Pressable>
              )}
            </View>
            {showCompleted && completedErrandsFlatlistData.length > 0 && (
              <View>
                {completedErrandsFlatlistData.map((errand) => (
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
          </View>
        }
      />
      <TouchableOpacity
        activeOpacity={0.7}
        className={`w-16 h-16 rounded-full absolute bottom-16 right-8 justify-center items-center ${theme === "light" ? `bg-${currentList.color}-300` : `bg-${currentList.color}-600`} shadow-sm shadow-[${themes[theme].shadowColor}]`}
        onPress={() =>
          router.push({
            pathname: "/Modals/newTaskModal",
            params: { list: JSON.stringify(currentList) },
          })
        }
      >
        <Ionicons name="add" size={38} color={themes[theme].text} />
      </TouchableOpacity>
      {/* <Ionicons
        onPress={() =>
          router.push({
            pathname: "/Modals/newTaskModal",
            params: { list: JSON.stringify(currentList) },
          })
        }
        className="opacity-70"
        name="add-circle"
        size={60}
        color={themes[theme].text}
      /> */}

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
export default ListTasksComp;
