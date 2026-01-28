import { Alert, TouchableOpacity, View, Text } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";
import React from "react";

import {
  currentListAtom,
  errandsAtom,
  listsAtom,
  themeAtom,
  userAtom,
} from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

export default function ListPopup({ showCompleted, setShowCompleted }) {
  const router = useRouter();
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [currentList] = useAtom(currentListAtom);
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

    navigation.goBack();
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
      ],
    );
  };

  const leaveList = (listId) => {
    // Assign errands that are assigned to the user to another user of the usersShared list (owner of the errand)

    // Remove user from shared users list locally
    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
          ...list,
          usersShared: list.usersShared.filter(
            (userId) => userId !== user.id,
          ),
        }
        : list,
    );
    setLists(updatedLists);

    // sent notification to the rest of the shared users

    // FIRESTONE UPDATEEE FIXX THIS

    navigation.goBack();
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
            marginTop: 8, // Not working?
          },
          optionsContainer: {
            backgroundColor: themes[theme].surfaceBackground,
            borderRadius: 10,
            elevation: 6, // shadow Android
            shadowColor: "#000",
            shadowOpacity: 0.6,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 40,
            minWidth: 220,
          },
          optionWrapper: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomColor: themes[theme].borderColor,
            borderBottomWidth: 1,
          },
          optionText: {
            fontSize: 16,
            color: themes[theme].text,
          },
        }}
      >
        {currentList.ownerId === user.id && (
          <MenuOption
            onSelect={() => {
              router.push("/Modals/editListModal");
            }}
            customStyles={{
              optionTouchable: {
                activeOpacity: 70,
                style: {
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  overflow: "hidden",
                },
              },
            }}
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
        <MenuOption
          onSelect={() => setShowCompleted(!showCompleted)}
          customStyles={{
            optionTouchable: currentList.ownerId !== user.id && {
              activeOpacity: 70,
              style: {
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                overflow: "hidden",
              },
            },
          }}
        >
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
        <MenuOption
          onSelect={() =>
            currentList.ownerId === user.id
              ? confirmDeleteList(currentList.id)
              : confirmLeaveList(currentList.id)
          }
          customStyles={{
            optionWrapper: {
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 0,
            },
            optionTouchable: {
              activeOpacity: 70,
              style: {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                overflow: "hidden",
              },
            },
          }}
        >
          <View className="flex-row justify-between items-center">
            <Text className={`text-lg text-red-500`}>
              {currentList.ownerId === user.id
                ? i18n.t("deleteList")
                : i18n.t("leaveList")}
            </Text>
            <Ionicons
              name={
                currentList.ownerId === user.id
                  ? "trash-outline"
                  : "exit-outline"
              }
              size={20}
              color="red"
            />
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}
