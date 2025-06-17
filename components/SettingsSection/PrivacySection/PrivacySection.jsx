import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";

import { useAtom } from "jotai";
import { themeAtom } from "../../../constants/storeAtoms";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";
import { useNavigation } from "expo-router";

const PrivacySection = () => {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: i18n.t("privacy"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerBackTitle: i18n.t("back"),
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  return (
    <ScrollView className={`flex-1 p-5 bg-[${themes[theme].background}]`}>
      <Text className={`text-lg leading-6 text-[${themes[theme].text}]`}>
        {i18n.t("privacyFullText")}
      </Text>
    </ScrollView>
  );
};
export default PrivacySection;
