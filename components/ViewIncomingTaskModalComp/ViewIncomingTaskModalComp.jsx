import { View, Text, Pressable, TextInput, Switch } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo } from "react";

import { contactsAtom, userAtom } from "../../constants/storeAtoms";
import { themeAtom } from "../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import { Ionicons, FontAwesome6, MaterialIcons } from "@expo/vector-icons";

import {
  priorityOptions,
  repeatOptions,
} from "../../constants/repeatPriorityOptions";
import formatDayShort from "../../constants/formatDayShort";
import formatDay from "../../constants/formatDay";
import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const ViewIncomingTaskModal = () => {
  const navigation = useNavigation();

  const { errand } = useLocalSearchParams();
  const currentErrand = useMemo(() => JSON.parse(errand), [errand]);

  const { control, watch } = useForm({
    defaultValues: { ...currentErrand },
  });

  const [user] = useAtom(userAtom);
  const [contacts] = useAtom(contactsAtom);

  const [theme] = useAtom(themeAtom);

  const watchedTitle = watch("title");

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("details"),
      presentation: "modal",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerRight: () => (
        <Pressable
          className="pl-1"
          onPress={() => navigation.goBack()}
          // disabled={!watchedTitle.trim()}
        >
          <Text
            className={`text-2xl font-semibold text-[${themes[theme].blueHeadText}]`}
            // className={`text-2xl font-bold ${watchedTitle.trim() ? `text-[${themes[theme].blueHeadText}]` : `text-[${themes[theme].taskSecondText}]`}`}
          >
            {i18n.t("ok")}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, theme, watchedTitle]);

  const ownerCurrentErrand = contacts.find(
    (contact) => contact.id === currentErrand.ownerId
  );

  return (
    <View className={`p-6 bg-[${themes[theme].background}] h-full`}>
      <View
        className={`mb-6 pb-3 flex-row justify-between items-center border-b-[1.5px] border-[${themes[theme].borderColor}]`}
      >
        <Text className={`text-3xl font-semibold text-[${themes[theme].text}]`}>
          {currentErrand.title}
        </Text>
        {currentErrand.marked && (
          <Ionicons
            className="mx-4 p-1.5 bg-orange-500 rounded-lg "
            name="flag-sharp"
            size={18}
            color={themes["light"].background}
          />
        )}
      </View>

      <View>
        {/* Owner & Date */}
        <View className="pb-10 flex-row items-center justify-between">
          <View className=" flex-row items-center gap-2">
            {/* If there is no picture, show the default icon */}
            <Ionicons
              name="person-circle-outline"
              size={42}
              color={themes["light"].taskSecondText}
            />
            <View className="flex-col">
              <Text className={`text-lg text-[${themes[theme].text}]`}>
                {i18n.t("sentBy")}
              </Text>
              <Text
                className={`text-lg font-semibold text-[${themes[theme].text}]`}
              >
                {ownerCurrentErrand.name} {ownerCurrentErrand.surname}
              </Text>
            </View>
          </View>
          <View className="pr-3 h-full flex-row justify-end items-center gap-3">
            <Ionicons
              className={`p-2 rounded-full border border-[${themes[theme].taskSecondText}]`}
              name="calendar-outline"
              size={18}
              color={themes["light"].taskSecondText}
            />
            <View className="flex-col items-start mr-3">
              <Text
                className={`text-lg ${
                  new Date(
                    `${currentErrand.dateErrand}T${currentErrand.timeErrand || "24:00"}`
                  ) < new Date()
                    ? `${theme === "light" ? "text-red-500" : "text-red-700 "}`
                    : `text-[${themes[theme].text}]`
                }`}
              >
                {formatDayShort(currentErrand.dateErrand)}
              </Text>
              {currentErrand.timeErrand && (
                <Text
                  className={`text-lg ${
                    new Date(
                      `${currentErrand.dateErrand}T${currentErrand.timeErrand || "24:00"}`
                    ) < new Date()
                      ? `${theme === "light" ? "text-red-500" : "text-red-700 "}`
                      : `text-[${themes[theme].text}]`
                  }`}
                >
                  {currentErrand.timeErrand}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Description */}
        {currentErrand.description && (
          <Text className={`pb-10 text-xl text-[${themes[theme].text}]`}>
            {currentErrand.description}
          </Text>
        )}

        <View className="flex-col gap-3">
          {/* Notice */}
          {currentErrand.dateNotice &&
            currentErrand.dateNotice < new Date() && (
              <View className="flex-row items-center gap-3">
                <Ionicons
                  className={`p-1 rounded-lg border border-[${themes[theme].taskSecondText}]`}
                  name="notifications-outline"
                  size={20}
                  color={themes[theme].taskSecondText}
                />
                <View className="flex-row items-center gap-3">
                  <Text className={`text-lg text-[${themes[theme].text}]`}>
                    {formatDayShort(currentErrand.dateNotice)}
                  </Text>
                  {currentErrand.timeNotice && (
                    <Text className={`text-lg text-[${themes[theme].text}]`}>
                      {currentErrand.timeNotice}
                    </Text>
                  )}
                </View>
              </View>
            )}

          {/* Repeat */}
          {currentErrand.repeat !== "never" && (
            <View className="flex-row items-center gap-3">
              <Ionicons
                className={`p-1 rounded-lg border border-[${themes[theme].taskSecondText}]`}
                name="repeat"
                size={20}
                color={themes[theme].taskSecondText}
              />
              <Text className={`text-lg text-[${themes[theme].text}]`}>
                {currentErrand.repeat}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
export default ViewIncomingTaskModal;
