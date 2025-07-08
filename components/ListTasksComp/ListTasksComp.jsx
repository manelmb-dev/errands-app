import Animated, { LinearTransition } from "react-native-reanimated";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";

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

function ListTasksComp() {
  const navigation = useNavigation();
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
            className={`text-[${themes[theme].listTitle}] text-lg font-bold text-center mt-20`}
          >
            {i18n.t("noErrandsInThisList")}
          </Text>
        }
        // ListHeaderComponent={
        //   <View className="flex-row w-full justify-center mt-9 mb-3">
        //     <Pressable
        //       className="flex-row items-center bg-green-200 rounded-xl p-3 overflow-hidden gap-2"
        //       onPress={() => setShowCompleted(!showCompleted)}
        //     >
        //       <Ionicons name={showCompleted ? "eye-off" : "eye"} size={18} />
        //       <Text>
        //         {showCompleted ? "Ocultar completados" : "Mostrar Completados"}
        //       </Text>
        //     </Pressable>
        //   </View>
        // }
        // ListFooterComponent={
        //   showCompleted && (
        //     <View>
        //       {errands
        //         .filter((errand) => !errand.deleted)
        //         .filter((errand) => errand.listId === currentList.id)
        //         .filter((errand) => errand.completed)
        //         .sort((a, b) => {
        //           const dateA = new Date(
        //             `${a.dateErrand}T${a.timeErrand || "20:00"}`
        //           );
        //           const dateB = new Date(
        //             `${b.dateErrand}T${b.timeErrand || "20:00"}`
        //           );
        //           return dateB - dateA;
        //         })
        //         .map((errand) => (
        //           <CompletedErrand key={errand.id} errand={errand} />
        //         ))}
        //     </View>
        //   )
        // }
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
export default ListTasksComp;
