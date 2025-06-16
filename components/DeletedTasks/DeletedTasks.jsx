import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";

import { errandsAtom, themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

function DeletedTasks() {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("deletedErrands"),
      headerBackTitle: i18n.t("back"),
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

  return (
    <View className={`h-full bg-[${themes[theme].background}]`}>
      <Text>{i18n.t("deletedErrands")}</Text>
    </View>
  );
}
export default DeletedTasks;
