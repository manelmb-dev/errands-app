import { useNavigation, useRouter } from "expo-router";
import { View, Text, ScrollView, TouchableHighlight } from "react-native";
import { useEffect, useState } from "react";

import { languageAtom, themeAtom, userAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../constants/themes";
import AppearencePopupMenu from "./AppearencePopupMenu/AppearencePopupMenu";
import LanguagePopupMenu from "./LanguagePopupMenu/LanguagePopupMenu";
import i18n from "../../constants/i18n";

const userSections = [
  {
    label: i18n.t("profile"),
    icon: "person-outline",
    size: 25,
    route: "/profile",
  },
  {
    label: i18n.t("contacts"),
    icon: "people-outline",
    size: 25,
    route: "/contacts",
  },
  {
    label: i18n.t("notifications"),
    icon: "notifications-outline",
    size: 25,
    route: "/notificationsSettings",
  },
];

function SettingsSection() {
  const navigation = useNavigation();
  const router = useRouter();

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [language] = useAtom(languageAtom);

  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "",
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: true,
      headerLeft: () => (
        <View className="flex-1">
          <Text
            className={`text-3xl font-semibold text-[${themes[theme].text}]`}
          >
            {i18n.t("settings")}
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
  }, [navigation, theme]);

  const helpSections = [
    {
      label: i18n.t("config"),
      icon: "settings-outline",
      size: 25,
      route: "/appSettings",
    },
    {
      label: i18n.t("account"),
      icon: "person-circle-outline",
      size: 25,
      route: "/accountSettings",
    },
    {
      label: i18n.t("privacy"),
      icon: "shield-checkmark-outline",
      size: 25,
      route: "/privacySettings",
    },
    {
      label: i18n.t("inviteFriends"),
      icon: "share-social-outline",
      size: 25,
      route: "/friendInvite",
    },
    {
      label: i18n.t("help"),
      icon: "help-circle-outline",
      size: 25,
      route: "/profile",
    },
    {
      label: i18n.t("about"),
      icon: "information-circle-outline",
      size: 25,
      route: "/appInfo",
    },
  ];

  return (
    <ScrollView className={`w-full px-6 bg-[${themes[theme].background}]`}>
      <View className="gap-6 pt-5 pb-3">
        {/* Profile section */}
        <View
          className={`bg-[${themes[theme].buttonMenuBackground}] rounded-xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
        >
          <TouchableHighlight
            className="rounded-xl"
            underlayColor={themes[theme].background}
            onPress={() => router.push("/Settings/profileSettings")}
          >
            <View className="flex-row flex-1 p-4 items-center gap-4">
              <Ionicons
                name="person-circle-outline"
                size={70}
                color={themes[theme].text}
              />
              <View className="justify-center">
                <Text
                  className={`text-2xl font-semibold text-[${themes[theme].text}]`}
                >{`${user.name} ${user.surname}`}</Text>
                <Text
                  className={`text-lg  text-[${themes[theme].taskSecondText}]`}
                >
                  @{user.username}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>

        {/* User sections */}
        <View
          className={`bg-[${themes[theme].buttonMenuBackground}] rounded-xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
        >
          {userSections.map((item, index) => (
            <TouchableHighlight
              key={index}
              className={`${index === 0 && "rounded-t-xl"} ${index === userSections.length - 1 && "rounded-b-xl"}`}
              onPress={() => console.log(`Pressed ${item.label}`)}
              underlayColor={themes[theme].background}
            >
              <View
                className={`flex-row items-center pl-5 gap-5 ${index === 0 && "rounded-t-xl"} ${index === userSections.length - 1 && "rounded-b-xl"}`}
              >
                <Ionicons
                  name={item.icon}
                  size={item.size}
                  color={themes[theme].text}
                />
                <View
                  className={`flex-1 flex-row justify-between py-4 ${index !== userSections.length - 1 && `border-b  border-[${themes[theme].listsSeparator}]`}`}
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

        {/* UI sections */}
        <View
          className={`bg-[${themes[theme].buttonMenuBackground}] rounded-xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
        >
          <AppearencePopupMenu />
          <LanguagePopupMenu />
        </View>

        {/* Help sections */}
        <View
          className={`bg-[${themes[theme].buttonMenuBackground}] rounded-xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
        >
          {helpSections.map((item, index) => (
            <TouchableHighlight
              key={index}
              className={`${index === 0 && "rounded-t-xl"} ${index === helpSections.length - 1 && "rounded-b-xl"}`}
              onPress={() => console.log(`Pressed ${item.label}`)}
              underlayColor={themes[theme].background}
            >
              <View
                className={`flex-row items-center pl-5 gap-5 ${index === 0 && "rounded-t-xl"} ${index === helpSections.length - 1 && "rounded-b-xl"}`}
              >
                <Ionicons
                  name={item.icon}
                  size={item.size}
                  color={themes[theme].text}
                />
                <View
                  className={`flex-1 py-4 ${index !== helpSections.length - 1 && `border-b border-[${themes[theme].listsSeparator}]`}`}
                >
                  <Text className={`text-[${themes[theme].text}] text-lg `}>
                    {item.label}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export default SettingsSection;
