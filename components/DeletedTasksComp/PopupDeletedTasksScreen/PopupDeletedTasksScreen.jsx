import React from "react";
import { Alert, TouchableOpacity, View, Text } from "react-native";

import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";

import Ionicons from "react-native-vector-icons/Ionicons";

import {
  errandsAtom,
  languageAtom,
  themeAtom,
} from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

export default function PopupDeletedTasksScreen() {
  const [theme] = useAtom(themeAtom);
  const [language] = useAtom(languageAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const totalErrandsDeleted = errands.filter((errand) => errand.deleted).length;

  const deleteAllDeletedErrands = () => {
    //delete deleted errands locally
    setErrands((prev) => prev.filter((e) => !e.deleted));

    // TODO: FIRESTORE UPDATEEE
    // await delete elements from firestore
  };

  const confirmDeleteAllDeletedErrands = () => {
    if (totalErrandsDeleted === 0) {
      Alert.alert(i18n.t("noDeletedErrands"));
    } else {
      Alert.alert(
        `${language === "es" && "¿"}${i18n.t("deleteAllSingular")}?`,
        `${i18n.t("delete")} ${totalErrandsDeleted} ${totalErrandsDeleted > 1 ? `${i18n.t("errands").toLowerCase()}` : `${i18n.t("errand").toLowerCase()}`}. ${i18n.t("actionCannotBeUndone")}`,
        [
          {
            text: i18n.t("delete"),
            onPress: deleteAllDeletedErrands,
            style: "destructive",
          },
          { text: i18n.t("cancel"), style: "cancel" },
        ]
      );
    }
  };

  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
        }}
      >
        <Ionicons name="options" size={24} color={themes[theme].blueHeadText} />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          anchorStyle: {
            marginTop: -4,
          },
          optionsContainer: {
            backgroundColor: themes[theme].buttonMenuBackground,
            borderRadius: 10,
            elevation: 6,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 6,
          },
          optionWrapper: {
            paddingVertical: 12,
            paddingHorizontal: 12,
          },
        }}
      >
        <MenuOption onSelect={confirmDeleteAllDeletedErrands}>
          <View className="flex-row justify-between items-center">
            <Text
              className={`text-xl ${totalErrandsDeleted > 0 ? "text-red-500" : `text-[${themes[theme].taskSecondText}]`} text-[${themes[theme].text}]`}
            >
              {i18n.t("deleteAll")}
            </Text>
            <Ionicons
              name="trash-outline"
              size={19}
              color={totalErrandsDeleted > 0 ? "red" : "gray"}
            />
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}
