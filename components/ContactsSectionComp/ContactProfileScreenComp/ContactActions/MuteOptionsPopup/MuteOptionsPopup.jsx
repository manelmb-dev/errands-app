import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Switch } from "react-native";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";

import { themeAtom, userAtom } from "../../../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";
import { themes } from "../../../../../constants/themes";
import i18n from "../../../../../constants/i18n";

export default function MainPopupPage({ currentContact }) {
  const [theme] = useAtom(themeAtom);
  const [user, setUser] = useAtom(userAtom);

  const [muteSettings, setMuteSettings] = useState(() => {
    const override = user.mutedUsers?.[currentContact.id] ?? {};
    return {
      muteAll: override.muteAll ?? false,
      muteMessages: override.muteMessages ?? false,
      muteNewErrands: override.muteNewErrands ?? false,
      muteReminders: override.muteReminders ?? false,
      muteChangesInErrands: override.muteChangesInErrands ?? false,
    };
  });

  useEffect(() => {
    if (!currentContact?.id) return;

    const hasAnyMute = Object.values(muteSettings).some((v) => v);

    setUser((prev) => {
      const updatedMutedUsers = { ...prev.mutedUsers };

      if (hasAnyMute) {
        updatedMutedUsers[currentContact.id] = muteSettings;
      } else {
        delete updatedMutedUsers[currentContact.id];
      }

      return {
        ...prev,
        mutedUsers: updatedMutedUsers,
      };
    });
  }, [muteSettings, currentContact.id, setUser]);

  const toggleMute = (key) => {
    setMuteSettings((prev) => {
      if (key === "muteAll") {
        const newValue = !prev.muteAll;
        return {
          muteAll: newValue,
          muteMessages: newValue,
          muteNewErrands: newValue,
          muteReminders: newValue,
          muteChangesInErrands: newValue,
        };
      } else {
        const updated = {
          ...prev,
          [key]: !prev[key],
        };

        // Check if all the individuals are true
        const allMuted =
          updated.muteMessages &&
          updated.muteNewErrands &&
          updated.muteReminders &&
          updated.muteChangesInErrands;

        return {
          ...updated,
          muteAll: allMuted,
        };
      }
    });
  };

  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
          triggerTouchable: {
            activeOpacity: 0.6,
          },
        }}
      >
        <View
          className={`h-24 rounded-2xl items-center justify-evenly border border-emerald-500 ${theme === "light" ? "bg-emerald-50" : "bg-emerald-950"}`}
        >
          <Ionicons name="notifications" size={25} color={themes[theme].text} />
          <Text
            className="text-base text-center"
            style={{ color: themes[theme].text }}
          >
            {i18n.t("mute")}
          </Text>
        </View>
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginTop: 100,
            backgroundColor: themes[theme].surfaceBackground,
            borderRadius: 10,
            width: 280,
            elevation: 12,
            shadowColor: "#000",
            shadowOpacity: 0.4,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 40,
          },
        }}
      >
        {[
          { key: "muteAll", label: i18n.t("muteAll") },
          { key: "muteMessages", label: i18n.t("muteMessages") },
          { key: "muteNewErrands", label: i18n.t("muteNewErrands") },
          { key: "muteReminders", label: i18n.t("muteReminders") },
          {
            key: "muteChangesInErrands",
            label: i18n.t("muteChangesInErrands"),
          },
        ].map(({ key, label }, index, array) => (
          <MenuOption key={key}>
            <View
              className={`p-3 flex-row justify-between items-center ${index < array.length - 1 && `border-b-hairline border-[${themes[theme].borderColor}]`}`}
            >
              <Text style={{ color: themes[theme].text }}>{label}</Text>
              <Switch
                value={muteSettings[key]}
                onValueChange={() => toggleMute(key)}
              />
            </View>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
}
