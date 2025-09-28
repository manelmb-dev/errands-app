import { View, Text, TouchableHighlight } from "react-native";
import { useRouter } from "expo-router";

import { themeAtom } from "../../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../../../constants/themes";
import i18n from "../../../../constants/i18n";

const ContactSharedTasksMenu = ({ currentContact }) => {
  const router = useRouter();

  const [theme] = useAtom(themeAtom);

  const sharedErrandsMenu = [
    {
      label: i18n.t("pendingTasks"),
      icon: "document-text-outline",
      size: 25,
      route: "/contactSharedPendingTasks",
    },
    {
      label: i18n.t("completedErrands"),
      icon: "checkmark-done-outline",
      size: 25,
      route: "/contactSharedCompletedTasks",
    },
    {
      label: i18n.t("sharedLists"),
      icon: "list-outline",
      size: 25,
      route: "/contactSharedLists",
    },
  ];
  return (
    <View
      className={`bg-[${themes[theme].surfaceBackground}] rounded-xl border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
    >
      {sharedErrandsMenu.map((item, index) => (
        <TouchableHighlight
          key={index}
          className={`${index === 0 && "rounded-t-xl"} ${index === sharedErrandsMenu.length - 1 && "rounded-b-xl"}`}
          onPress={() =>
            router.push({
              pathname: item.route,
              params: { contact: JSON.stringify(currentContact) },
            })
          }
          underlayColor={themes[theme].background}
        >
          <View
            className={`flex-row items-center pl-5 gap-5 ${index === 0 && "rounded-t-xl"} ${index === sharedErrandsMenu.length - 1 && "rounded-b-xl"}`}
          >
            <Ionicons
              name={item.icon}
              size={item.size}
              color={themes[theme].text}
            />
            <View
              className={`flex-1 flex-row justify-between py-4 ${index !== sharedErrandsMenu.length - 1 && `border-b  border-[${themes[theme].borderColor}]`}`}
            >
              <Text className={`text-[${themes[theme].text}] text-lg `}>
                {item.label}
              </Text>
              <View className="flex-row items-center gap-2">
                <Ionicons
                  className="mr-3"
                  name="chevron-forward-outline"
                  size={18}
                  color={themes[theme].taskSecondText}
                />
              </View>
            </View>
          </View>
        </TouchableHighlight>
      ))}
    </View>
  );
};
export default ContactSharedTasksMenu;
