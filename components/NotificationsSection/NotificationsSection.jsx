import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import { Ionicons } from "@expo/vector-icons";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

function NotificationsSection() {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "",
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: true,
      headerSearchBarOptions: null,
      headerLeft: () => (
        <View className="flex-1">
          <Text
            className={`text-3xl font-semibold text-[${themes[theme].text}]`}
          >
            {i18n.t("notifications")}
          </Text>
        </View>
      ),
      headerRight: () => (
        <Ionicons
          name="options"
          color={themes[theme].blueHeadText}
          size={24}
          onPress={() =>
            //FIXXX THIS;
            console.log("modal")
          }
        />
      ),
    });
  }, [navigation, theme]);
  return (
    <View className="flex-1 w-full">
      <Text className="text-3xl text-center">Notifications Section</Text>
    </View>
  );
}

export default NotificationsSection;
