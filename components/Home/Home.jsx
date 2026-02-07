import { Pressable, ScrollView, Text, View, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

import { themeAtom, userAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import SharedListSection from "./SharedListsSection/SharedListsSection";
import MainCardsSection from "./MainCardsSection/MainCardsSection";
import SharedSection from "./SharedSection/SharedSection";
import ListSection from "./ListsSection/ListSection";
import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

function Home() {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);

  const todayFormatted = new Date().toLocaleDateString(i18n.locale, {
    weekday: "short",
    day: "numeric",
    month: "long",
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return i18n.t("goodNight");
    if (hour >= 5 && hour < 12) return i18n.t("goodMorning");
    if (hour >= 12 && hour < 20) return i18n.t("goodAfternoon");
    return i18n.t("goodEvening");
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: "",
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
    <View
      className={`w-full px-4 flex-1 bg-[${themes[theme].background}] items-center`}
    >
      <LinearGradient
        colors={
          theme === "light"
            ? [
                "rgba(245,245,245,1)",
                "rgba(245,245,245,1)",
                "rgba(245,245,245,1)",
                "rgba(245,245,245,0.9)",
                "rgba(245,245,245,0)",
              ]
            : [
                "rgba(18,18,18,1)",
                "rgba(18,18,18,1)",
                "rgba(18,18,18,1)",
                "rgba(18,18,18,0.9)",
                "rgba(18,18,18,0)",
              ]
        }
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: Platform.OS === "ios" ? 60 : 70,
          zIndex: 20,
        }}
        pointerEvents="none"
      />
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="w-full pt-14 pb-3">
            <Text
              className={`text-base font-medium text-[${themes[theme].text}]`}
            >
              {todayFormatted}
            </Text>
            <Text
              className={`text-3xl font-medium text-[${themes[theme].text}]`}
            >
              {`${i18n.locale === "es" ? "¡" : ""}${greeting()}, ${user.name}!`}
            </Text>
          </View>
          <Pressable className="flex-row pb-5 flex-wrap justify-between">
            {/* Cards section */}
            <MainCardsSection />

            {/* Shared section */}
            <SharedSection />

            {/* Lists section */}
            <ListSection />

            {/* Shared Lists section */}
            <SharedListSection />
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

export default Home;
