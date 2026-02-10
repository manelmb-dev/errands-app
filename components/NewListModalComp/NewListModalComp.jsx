import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableHighlight,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import {
  listsAtom,
  themeAtom,
  userAtom,
  usersSharedWithAtom,
} from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import UsersOfList from "../../Utils/New&EditListUtils/UsersOfList";
import ColorGrid from "../../Utils/New&EditListUtils/ColorGrid";
import IconGrid from "../../Utils/New&EditListUtils/IconGrid";
import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const NewListModal = () => {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [, setLists] = useAtom(listsAtom);
  const [usersSharedWith, setUsersSharedWith] = useAtom(usersSharedWithAtom);

  const { contact } = useLocalSearchParams();
  const currentContact = useMemo(
    () => contact && JSON.parse(contact),
    [contact]
  );

  useEffect(() => {
    if (currentContact) {
      setUsersSharedWith([currentContact.id]);
    }
  }, [currentContact, setUsersSharedWith]);

  const [assignedColor, setAssignedColor] = useState("slate");
  const [assignedIcon, setAssignedIcon] = useState("list");

  const [showUsersSharedWith, setShowUsersSharedWith] = useState(false);
  const [showPalleteColor, setShowPalleteColor] = useState(false);
  const [showIconGrid, setShowIconGrid] = useState(false);

  const setListToFS = (data) => {
    const newList = {
      // function to FS
      ...data,
      id: new Date().toISOString(), // Generate a unique ID
    };
    return newList; // Return the complete list object
  };

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      id: "",
      ownerId: user.id,
      title: "",
      icon: "",
      color: "",
      usersShared: [],
    },
  });

  const watchedTitle = watch("title");

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("newList"),
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
        <Pressable onPress={handleCancelAlert}>
          <Text className={`text-2xl text-[${themes[theme].blueHeadText}]`}>
            {i18n.t("cancel")}
          </Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleAdd} disabled={!watchedTitle.trim()}>
          <Text
            className={`text-2xl font-semibold ${watchedTitle.trim() ? `text-[${themes[theme].blueHeadText}]` : `text-[${themes[theme].taskSecondText}]`}`}
          >
            {i18n.t("add")}
          </Text>
        </Pressable>
      ),
    });
  }, [
    navigation,
    theme,
    handleAdd,
    watchedTitle,
    handleCancelAlert,
    usersSharedWith,
  ]);

  useEffect(() => {
    setValue("icon", assignedIcon);
    setValue("color", assignedColor);
  }, [assignedColor, assignedIcon, setValue]);

  // Function to handle dismiss modal
  useEffect(() => {
    const dismissModal = navigation.addListener("beforeRemove", (e) => {
      // Codigo
    });
    return dismissModal;
  }, [navigation]);

  // Function to handle cancel alert
  const handleCancelAlert = useCallback(() => {
    if (watch("title").length > 0) {
      Alert.alert(i18n.t("newListWillBeDiscarded"), "", [
        {
          text: i18n.t("discard"),
          onPress: () => {
            navigation.goBack();
          },
          style: "destructive",
        },
        {
          text: i18n.t("cancel"),
        },
      ]);
    } else {
      navigation.goBack();
    }
  }, [navigation, watch]);

  // Function to handle add new list
  const handleAdd = handleSubmit((data) => {
    const updatedList = {
      ...data,
      usersShared: [user.id, ...usersSharedWith],
    };

    // Add list to DB backend
    const newListWithId = setListToFS(updatedList);
    // Add list to DB locally
    setLists((prevLists) => [...prevLists, newListWithId]);

    setUsersSharedWith([]);
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
          className={`w-full ${showIconGrid && "flex-1"} bg-[${themes[theme].surfaceBackground}] mb-8 rounded-xl border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
        >
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                autoFocus
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
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
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
export default NewListModal;
