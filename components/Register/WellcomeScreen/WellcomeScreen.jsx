// components/RegisterScreen.jsx
import { useNavigation, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useEffect } from "react";

import { themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

export default function WellcomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [theme] = useAtom(themeAtom);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  return (
    <View
      className={`flex-1 px-10 justify-center items-center gap-20 bg-[${themes[theme].background}]`}
    >
      <Image
        source={require("../../../assets/icon.png")}
        style={{ width: 125, height: 125, borderRadius: 25 }}
      />
      <View className="items-center gap-2">
        <Text className={`text-4xl font-semibold text-[${themes[theme].text}]`}>
          {i18n.t("wellcome")}
        </Text>
        <Text className={` text-lg font-semiboldtext-[${themes[theme].text}]`}>
          {i18n.t("wellcomeText")}
        </Text>
      </View>
      <View className="w-full">
        <TouchableOpacity
          className={`p-3 rounded-3xl items-center justify-center bg-[${themes[theme].blueHeadText}]`}
          activeOpacity={0.6}
          onPress={() => router.push("/register")}
        >
          <Text
            className={`p-2 text-2xl font-semibold text-[${themes[theme === "dark" ? "light" : "dark"].text}]`}
          >
            {i18n.t("getStarted")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
