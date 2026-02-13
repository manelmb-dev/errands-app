import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { View, Text, Pressable } from "react-native";

import { languageAtom, themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import { Feather } from "@expo/vector-icons";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const UnblockUserPopup = ({ user, setShowUnblockedUserPopup }) => {
  const [theme] = useAtom(themeAtom);
  const [lang] = useAtom(languageAtom);

  return (
    <Pressable
      onPress={() => {
        setShowUnblockedUserPopup(null);
      }}
    >
      <Animated.View
        entering={FadeInDown}
        exiting={FadeOutDown}
        className={`flex-row items-center justify-between gap-4 px-4 py-4 mx-3 absolute bottom-10 rounded-2xl bg-[${themes[theme].background}] shadow shadow-[${themes[theme].popupShadow}] border border-[${themes[theme].borderColor}]`}
      >
        <Feather name="user-check" size={27} color="green" />
        <View className="flex-1">
          {lang === "en" ? (
            <Text className="text-gray-800 text-base font-semibold">
              {user.name}
              {user.surname ? " " + user.surname : ""}{" "}
              {i18n.t("userHasBeenUnblocked")}.
            </Text>
          ) : (
            <Text className="text-gray-800 text-base font-semibold">
              {i18n.t("userHasBeenUnblocked")} {user.name}
              {user.surname ? " " + user.surname : ""}.
            </Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};
export default UnblockUserPopup;
