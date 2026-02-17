import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { View, Text, Pressable } from "react-native";

import { themeAtom } from "../constants/storeUiAtoms";
import { useAtom } from "jotai";

import { Octicons } from "@expo/vector-icons";

import { themes } from "../constants/themes";
import i18n from "../constants/i18n";

const UndoCompleteErrandButton = ({
  possibleUndoCompleteErrand,
  undoCompleteErrand,
  openSwipeableRef,
  setPossibleUndoCompleteErrand,
}) => {
  const [theme] = useAtom(themeAtom);

  return (
    <Pressable
      onPress={() => {
        setPossibleUndoCompleteErrand(null);
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
        <Octicons name="check-circle-fill" size={27} color="green" />
        <View className="flex-1">
          <Text className="text-gray-800 text-base font-semibold">
            {i18n.t("completedErrand")}
          </Text>
          <Text
            className={`text-[${themes[theme].blueHeadText}] text-lg font-medium truncate`}
          >
            {possibleUndoCompleteErrand.title}
          </Text>
        </View>
        <Pressable
          onPress={undoCompleteErrand}
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
export default UndoCompleteErrandButton;
