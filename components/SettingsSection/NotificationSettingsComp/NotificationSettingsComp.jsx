import { View, Text, Switch } from "react-native";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";

import { themeAtom, userAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

const NotificationSettingsComp = () => {
  const navigation = useNavigation();

  const [user, setUser] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);

  const [notificationSettings, setNotificationSettings] = useState({
    notificationsEnabled: user.settings.notifications.notificationsEnabled,
    newMessages: user.settings.notifications.newMessages,
    newErrands: user.settings.notifications.newErrands,
    reminders: user.settings.notifications.reminders,
    changesInErrands: user.settings.notifications.changesInErrands,
  });

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("notifications"),
      headerBackTitle: i18n.t("back"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  // Opciones individuales de notificación
  const notificationOptions = [
    {
      key: "newMessages",
      label: i18n.t("newMessages"),
      icon: "chatbubble-outline",
    },
    {
      key: "newErrands",
      label: i18n.t("newErrands"),
      icon: "document-text-outline",
    },
    {
      key: "reminders",
      label: i18n.t("reminders"),
      icon: "notifications-outline",
    },
    {
      key: "changesInErrands",
      label: i18n.t("changesInErrands"),
      icon: "create-outline",
    },
  ];

  const handleNotificationsEnabledToggle = () => {
    const value = !notificationSettings.notificationsEnabled;

    let newSettings;

    if (value) {
      // Set all to true if notifications are enabled
      newSettings = {
        notificationsEnabled: true,
        newMessages: true,
        newErrands: true,
        reminders: true,
        changesInErrands: true,
      };
    } else {
      // If notifications are disabled, set all to false
      newSettings = {
        notificationsEnabled: false,
        newMessages: false,
        newErrands: false,
        reminders: false,
        changesInErrands: false,
      };
    }

    setNotificationSettings(newSettings);
    updateUserSettings(newSettings);
  };

  const toggleIndividual = (key) => {
    const newSettings = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };
    setNotificationSettings(newSettings);

    // Check if all are off
    const allOff =
      !newSettings.newMessages &&
      !newSettings.newErrands &&
      !newSettings.reminders &&
      !newSettings.changesInErrands;

    if (allOff) {
      const finalSettings = {
        ...newSettings,
        notificationsEnabled: false,
      };
      setNotificationSettings(finalSettings);
      updateUserSettings(finalSettings);
    } else {
      updateUserSettings(newSettings);
    }
  };

  const updateUserSettings = (newNotificationSettings) => {
    setUser((prevUser) => ({
      ...prevUser,
      settings: {
        ...prevUser.settings,
        notifications: newNotificationSettings,
      },
    }));
    // Add Firestore update here if needed
  };

  return (
    <View className="p-4">
      <View
        className={`mb-4 p-3 flex-row justify-between items-center bg-[${themes[theme].buttonMenuBackground}] rounded-xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
      >
        <View className="flex-row items-center gap-3">
          <Ionicons
            name="notifications-outline"
            size={23}
            color={themes[theme].text}
          />
          <Text className="text-lg">{i18n.t("enableNotifications")}</Text>
        </View>
        <Switch
          value={notificationSettings.notificationsEnabled}
          onValueChange={handleNotificationsEnabledToggle}
        />
      </View>

      {/* Opciones individuales */}
      {notificationSettings.notificationsEnabled && (
        <View
          className={`bg-[${themes[theme].buttonMenuBackground}] rounded-xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
        >
          {notificationOptions.map((option, index) => (
            <View
              key={option.key}
              className={`p-2.5 flex-row justify-between items-center ${
                index !== notificationOptions.length - 1 &&
                `border-b border-[${themes[theme].listsSeparator}]`
              }`}
            >
              <View className="flex-row items-center gap-3">
                <Ionicons
                  name={option.icon}
                  size={23}
                  color={themes[theme].text}
                />
                <Text className="text-base">{option.label}</Text>
              </View>
              <Switch
                value={notificationSettings[option.key]}
                onValueChange={() => toggleIndividual(option.key)}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default NotificationSettingsComp;
