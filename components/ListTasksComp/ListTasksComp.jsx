import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { errandsAtom, themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import UndoCompleteErrandButton from "../../Utils/UndoCompleteErrandButton";
import UndoDeleteErrandButton from "../../Utils/UndoDeleteErrandButton";
import SwipeableFullErrand from "../../Utils/SwipeableFullErrand";
import { useErrandActions } from "../../hooks/useErrandActions";
import { themes } from "../../constants/themes";
import ListPopup from "./ListPopup/ListPopup";
import i18n from "../../constants/i18n";
import RenderRightActionsCompletedErrand from "../../Utils/RenderRightActionsCompletedErrand";
import CompletedErrand from "../../Utils/CompletedErrand";

function ListTasksComp() {
  const navigation = useNavigation();
  const router = useRouter();

  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const { list } = useLocalSearchParams();
  const currentList = JSON.parse(list);

  const [showCompleted, setShowCompleted] = useState(false);
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
      title: currentList.title,
      headerBackTitle: i18n.t("back"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerRight: () => (
        <ListPopup
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
          list={currentList}
        />
      ),
    });
  }, [navigation, theme, currentList]);

  const flatListData = useMemo(
    () =>
      errands
        .filter((errand) => !errand.deleted)
        .filter((errand) => errand.listId === currentList.id)
        .filter((errand) => !errand.completed)
        .sort((a, b) => {
          const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
          const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
          return dateA - dateB;
        }),
    [errands, currentList]
  );

  const completedErrandsFlatlistData = useMemo(
    () =>
      errands
        .filter((errand) => !errand.deleted)
        .filter((errand) => errand.listId === currentList.id)
        .filter((errand) => errand.completed)
        .sort((a, b) => {
          const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
          const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
          return dateB - dateA;
        }),
    [errands, currentList]
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
        keyboardShouldPersistTaps="handled"
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
        ListEmptyComponent={
          <Text
            className={`text-[${themes[theme].listTitle}] text-lg font-bold text-center mt-10 mb-6`}
          >
            {i18n.t("noPendingErrandsInThisList")}
          </Text>
        }
        ListFooterComponent={
          showCompleted &&
          (completedErrandsFlatlistData.length > 0 ? (
            <View>
              <View>
                <Text
                  className={`pl-5 text-[${themes[theme].listTitle}] text-xl font-semibold mt-4 mb-2`}
                >
                  {i18n.t("completed")}
                </Text>
              </View>
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
                    openSwipeableRef.current = swipeableRefs.current[errand.id];
                  }}
                >
                  <CompletedErrand errand={errand} />
                </Swipeable>
              ))}
              <View className="items-center">
                <Pressable
                  onPress={() => setShowCompleted(false)}
                  className={`p-5 border border-[${themes[theme].borderColor}] rounded-3xl`}
                >
                  <Text>{i18n.t("hideCompleted")}</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View className="p-8 gap-3 items-center">
              <Text
                className={`font-semibold text-center text-[${themes[theme].text}]`}
              >
                {i18n.t("thereAreNoCompletedErrands")}
              </Text>
              <Pressable
                onPress={() => setShowCompleted(false)}
                className={`border border-[${themes[theme].borderColor}] p-3 rounded-3xl`}
              >
                <Text>{i18n.t("hideCompleted")}</Text>
              </Pressable>
            </View>
          ))
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
