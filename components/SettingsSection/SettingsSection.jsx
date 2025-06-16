import { useNavigation, useRouter } from "expo-router";
import { View, Text, ScrollView, TouchableHighlight } from "react-native";
import { useEffect, useState } from "react";

import { languageAtom, themeAtom, userAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../constants/themes";
import AppearencePopupMenu from "./AppearencePopupMenu/AppearencePopupMenu";
import LanguagePopupMenu from "./LanguagePopupMenu/LanguagePopupMenu";

const userSections = [
  { label: "Perfil", icon: "person-outline", size: 25, route: "/profile" },
  { label: "Contactos", icon: "people-outline", size: 25, route: "/contacts" },
  {
    label: "Notificaciones",
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
  const [language, setLanguage] = useAtom(languageAtom);

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
            Ajustes
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

  const UISections = [
    {
      label: "Idioma",
      icon: "language-outline",
      size: 25,
      option: language,
      route: "/appTheme",
    },
    {
      label: "Aspecto",
      icon: "contrast-outline",
      size: 25,
      option: theme,
      route: "/appTheme",
    },
  ];

  const helpSections = [
    {
      label: "Configuración",
      icon: "settings-outline",
      size: 25,
      route: "/appSettings",
    },
    {
      label: "Cuenta",
      icon: "person-circle-outline",
      size: 25,
      route: "/accountSettings",
    },
    {
      label: "Privacidad",
      icon: "shield-checkmark-outline",
      size: 25,
      route: "/privacySettings",
    },
    {
      label: "Invitar amigos",
      icon: "share-social-outline",
      size: 25,
      route: "/friendInvite",
    },
    {
      label: "Ayuda",
      icon: "help-circle-outline",
      size: 25,
      route: "/profile",
    },
    {
      label: "Sobre la app",
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
