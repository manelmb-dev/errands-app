import { View, Text, Pressable, TouchableHighlight } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAtom } from "jotai";
import {
  errandsAtom,
  themeAtom,
  userAtom,
} from "../../../constants/storeAtoms";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

function MainCardsSection() {
  const router = useRouter();
  const todayDate = new Date().toISOString().split("T")[0];

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [errands] = useAtom(errandsAtom);

  const [errandsNotCompleted, setErrandsNotCompleted] = useState(0);
  const [errandsToday, setErrandsToday] = useState(0);
  const [errandsMarked, setErrandsMarked] = useState(0);

  useEffect(() => {
    const notCompleted = errands
      .filter((errand) => !errand.deleted)
      .filter((errand) => !errand.completed);

    const today = errands
      .filter((errand) => !errand.deleted)
      .filter((errand) => {
        if (errand.dateErrand === "") return false;
        const errandDate = new Date(errand.dateErrand)
          .toISOString()
          .split("T")[0];
        return errandDate <= todayDate && !errand.completed;
      });

    const marked = errands
      .filter((errand) => !errand.deleted)
      .filter((errand) => errand.marked && !errand.completed);

    setErrandsNotCompleted(notCompleted.length);
    setErrandsToday(today.length);
    setErrandsMarked(marked.length);
  }, [errands, user, todayDate]);

  const cards = [
    {
      label: i18n.t("allSingular"),
      icon: { name: "file-tray-full-outline", lib: Ionicons, size: 33 },
      count: errandsNotCompleted,
      route: "/allTasks",
    },
    {
      label: i18n.t("today"),
      icon: { name: "today-outline", lib: Ionicons, size: 32 },
      count: errandsToday,
      route: "/todayTasks",
    },
    {
      label: i18n.t("marked"),
      icon: { name: "flag-outline", lib: Ionicons, size: 30 },
      count: errandsMarked,
      route: "/markedTasks",
    },
    {
      label: i18n.t("calendar"),
      icon: { name: "calendar-outline", lib: Ionicons, size: 33 },
      count: null,
      route: "/calendarTasks",
    },
    // {
    //   label: i18n.t("completed"),
    //   icon: { name: "check-circle-fill", lib: Octicons, size: 30 },
    //   count: null,
    //   route: "/completedTasks",
    // },
  ];

  return (
    <Pressable className="flex-row flex-wrap pb-0.5 justify-between">
      {cards.map((card, index) => {
        const Icon = card.icon.lib;
        return (
          <TouchableHighlight
            key={card.label}
            className={`my-1.5 rounded-2xl w-[47.5%] h-[82px]`}
            onPress={() => router.push(card.route)}
          >
            <View
              className={`flex-row justify-between bg-[${themes[theme].surfaceBackground}] p-3 rounded-2xl w-full h-full  border border-[${themes[theme].borderColor}] shadow-sm ${
                theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"
              }`}
            >
              <View className="ml-1 flex-column justify-between">
                <Icon
                  name={card.icon.name}
                  size={card.icon.size}
                  color={themes[theme].iconColor}
                />
                <Text
                  className={`text-base font-semibold text-[${themes[theme].listTitle}]`}
                >
                  {card.label}
                </Text>
              </View>
              {card.count !== null && (
                <View className="pr-2">
                  <Text
                    className={`text-2xl font-medium text-[${themes[theme].text}]`}
                  >
                    {card.count}
                  </Text>
                </View>
              )}
            </View>
          </TouchableHighlight>
        );
      })}
    </Pressable>
  );
}

export default MainCardsSection;
