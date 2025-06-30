import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";

import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import { languageAtom, themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";
import I18n from "../../../constants/i18n";
import i18n from "../../../constants/i18n";

export default function LanguagePopupMenu() {
  const [, setLanguage] = useAtom(languageAtom);
  const [theme] = useAtom(themeAtom);

  const [selectedLanguage, setSelectedLanguage] = useState("es");

  useEffect(() => {
    const loadLanguagePreference = async () => {
      const storedLanguagePreference =
        await AsyncStorage.getItem("languagePreference");
      setSelectedLanguage(storedLanguagePreference || "es");
      setLanguage(storedLanguagePreference || "es");
      I18n.locale = storedLanguagePreference || "es";
    };
    loadLanguagePreference();
  }, [setLanguage]);

  const handleNewLanguage = async (lang) => {
    await AsyncStorage.setItem("languagePreference", lang);
    setSelectedLanguage(lang);
    setLanguage(lang);

    I18n.locale = lang;
  };

  const options = [
    { label: i18n.t("spanish"), value: "es" },
    { label: i18n.t("english"), value: "en" },
    { label: i18n.t("catalan"), value: "ca" },
  ];

  // Label in trigger
  const labelShown =
    selectedLanguage === "en"
      ? i18n.t("english")
      : selectedLanguage === "ca"
        ? i18n.t("catalan")
        : i18n.t("spanish");

  return (
    <Menu>
      <MenuTrigger
        customStyles={{ TriggerTouchableComponent: TouchableOpacity }}
      >
        <View className="flex-row items-center pl-5 gap-5 rounded-b-xl">
          <Ionicons
            name="language-outline"
            size={25}
            color={themes[theme].text}
          />
          <View className={`flex-1 flex-row justify-between py-4`}>
            <Text className={`text-[${themes[theme].text}] text-lg`}>
              {i18n.t("language")}
            </Text>
            <View className="flex-row items-center gap-2 mr-4">
              <Text
                className={`text-lg text-[${themes[theme].taskSecondText}]`}
              >
                {labelShown}
              </Text>
              <Ionicons
                name="chevron-expand-outline"
                size={18}
                color={themes[theme].taskSecondText}
              />
            </View>
          </View>
        </View>
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginLeft: 146,
            marginTop: 54,
            backgroundColor: themes[theme].buttonMenuBackground,
            borderRadius: 10,
            elevation: 12,
            shadowColor: "#000",
            shadowOpacity: 0.4,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 40,
          },
        }}
      >
        {options.map(({ label, value }, index) => (
          <MenuOption
            key={index}
            onSelect={() => handleNewLanguage(value)}
            customStyles={{
              optionTouchable: {
                activeOpacity: 70,
                style: {
                  ...(index === 0 && {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }),
                  ...(index === options.length - 1 && {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }),
                  overflow: "hidden",
                },
              },
              optionWrapper: {
                paddingVertical: 12,
                paddingHorizontal: 13,
                borderBottomColor:
                  index !== options.length - 1
                    ? themes[theme].listsSeparator
                    : "transparent",
                borderBottomWidth: 1,
                flexDirection: "row",
                alignItems: "center",
              },
            }}
          >
            <View
              className={`flex-row items-center ${
                selectedLanguage !== value ? "pl-5" : ""
              }`}
            >
              {selectedLanguage === value && (
                <Feather name="check" size={17} color={themes[theme].text} />
              )}
              <Text className={`ml-2 text-[${themes[theme].text}] text-lg`}>
                {label}
              </Text>
            </View>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
}
