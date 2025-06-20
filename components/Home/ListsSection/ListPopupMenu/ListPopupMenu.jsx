import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import React from "react";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useAtom } from "jotai";
import { themeAtom } from "../../../../constants/storeAtoms";

import { themes } from "../../../../constants/themes";
import i18n from "../../../../constants/i18n";

export default function ListPopupMenu() {
  const [theme] = useAtom(themeAtom);

  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
        }}
      >
        <MaterialIcons
          className="mr-3"
          name="dashboard-customize"
          size={22}
          color={themes[theme].text}
        />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginLeft: 6,
            marginTop: 26,
            backgroundColor: themes[theme].buttonMenuBackground,
            borderRadius: 10,
            elevation: 12,
            shadowColor: "#000",
            shadowOpacity: 0.6,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 40,
          },
        }}
      >
        <MenuOption
          onSelect={() => router.push("/Modals/newListModal")}
          text={i18n.t("addList")}
          customStyles={{
            optionTouchable: {
              activeOpacity: 70,
              style: {
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                overflow: "hidden",
              },
            },
            optionWrapper: {
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomColor: themes[theme].listsSeparator,
              borderBottomWidth: 1,
            },
            optionText: {
              fontSize: 16,
              color: themes[theme].text,
            },
          }}
        />
        <MenuOption
          onSelect={() => router.push("/viewAllLists")}
          text={i18n.t("editLists")}
          customStyles={{
            optionTouchable: {
              activeOpacity: 70,
              style: {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                overflow: "hidden",
              },
            },
            optionWrapper: {
              paddingVertical: 12,
              paddingHorizontal: 16,
            },
            optionText: {
              fontSize: 16,
              color: themes[theme].text,
            },
          }}
        />
      </MenuOptions>
    </Menu>
  );
}
