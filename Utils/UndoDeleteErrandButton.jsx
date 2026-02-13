// NOT USING RIGHT NOW BECAUSE OF THE REFERENCE OF THE SWIPEABLE

import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { View, Text, Pressable } from "react-native";

import { themeAtom } from "../constants/storeAtoms";
import { useAtom } from "jotai";

import { Ionicons } from "@expo/vector-icons";

import { themes } from "../constants/themes";
import i18n from "../constants/i18n";

const UndoDeleteErrandButton = ({
  possibleUndoDeleteErrand,
  undoDeleteErrand,
  openSwipeableRef,
  setPossibleUndoDeleteErrand,
}) => {
  const [theme] = useAtom(themeAtom);

  return (
    <Pressable
      onPress={() => {
        setPossibleUndoDeleteErrand(null);
        if (openSwipeableRef.current) {
          openSwipeableRef.current.close();
          openSwipeableRef.current = null;
        }
      }}
    >
      <Animated.View
        entering={FadeInDown}
        exiting={FadeOutDown}
        className={`flex-row items-center justify-between gap-4 px-4 py-4 mx-3 absolute bottom-10 rounded-2xl bg-white shadow shadow-[${themes[theme].popupShadow}] border border-[${themes[theme].borderColor}]`}
      >
        <Ionicons
          className="p-1.5 bg-red-400 rounded-full"
          name="trash"
          size={20}
          color={themes["dark"].text}
        />
        <View className="flex-1">
          <Text className="text-gray-800 text-base font-semibold">
            {i18n.t("deletedErrand")}
          </Text>
          <Text
            className={`text-[${themes[theme].blueHeadText}] text-lg font-medium truncate`}
          >
            {possibleUndoDeleteErrand.title}
          </Text>
        </View>
        <Pressable
          onPress={undoDeleteErrand}
          className="px-4 py-3 bg-gray-200 rounded-full active:opacity-80"
        >
          <Text
            className={`font-bold text-base text-[${themes["light"].text}]`}
          >
            {i18n.t("undo")}
          </Text>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
};
export default UndoDeleteErrandButton;
