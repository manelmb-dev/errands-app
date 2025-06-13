// NOT USING RIGHT NOW BECAUSE OF THE REFERENCE OF THE SWIPEABLE

import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { View, Text, Pressable } from "react-native";

import { themeAtom } from "../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../constants/themes";

const UndoDeleteErrandButton = ({
  possibleUndoErrand,
  undoCompleteErrand,
  openSwipeableRef,
  setPossibleUndoErrand
}) => {
  const [theme] = useAtom(themeAtom);

  return (
    <Pressable
      onPress={() => {
        setPossibleUndoErrand(null);
        if (openSwipeableRef.current) {
          openSwipeableRef.current.close();
          openSwipeableRef.current = null;
        }
      }}
    >
      <Animated.View
        entering={FadeInDown}
        exiting={FadeOutDown}
        className={`flex-row items-center justify-between gap-4 px-4 py-3 mx-3 absolute bottom-10 rounded-2xl bg-white shadow shadow-[${themes[theme].popupShadow}] border border-[${themes[theme].listsSeparator}]`}
      >
        <View className="flex-1">
          <Text className="text-gray-800 text-base font-semibold">
            Tarea eliminada
          </Text>
          <Text
            className={`text-[${themes[theme].blueHeadText}] text-lg font-medium truncate`}
          >
            {possibleUndoErrand.title}
          </Text>
        </View>
        <Pressable
          onPress={undoCompleteErrand}
          className="px-6 py-4 bg-red-100 rounded-full active:opacity-80"
        >
          <Text className="text-red-600 font-bold text-base">Deshacer</Text>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
};
export default UndoDeleteErrandButton;
