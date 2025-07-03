import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableHighlight,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";

import { listsAtom, themeAtom, userAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";

import ColorGrid from "../../Utils/Icons&ColorsLists/ColorGrid";
import IconGrid from "../../Utils/Icons&ColorsLists/IconGrid";
import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const NewListModal = () => {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);

  const [theme] = useAtom(themeAtom);
  const [, setLists] = useAtom(listsAtom);

  const [assignedColor, setAssignedColor] = useState("slate");
  const [assignedIcon, setAssignedIcon] = useState("list");

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
  }, [navigation, theme, handleAdd, watchedTitle, handleCancelAlert]);

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

  //FIRESTONE FIXXX ALL THE COMPONENT

  // Function to handle add new list
  const handleAdd = handleSubmit((data) => {
    console.log(data); // Set to FIRESTORE

    // Add list to DB
    const newListWithId = setListToFS(data);
    setLists((prevLists) => [...prevLists, newListWithId]);
    // Reset form values
    navigation.goBack();
  });

  return (
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
        className={`w-full ${showIconGrid && "flex-1"} bg-[${themes[theme].buttonMenuBackground}] mb-4 rounded-xl border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
      >
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              autoFocus
              className={`p-4 pl-4 text-2xl border-b-hairline ${theme === "light" ? "border-gray-300" : "border-neutral-950"} align-top leading-tight text-[${themes[theme].text}]`}
              value={value}
              onChangeText={onChange}
              placeholder={i18n.t("listTitle")}
              placeholderTextColor={
                theme === "dark" && themes[theme].taskSecondText
              }
            />
          )}
        />
        {/* Color */}
        <TouchableHighlight
          onPress={() => setShowPalleteColor((prev) => !prev)}
        >
          <View
            className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}]  pt-2 pb-2 px-4`}
          >
            <View className="flex-row gap-4 items-center">
              <MaterialIcons
                className="p-1.5 bg-slate-400 rounded-lg"
                name="color-lens"
                size={24}
                color={themes["light"].background}
              />
              <View>
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  {i18n.t("color")}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-3 items-center">
              <FontAwesome6
                name="arrows-up-down"
                size={22}
                color={themes["light"].taskSecondText}
              />
              <View
                className={`flex-row items-center py-4 px-8 rounded-2xl ${theme === "light" ? `bg-${assignedColor}-300` : `bg-${assignedColor}-600`}`}
              />
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
          onPress={() => setShowIconGrid((prev) => !prev)}
        >
          <View
            className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] pt-2 pb-2 px-4 ${showIconGrid ? "" : "rounded-b-xl"}`}
          >
            <View className="flex-row gap-4 items-center">
              <Ionicons
                className="p-1.5 bg-slate-400 rounded-lg"
                name="apps-outline"
                size={24}
                color={themes["light"].background}
              />
              <View>
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  {i18n.t("icon")}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-3 items-center mr-1">
              <FontAwesome6
                name="arrows-up-down"
                size={22}
                color={themes["light"].taskSecondText}
              />
              <Ionicons
                name={assignedIcon}
                size={29}
                color={`${themes[theme].text}`}
              />
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
  );
};
export default NewListModal;
