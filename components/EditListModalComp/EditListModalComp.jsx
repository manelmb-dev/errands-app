import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import deepEqual from "fast-deep-equal";
import {
  View,
  Text,
  Pressable,
  Alert,
  TextInput,
  TouchableHighlight,
} from "react-native";

import { listsAtom, themeAtom, userAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";

import ColorGrid from "../../Utils/Icons&ColorsLists/ColorGrid";
import IconGrid from "../../Utils/Icons&ColorsLists/IconGrid";
import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";
const EditListModalComp = () => {
  const navigation = useNavigation();
  const shouldPreventClose = useRef(true);

  const [theme] = useAtom(themeAtom);
  const [, setLists] = useAtom(listsAtom);

  const { list } = useLocalSearchParams();
  const currentList = useMemo(() => JSON.parse(list), [list]);

  const initialValuesRef = useRef(currentList);

  const [assignedColor, setAssignedColor] = useState(currentList.color);
  const [assignedIcon, setAssignedIcon] = useState(currentList.icon);

  const [showPalleteColor, setShowPalleteColor] = useState(false);
  const [showIconGrid, setShowIconGrid] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: { ...currentList },
  });

  const watchedTitle = watch("title");

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
  }, [navigation, theme, handleSave, watchedTitle, handleCancelAlert]);

  useEffect(() => {
    setValue("icon", assignedIcon);
    setValue("color", assignedColor);
  }, [assignedColor, assignedIcon, setValue]);

  // Function to handle dismiss modal
  useEffect(() => {
    const dismissModal = navigation.addListener("beforeRemove", (e) => {
      if (!shouldPreventClose.current) return;

      e.preventDefault();
      handleCancelAlert(() => {
        shouldPreventClose.current = false;
        navigation.goBack();
      });
    });
    return dismissModal;
  }, [navigation, handleCancelAlert]);

  // Function to handle cancel alert
  const handleCancelAlert = useCallback(
    (onDiscard) => {
      const formValues = watch();
      const hasChanges = !deepEqual(initialValuesRef.current, formValues);

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
  const onSubmit = useCallback(
    (data) => {
      const updatedList = { ...data, id: currentList.id };
      setLists((prevLists) =>
        prevLists.map((l) => (l.id === updatedList.id ? updatedList : l))
      );
      navigation.goBack();
    },
    [currentList.id, setLists, navigation]
  );

  const handleSave = handleSubmit(onSubmit);

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
        className={`w-full ${showIconGrid && "flex-1"} bg-[${themes[theme].buttonMenuBackground}] mb-4 rounded-xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
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
              placeholderTextColor={themes[theme].taskSecondText}
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
export default EditListModalComp;
