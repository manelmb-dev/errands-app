import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "expo-router";
import deepEqual from "fast-deep-equal";
import {
  View,
  Text,
  Pressable,
  Alert,
  TextInput,
  TouchableHighlight,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import {
  usersSharedWithAtom,
  currentListAtom,
  listsAtom,
  userAtom,
} from "../../constants/storeAtoms";
import { themeAtom } from "../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import UsersOfList from "../../Utils/New&EditListUtils/UsersOfList";
import ColorGrid from "../../Utils/New&EditListUtils/ColorGrid";
import IconGrid from "../../Utils/New&EditListUtils/IconGrid";
import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const EditListModalComp = () => {
  const navigation = useNavigation();
  const shouldPreventClose = useRef(true);

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [, setLists] = useAtom(listsAtom);
  const [currentList, setCurrentList] = useAtom(currentListAtom);
  const [usersSharedWith, setUsersSharedWith] = useAtom(usersSharedWithAtom);

  const listInitialValuesRef = useRef(currentList);

  const [assignedColor, setAssignedColor] = useState(currentList.color);
  const [assignedIcon, setAssignedIcon] = useState(currentList.icon);

  const [showPalleteColor, setShowPalleteColor] = useState(false);
  const [showIconGrid, setShowIconGrid] = useState(false);
  const [showUsersSharedWith, setShowUsersSharedWith] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: { ...currentList },
  });

  const watchedTitle = watch("title");

  useEffect(() => {
    setUsersSharedWith(currentList.usersShared.filter((id) => id !== user.id));
  }, [setUsersSharedWith, currentList.usersShared, user.id]);

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("editList"),
      presentation: "modal",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => (
        <Pressable
          onPress={() => {
            shouldPreventClose.current = false;
            handleCancelAlert(() => navigation.goBack());
          }}
        >
          <Text className={`text-2xl text-[${themes[theme].blueHeadText}]`}>
            {i18n.t("cancel")}
          </Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleSave} disabled={!watchedTitle.trim()}>
          <Text
            className={`text-2xl font-semibold ${watchedTitle.trim() ? `text-[${themes[theme].blueHeadText}]` : `text-[${themes[theme].taskSecondText}]`}`}
          >
            {i18n.t("save")}
          </Text>
        </Pressable>
      ),
    });
  }, [
    navigation,
    theme,
    handleSave,
    watchedTitle,
    handleCancelAlert,
    usersSharedWith,
    currentList,
  ]);

  useEffect(() => {
    setValue("icon", assignedIcon);
    setValue("color", assignedColor);
  }, [assignedColor, assignedIcon, setValue]);

  // Function to handle dismiss modal
  // useEffect(() => {
  //   const dismissModal = navigation.addListener("beforeRemove", (e) => {
  //     if (!shouldPreventClose.current) return;

  //     e.preventDefault();
  //     handleCancelAlert(() => {
  //       shouldPreventClose.current = false;
  //       navigation.goBack();
  //     });
  //   });
  //   return dismissModal;
  // }, [navigation, handleCancelAlert]);

  // Function to handle cancel alert
  const handleCancelAlert = useCallback(
    (onDiscard) => {
      const formValues = watch();
      const hasChanges = !deepEqual(listInitialValuesRef.current, formValues);

      if (hasChanges) {
        Alert.alert(i18n.t("changesInListWillBeDiscarded"), "", [
          {
            text: i18n.t("discard"),
            onPress: onDiscard,
            style: "destructive",
          },
          { text: i18n.t("cancel") },
        ]);
      } else {
        onDiscard();
      }
    },
    [watch]
  );

  // Function to handle changes in list
  const handleSave = handleSubmit((data) => {
    const updatedList = {
      ...data,
      id: currentList.id,
      usersShared: [user.id, ...usersSharedWith],
    };

    setCurrentList(updatedList);

    // Update list locally
    setLists((prevLists) =>
      prevLists.map((l) => (l.id === updatedList.id ? updatedList : l))
    );

    // FIRESTONE UPDATEEE FIXX THIS

    navigation.goBack();
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className={`flex-1 p-6 bg-[${themes[theme].background}] items-center`}
      >
        {/* Icon and color preview */}
        <View
          className={`p-4 justify-center items-center ${theme === "light" ? `bg-${assignedColor}-300` : `bg-${assignedColor}-600`} mb-4 rounded-2xl shadow ${theme === "light" ? "shadow-gray-200" : "shadow-neutral-950"}`}
        >
          <Ionicons
            name={assignedIcon}
            size={58}
            color={`${themes[theme].text}`}
          />
        </View>
        <View
          className={`w-full ${showIconGrid && "flex-1"} bg-[${themes[theme].surfaceBackground}] mb-4 rounded-xl border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
        >
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`p-4 pl-4 text-2xl border-b border-[${themes[theme].borderColor}] align-top leading-tight text-[${themes[theme].text}]`}
                value={value}
                onChangeText={onChange}
                placeholder={i18n.t("listTitle")}
                placeholderTextColor={themes[theme].taskSecondText}
              />
            )}
          />

          {/* Users shared with */}
          <TouchableHighlight
            onPress={() => {
              Keyboard.dismiss();
              setShowUsersSharedWith((prev) => !prev);
              setShowIconGrid(false);
              setShowPalleteColor(false);
            }}
          >
            <View
              className={`flex-row items-center bg-[${themes[theme].surfaceBackground}]`}
            >
              <MaterialCommunityIcons
                className="mx-4 p-1.5 bg-slate-400 rounded-lg"
                name="account-group"
                size={24}
                color={themes["light"].background}
              />
              <View
                className={`py-4 flex-row flex-1 gap-4 items-center justify-between border-b border-[${themes[theme].borderColor}]`}
              >
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  {usersSharedWith.length > 0
                    ? `${i18n.t("sharedWith")}`
                    : `${i18n.t("sharedSingular")}`}
                </Text>
                <View className="mr-4 flex-row gap-3 items-center">
                  <Text
                    className={`text-base text-[${themes[theme].listTitle}]`}
                  >
                    {usersSharedWith.length > 0
                      ? `${usersSharedWith.length}`
                      : `${i18n.t("no")}`}
                  </Text>
                  <Ionicons
                    name={
                      showUsersSharedWith
                        ? "chevron-down-outline"
                        : "chevron-forward-outline"
                    }
                    size={23}
                    color={themes["light"].taskSecondText}
                  />
                </View>
              </View>
            </View>
          </TouchableHighlight>

          {/* Users shown */}
          {showUsersSharedWith && <UsersOfList />}

          {/* Color */}
          <TouchableHighlight
            onPress={() => {
              Keyboard.dismiss();
              setShowPalleteColor((prev) => !prev);
              setShowUsersSharedWith(false);
              setShowIconGrid(false);
            }}
          >
            <View
              className={`flex-row items-center bg-[${themes[theme].surfaceBackground}]`}
            >
              <MaterialIcons
                className="mx-4 p-1.5 bg-slate-400 rounded-lg"
                name="color-lens"
                size={24}
                color={themes["light"].background}
              />
              <View
                className={`py-3 flex-row flex-1 gap-4 items-center justify-between border-b border-[${themes[theme].borderColor}]`}
              >
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  {i18n.t("color")}
                </Text>
                <View className="mr-4 flex-row gap-3 items-center">
                  <View
                    className={`flex-row items-center py-4 px-8 rounded-2xl ${theme === "light" ? `bg-${assignedColor}-300` : `bg-${assignedColor}-600`}`}
                  />
                  <Ionicons
                    name={
                      showPalleteColor
                        ? "chevron-down-outline"
                        : "chevron-forward-outline"
                    }
                    size={23}
                    color={themes["light"].taskSecondText}
                  />
                </View>
              </View>
            </View>
          </TouchableHighlight>

          {/* Color palette */}
          {showPalleteColor && (
            <ColorGrid
              assignedColor={assignedColor}
              setAssignedColor={setAssignedColor}
            />
          )}

          {/* Icon */}
          <TouchableHighlight
            className={`${showIconGrid ? "" : "rounded-b-xl"}`}
            onPress={() => {
              Keyboard.dismiss();
              setShowIconGrid((prev) => !prev);
              setShowUsersSharedWith(false);
              setShowPalleteColor(false);
            }}
          >
            <View
              className={`flex-row items-center bg-[${themes[theme].surfaceBackground}] ${showIconGrid ? "" : "rounded-b-xl"}`}
            >
              <Ionicons
                className="mx-4 p-1.5 bg-slate-400 rounded-lg"
                name="apps-outline"
                size={24}
                color={themes["light"].background}
              />
              <View
                className={`py-3 flex-row flex-1 gap-4 items-center justify-between`}
              >
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  {i18n.t("icon")}
                </Text>
                <View className="flex-row gap-3 items-center mr-4">
                  <Ionicons
                    name={assignedIcon}
                    size={28}
                    color={`${themes[theme].text}`}
                  />
                  <Ionicons
                    name={
                      showIconGrid
                        ? "chevron-down-outline"
                        : "chevron-forward-outline"
                    }
                    size={23}
                    color={themes["light"].taskSecondText}
                  />
                </View>
              </View>
            </View>
          </TouchableHighlight>

          {/* Icon Grid */}
          {showIconGrid && (
            <IconGrid
              assignedColor={assignedColor}
              assignedIcon={assignedIcon}
              setAssignedIcon={setAssignedIcon}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default EditListModalComp;
