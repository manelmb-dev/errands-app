import React from "react";
import { Platform, Alert, TouchableOpacity, View, Text } from "react-native";
import ContextMenuView from "react-native-context-menu-view";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";

import {
  errandsAtom,
  listsAtom,
  themeAtom,
  userAtom,
} from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";
import { useRouter } from "expo-router";

export default function ListPopup({ list, showCompleted, setShowCompleted }) {
  const router = useRouter();

  const [user] = useAtom(userAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [lists, setLists] = useAtom(listsAtom);
  const [theme] = useAtom(themeAtom);

  const deleteErrandsFromList = (listId) => {
    // Delete all the errands from this list locally
    const updatedErrands = errands.filter((errand) => errand.listId !== listId);
    setErrands(updatedErrands);

    // FIRESTONE UPDATEEE FIXX this
  };

  const listErrandsCount = (listId) => {
    return errands
      .filter((errand) => errand.listId === listId)
      .filter((errand) => !errand.completed)
      .filter((errand) => !errand.deleted).length;
  };

  const deleteList = (listId) => {
    // Delete all the errands from this list
    deleteErrandsFromList(listId);

    // Remove list locally
    const updatedLists = lists.filter((list) => list.id !== listId);
    setLists(updatedLists);

    // if list is shared sent notification to the shared users

    // FIRESTONE UPDATEEE FIXX THIS

    router.push(`/`);
  };

  const confirmDeleteList = (listId) => {
    Alert.alert(
      `${i18n.t("deleteList?")}`,
      `${listErrandsCount(listId) === 0 ? `${i18n.t("areYouSureDeleteList")}` : `${i18n.t("thisListContains")} ${listErrandsCount(listId)} ${listErrandsCount(listId) > 1 ? `${i18n.t("errands").toLowerCase()}` : `${i18n.t("errand").toLowerCase()}`}. ${i18n.t("deleteListTextAlert")}`} `,
      [
        {
          text: i18n.t("delete"),
          onPress: () => deleteList(listId),
          style: "destructive",
        },
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
      ]
    );
  };

  const leaveList = (listId) => {
    // Assign errands that are assigned to the user to another user of the usersShared list

    // Remove user from shared users list locally
    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            usersShared: list.usersShared.filter(
              (userId) => userId !== user.id
            ),
          }
        : list
    );
    setLists(updatedLists);

    // sent notification to the rest of the shared users

    // FIRESTONE UPDATEEE FIXX THIS

    router.push(`/`);
  };

  const confirmLeaveList = (listId) => {
    Alert.alert(`${i18n.t("leaveList?")}`, `${i18n.t("textAlertLeaveList")}`, [
      {
        text: i18n.t("leaveList"),
        onPress: () => leaveList(listId),
        style: "destructive",
      },
      {
        text: i18n.t("cancel"),
        style: "cancel",
      },
    ]);
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
            marginTop: 8, // Not working?
          },
          optionsContainer: {
            backgroundColor: themes[theme].buttonMenuBackground,
            borderRadius: 10,
            elevation: 6, // shadow Android
            shadowColor: "#000",
            shadowOpacity: 0.6,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 40,
          },
          optionWrapper: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomColor: "#e0e0e0",
            borderBottomWidth: 1,
          },
          optionText: {
            fontSize: 16,
            color: themes[theme].text,
          },
        }}
      >
        {list.ownerId === user.id && (
          <MenuOption
            onSelect={() =>
              router.push({
                pathname: "/Modals/editListModal",
                params: { list: JSON.stringify(list) },
              })
            }
          >
            <View className="flex-row justify-between items-center">
              <Text className={`text-lg text-[${themes[theme].text}]`}>
                {i18n.t("editList")}
              </Text>
              <Ionicons
                name="create-outline"
                size={20}
                color={themes[theme].text}
              />
            </View>
          </MenuOption>
        )}
        <MenuOption onSelect={() => setShowCompleted(!showCompleted)}>
          <View className="flex-row justify-between items-center">
            <Text className={`text-lg text-[${themes[theme].text}]`}>
              {showCompleted
                ? i18n.t("hideCompleted")
                : i18n.t("showCompleted")}
            </Text>
            <Ionicons
              name={showCompleted ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={themes[theme].text}
            />
          </View>
        </MenuOption>
        {list.ownerId === user.id ? (
          <MenuOption onSelect={() => confirmDeleteList(list.id)}>
            <View className="flex-row justify-between items-center">
              <Text className={`text-lg text-red-500`}>
                {i18n.t("deleteList")}
              </Text>
              <Ionicons name="trash-outline" size={20} color="red" />
            </View>
          </MenuOption>
        ) : (
          <MenuOption onSelect={() => confirmLeaveList(list.id)}>
            <View className="flex-row justify-between items-center">
              <Text className={`text-lg text-red-500`}>
                {i18n.t("leaveList")}
              </Text>
              <Ionicons name="exit-outline" size={20} color="red" />
            </View>
          </MenuOption>
        )}
      </MenuOptions>
    </Menu>
  );
}
