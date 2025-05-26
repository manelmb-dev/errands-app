import Animated, { LinearTransition } from "react-native-reanimated";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { errandsAtom, themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import UndoCompleteErrandButton from "../../Utils/UndoCompleteErrandButton";
import SwipeableFullErrand from "../../Utils/SwipeableFullErrand";
import { useErrandActions } from "../../hooks/useErrandActions";
import { themes } from "../../constants/themes";

function ListTasks() {
  const navigation = useNavigation();
  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const { list } = useLocalSearchParams();
  const currentList = JSON.parse(list);

  const [showCompleted, setShowCompleted] = useState(false);
  const [possibleUndoErrand, setPossibleUndoErrand] = useState(null);

  const { onCompleteWithUndo, undoCompleteErrand } = useErrandActions({
    setErrands,
    setPossibleUndoErrand,
  });

  useEffect(() => {
    navigation.setOptions({
      title: currentList.title,
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
  }, [navigation, theme, currentList]);

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
        data={errands
          .filter(
            (errand) => errand.listId === currentList.id && !errand.completed
          )
          .sort((a, b) => {
            const dateA = new Date(
              `${a.dateErrand}T${a.timeErrand || "20:00"}`
            );
            const dateB = new Date(
              `${b.dateErrand}T${b.timeErrand || "20:00"}`
            );
            return dateA - dateB;
          })}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          return (
            <SwipeableFullErrand
              key={item.id}
              errand={item}
              setErrands={setErrands}
              openSwipeableRef={openSwipeableRef}
              swipeableRefs={swipeableRefs}
              onCompleteWithUndo={onCompleteWithUndo}
            />
          );
        }}
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
        //         .filter(
        //           (errand) =>
        //             errand.listId === currentList.id && errand.completed
        //         )
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
      {possibleUndoErrand && (
        <UndoCompleteErrandButton
          possibleUndoErrand={possibleUndoErrand}
          undoCompleteErrand={undoCompleteErrand}
          openSwipeableRef={openSwipeableRef}
          setPossibleUndoErrand={setPossibleUndoErrand}
        />
      )}

      {/* <View className="flex-row justify-center w-full gap-6">
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
      </View> */}
    </View>
  );
}
export default ListTasks;
