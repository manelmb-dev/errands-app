import { Platform, Alert, TouchableOpacity } from "react-native";
import ContextMenuView from "react-native-context-menu-view";
import React from "react";
import { router } from "expo-router";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAtom } from "jotai";
import { themeAtom } from "../../../../constants/storeAtoms";

import { themes } from "../../../../constants/themes";
import i18n from "../../../../constants/i18n";

export default function ListPopupMenu() {
  const [theme] = useAtom(themeAtom);
  // const handleSelect = (key) => {
  //   if (key === "new") {
  //     router.push("/Modals/newListModal");
  //   } else if (key === "edit") {
  //     Alert.alert("Editar listas");
  //   }
  // };

  // if (Platform.OS === "ios") {
  //   return (
  //     <ContextMenuView
  //       style={{ padding: 4 }}
  //       menuConfig={{
  //         menuTitle: "Menú",
  //         menuItems: [
  //           { actionKey: "new", actionTitle: "Añadir lista" },
  //           { actionKey: "edit", actionTitle: "Editar listas" },
  //         ],
  //       }}
  //       onPressMenuItem={({ nativeEvent }) =>
  //         handleSelect(nativeEvent.actionKey)
  //       }
  //     >
  //       <Ionicons name="options" size={24} color={themes[theme].text} />
  //     </ContextMenuView>
  //   );
  // }

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
          onSelect={() => Alert.alert(i18n.t("editLists"))}
          // FIX Thissssss
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
