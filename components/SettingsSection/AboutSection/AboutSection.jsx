import { View, Text, ScrollView } from "react-native";

import { themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
const AboutSection = () => {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: i18n.t("about"),
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
      <Text className={`text-base leading-6 text-[${themes[theme].text}]`}>
        {i18n.t("aboutAppFullText")}
      </Text>
    </ScrollView>
  );
};
export default AboutSection;
