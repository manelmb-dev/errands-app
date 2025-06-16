import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, useColorScheme } from "react-native";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";

import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

import { themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";
import { themes } from "../../../constants/themes";

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
    { label: "Claro", value: "light" },
    { label: "Oscuro", value: "dark" },
    { label: "Automático", value: "auto" },
  ];

  const labelShown =
    selectedType === "auto"
      ? "Automático"
      : selectedType === "dark"
        ? "Oscuro"
        : "Claro";

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
          <View className="flex-1 flex-row justify-between py-4">
            <Text className={`text-[${themes[theme].text}] text-lg`}>
              Aspecto
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
            shadowColor: themes[theme].popupShadow,
            shadowOpacity: 0.5,
            shadowRadius: 30,
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
                    ? themes[theme].listsSeparator
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
