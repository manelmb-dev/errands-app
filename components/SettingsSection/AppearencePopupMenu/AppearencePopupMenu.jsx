import { View, TouchableOpacity, Text, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";

import { Ionicons, Feather } from "@expo/vector-icons";

import { themeAtom } from "../../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

export default function AppearencePopupMenu() {
  const systemTheme = useColorScheme() ?? "light";
  const [theme, setTheme] = useAtom(themeAtom);
  const [selectedType, setSelectedType] = useState("light");

  useEffect(() => {
    const loadThemePreference = async () => {
      const storedThemePreference =
        await AsyncStorage.getItem("themePreference");
      setSelectedType(storedThemePreference || "light");

      if (storedThemePreference === "auto") {
        setTheme(systemTheme);
      } else {
        setTheme(storedThemePreference || "light");
      }
    };
    loadThemePreference();
  }, [systemTheme, setTheme]);

  const handleNewTheme = async (newType) => {
    await AsyncStorage.setItem("themePreference", newType);
    setSelectedType(newType);

    if (newType === "auto") {
      setTheme(systemTheme);
    } else {
      setTheme(newType);
    }
  };

  const options = [
    { label: i18n.t("light"), value: "light" },
    { label: i18n.t("dark"), value: "dark" },
    { label: i18n.t("auto"), value: "auto" },
  ];

  // Label in trigger
  const labelShown =
    selectedType === "auto"
      ? i18n.t("auto")
      : selectedType === "dark"
        ? i18n.t("dark")
        : i18n.t("light");

  return (
    <Menu>
      <MenuTrigger
        customStyles={{ TriggerTouchableComponent: TouchableOpacity }}
      >
        <View className="flex-row items-center pl-5 gap-5 rounded-b-xl">
          <Ionicons
            name="contrast-outline"
            size={25}
            color={themes[theme].text}
          />
          <View
            className={`py-4 flex-1 flex-row justify-between border-b border-[${themes[theme].borderColor}]`}
          >
            <Text className={`text-[${themes[theme].text}] text-lg`}>
              {i18n.t("appearance")}
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
            backgroundColor: themes[theme].surfaceBackground,
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
            onSelect={() => handleNewTheme(value)}
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
                    ? themes[theme].borderColor
                    : "transparent",
                borderBottomWidth: 1,
                flexDirection: "row",
                alignItems: "center",
              },
            }}
          >
            <View
              className={`flex-row items-center ${selectedType !== value ? "pl-5" : ""}`}
            >
              {selectedType === value && (
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
