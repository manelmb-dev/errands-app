import Animated, { LinearTransition } from "react-native-reanimated";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "expo-router";
import { View } from "react-native";

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

function MarkedTasks() {
  const navigation = useNavigation();
  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [lists, setLists] = useAtom(listsAtom);

  const [showCompleted, setShowCompleted] = useState(false);
  const [possibleUndoErrand, setPossibleUndoErrand] = useState(null);

  const { onCompleteWithUndo, undoCompleteErrand } = useErrandActions({
    setErrands,
    setPossibleUndoErrand,
  });

  useEffect(() => {
    navigation.setOptions({
      title: "Destacados",
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
  }, [navigation, theme]);

  const markedActiveErrands = errands
    .filter(
      (errand) => errand.ownerId === user.id || user.id === errand.assignedId
    )
    .filter((errand) => errand.marked && !errand.completed)
    .sort((a, b) => {
      const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
      const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
      return dateA - dateB;
    });

  const markedCompletedErrands = errands
    .filter(
      (errand) => errand.ownerId === user.id || user.id === errand.assignedId
    )
    .filter((errand) => errand.marked && errand.completed)
    .sort((a, b) => {
      const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
      const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
      return dateB - dateA;
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
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={markedActiveErrands}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableFullErrand
            errand={item}
            setErrands={setErrands}
            openSwipeableRef={openSwipeableRef}
            swipeableRefs={swipeableRefs}
            onCompleteWithUndo={onCompleteWithUndo}
          />
        )}
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
        //       {markedCompletedErrands.map((errand) => (
        //         <CompletedErrand key={errand.id} errand={errand} />
        //       ))}
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
    </View>
  );
}
export default MarkedTasks;
