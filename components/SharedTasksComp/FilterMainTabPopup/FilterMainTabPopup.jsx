import { View, TouchableOpacity, Text } from "react-native";
import React from "react";
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

export default function FilterMainTabPopup({ mainTab, setMainTab }) {
  const [theme] = useAtom(themeAtom);

  const tabOptions = [
    { label: i18n.t("all"), value: "all" },
    { label: i18n.t("outgoing"), value: "outgoing" },
    { label: i18n.t("incoming"), value: "incoming" },
  ];

  return (
    <Menu>
      <MenuTrigger
        customStyles={{ TriggerTouchableComponent: TouchableOpacity }}
      >
        <View
          className={`flex-row items-center justify-center px-4 py-3 rounded-full gap-2 ${theme === "light" ? "bg-gray-300" : "bg-gray-700"} min-w-[80px] shadow-sm ${theme === "light" ? "shadow-gray-200" : "shadow-neutral-950"}`}
        >
          <Ionicons name="chevron-down" size={14} color={themes[theme].text} />
          <Text className={`text-[${themes[theme].text}] font-semibold`}>
            {tabOptions.find((t) => t.value === mainTab)?.label}
          </Text>
        </View>
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginTop: 44,
            backgroundColor: themes[theme].surfaceBackground,
            borderRadius: 10,
            elevation: 12,
            shadowColor: "#000",
            shadowOpacity: 0.5,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 40,
          },
        }}
      >
        {tabOptions.map(({ label, value }, index) => (
          <MenuOption
            key={value}
            onSelect={() => setMainTab(value)}
            customStyles={{
              optionTouchable: {
                activeOpacity: 70,
                style: {
                  ...(index === 0 && {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }),
                  ...(index === tabOptions.length - 1 && {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }),
                  overflow: "hidden",
                },
              },
              optionWrapper: {
                paddingVertical: 10,
                paddingHorizontal: 13,
                borderBottomColor:
                  index !== tabOptions.length - 1
                    ? themes[theme].borderColor
                    : "transparent",
                borderBottomWidth: 1,
                flexDirection: "row",
                alignItems: "center",
              },
            }}
          >
            <View
              className={`flex-row items-center ${
                mainTab !== value ? "pl-5" : ""
              }`}
            >
              {mainTab === value && (
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
