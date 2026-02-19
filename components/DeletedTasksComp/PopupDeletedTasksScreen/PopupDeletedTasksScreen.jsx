import { Alert, TouchableOpacity, View, Text } from "react-native";
import React from "react";

import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";

import { Ionicons } from "@expo/vector-icons";

import { errandsAtom, userAtom } from "../../../constants/storeAtoms";
import { languageAtom, themeAtom } from "../../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

export default function PopupDeletedTasksScreen() {
  const [theme] = useAtom(themeAtom);
  const [user] = useAtom(userAtom);
  const [language] = useAtom(languageAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const totalErrandsDeleted = errands.filter(
    (errand) => errand.deleted && errand.ownerUid === user.uid,
  ).length;

  const deleteAllDeletedErrands = () => {
    //delete deleted errands locally
    setErrands((prev) =>
      prev.filter((e) => !e.deleted && e.ownerUid === user.uid),
    );

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
        ],
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
        <Ionicons
          className="pl-1.5"
          name="options"
          size={26}
          color={themes[theme].text}
        />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          anchorStyle: {
            marginTop: -4,
          },
          optionsContainer: {
            backgroundColor: themes[theme].surfaceBackground,
            borderRadius: 10,
            elevation: 12,
            shadowColor: "#000",
            shadowOpacity: 0.6,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 40,
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
