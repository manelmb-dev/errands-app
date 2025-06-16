import { Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

import { themeAtom, userAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import MainCardsSection from "./MainCardsSection/MainCardsSection";
import SharedSection from "./SharedSection/SharedSection";
import ListSection from "./ListsSection/ListSection";
import { themes } from "../../constants/themes";
import MainPopupPage from "./MainPopupPage/MainPopupPage";
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
      headerShown: true,
      title: "",
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => (
        <View className="flex-1">
          <Text
            className={`text-base font-medium text-[${themes[theme].text}]`}
          >
            {todayFormatted}
          </Text>
          <Text className={`text-3xl font-medium text-[${themes[theme].text}]`}>
            {`${i18n.locale === "es" ? "¡" : ""}${greeting()}, ${user.name}!`}
          </Text>
        </View>
      ),
      headerRight: () => <MainPopupPage />,
    });
  }, [navigation, theme, user.name, todayFormatted]);

  return (
    <View
      className={`flex-1 pt-4 bg-[${themes[theme].background}] items-center`}
    >
      <View className="flex-1 px-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Pressable className="flex-row pb-3 flex-wrap justify-between">
            {/* Cards section */}
            <MainCardsSection />

            {/* <Shared section */}
            <SharedSection />

            {/* Lists section */}
            <ListSection />
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

export default Home;
