import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themeAtom, errandsAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const ContactDetailModalComp = () => {
  const navigation = useNavigation();
  const [theme] = useAtom(themeAtom);
  const [errands] = useAtom(errandsAtom);

  const { contact } = useLocalSearchParams();
  const currentContact = useMemo(() => JSON.parse(contact), [contact]);

  const [tab, setTab] = useState("sent"); // sent | received
  const [filter, setFilter] = useState("pending"); // pending | completed

  useEffect(() => {
    navigation.setOptions({
      title: `${currentContact.name} ${currentContact?.surname}`,
      headerBackTitle: i18n.t("back"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerRight: () => (
        <Ionicons name="options" color={themes[theme].blueHeadText} size={24} />
      ),
    });
  }, [navigation, theme, currentContact]);

  const filteredErrands = useMemo(() => {
    return errands.filter((errand) => {
      const isSender = errand.ownerId === currentContact.id;
      const isReceiver = errand.assignedId === currentContact.id;
      const isCompleted = errand.completed;

      if (tab === "sent" && !isSender) return false;
      if (tab === "received" && !isReceiver) return false;

      if (filter === "pending" && isCompleted) return false;
      if (filter === "completed" && !isCompleted) return false;

      return true;
    });
  }, [errands, currentContact, tab, filter]);

  return (
    <ScrollView
      className="flex-1 p-4"
      style={{ backgroundColor: themes[theme].background }}
    >
      {/* Datos del contacto */}
      <View className="mb-6">
        <Text
          className="text-xl font-bold mb-1"
          style={{ color: themes[theme].text }}
        >
          {currentContact.name} {currentContact.surname}
        </Text>
        {currentContact.alias && (
          <Text className="text-sm mb-1" style={{ color: themes[theme].gray }}>
            @{currentContact.alias}
          </Text>
        )}
        {currentContact.phoneNumber && (
          <Text
            className="text-base mb-1"
            style={{ color: themes[theme].text }}
          >
            📞 {currentContact.phoneNumber}
          </Text>
        )}
        {currentContact.email && (
          <Text
            className="text-base mb-1"
            style={{ color: themes[theme].text }}
          >
            ✉️ {currentContact.email}
          </Text>
        )}
      </View>

      {/* Tabs */}
      <View className="flex-row mb-4">
        {["sent", "received"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            className={`px-4 py-2 rounded-full mr-2 ${
              tab === t
                ? "bg-blue-600"
                : theme === "light"
                  ? "bg-gray-200"
                  : "bg-gray-700"
            }`}
          >
            <Text
              className="text-sm font-semibold"
              style={{
                color: tab === t ? "#fff" : themes[theme].text,
              }}
            >
              {t === "sent" ? i18n.t("sent") : i18n.t("received")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filters */}
      <View className="flex-row mb-4">
        {["pending", "completed"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`px-4 py-1 rounded-full mr-2 border ${
              filter === f
                ? "border-blue-600"
                : theme === "light"
                  ? "border-gray-400"
                  : "border-gray-600"
            }`}
          >
            <Text
              className="text-sm"
              style={{
                color:
                  filter === f
                    ? themes[theme].blueHeadText
                    : themes[theme].text,
              }}
            >
              {f === "pending" ? i18n.t("pending") : i18n.t("completed")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de recados */}
      <View>
        {filteredErrands.length === 0 ? (
          <Text style={{ color: themes[theme].gray }}>
            {i18n.t("noErrands")}
          </Text>
        ) : (
          filteredErrands.map((errand) => (
            <View
              key={errand.id}
              className={`mb-3 p-3 rounded-lg ${
                theme === "light" ? "bg-gray-100" : "bg-gray-800"
              }`}
            >
              <Text
                className="text-base font-semibold mb-1"
                style={{ color: themes[theme].text }}
              >
                {errand.title}
              </Text>
              <Text className="text-xs" style={{ color: themes[theme].gray }}>
                {errand.date}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default ContactDetailModalComp;
