import { Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";

import { themeAtom, userAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import SettingsMainModal from "./SettingsMainModal/SettingsMainModal";
import MainCardsSection from "./MainCardsSection/MainCardsSection";
import SharedSection from "./SharedSection/SharedSection";
import ListSection from "./ListsSection/ListSection";
import { themes } from "../../constants/themes";

function Home() {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [theme, setTheme] = useAtom(themeAtom);

  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);

  const todayFormatted = new Date().toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Buenos días";
    if (hour >= 12 && hour < 20) return "Buenas tardes";
    return "Buenas noches";
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
            ¡{greeting()}, {user.name}!
          </Text>
        </View>
      ),
      headerRight: () => (
        <Ionicons
          name="options"
          color={themes[theme].blueHeadText}
          size={24}
          onPress={() => setModalSettingsVisible(true)}
        />
      ),
    });
  }, [navigation, theme, user.name, todayFormatted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <View
      className={`flex-1 pt-4 bg-[${themes[theme].background}] items-center`}
    >
      {/* Modal */}
      <SettingsMainModal
        modalSettingsVisible={modalSettingsVisible}
        setModalSettingsVisible={setModalSettingsVisible}
        toggleTheme={toggleTheme}
      />

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
