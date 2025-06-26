import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";

import {
  themeAtom,
  errandsAtom,
  contactsAtom,
} from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const ContactDetailModalComp = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [theme] = useAtom(themeAtom);
  const [errands] = useAtom(errandsAtom);
  const [, setContacts] = useAtom(contactsAtom);

  const { contact } = useLocalSearchParams();
  const currentContact = useMemo(() => JSON.parse(contact), [contact]);

  const [contactDetails, setContactDetails] = useState(currentContact);

  const [tab, setTab] = useState("outgoing"); // outgoing | incoming
  const [filter, setFilter] = useState("pending"); // pending | completed

  const toggleBlockContact = () => {
    const updatedContact = {
      ...contactDetails,
      blocked: !contactDetails.blocked,
    };

    setContactDetails(updatedContact);

    setContacts((prev) =>
      prev.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    );

    // TODO: FIRESTORE UPDATEEE FIX THISSS
  };

  const toggleFavoriteContact = () => {
    const updatedContact = {
      ...contactDetails,
      favorite: !contactDetails.favorite,
    };

    setContactDetails(updatedContact);

    setContacts((prev) =>
      prev.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    );

    // TODO: FIRESTORE UPDATEEE FIX THISSS
  };

  useEffect(() => {
    navigation.setOptions({
      title: `${contactDetails.name} ${contactDetails?.surname}`,
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
  }, [navigation, theme, contactDetails]);

  const filteredErrands = useMemo(() => {
    return errands.filter((errand) => {
      const isSender = errand.ownerId === currentContact.id;
      const isReceiver = errand.assignedId === currentContact.id;
      const isCompleted = errand.completed;

      if (tab === "outgoing" && !isSender) return false;
      if (tab === "incoming" && !isReceiver) return false;

      if (filter === "pending" && isCompleted) return false;
      if (filter === "completed" && !isCompleted) return false;

      return true;
    });
  }, [errands, currentContact, tab, filter]);

  return (
    <ScrollView
      className={`flex-1 p-4 bg-[${themes[theme].background}]`}
      style={{ backgroundColor: themes[theme].background }}
    >
      {/* Contact details */}

      {/* Image contact or icon */}
      <View className="flex items-center">
        {contactDetails.photoURL ? (
          <Image
            className="w-20 h-20 rounded-full"
            source={{ uri: contact.photoURL }}
          />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={80}
            color={themes[theme].iconColor}
          />
        )}
      </View>
      <View className="flex-row mb-6 gap-4 items-center">
        {/* Send errand to contact */}
        <TouchableOpacity
          className={`mt-3 py-3 px-1 flex-1 rounded-2xl items-center justify-around gap-1.5 border border-gray-300 bg-[${themes[theme].buttonMenuBackground}]`}
          activeOpacity={0.8}
          onPress={() => {
            router.push({
              pathname: "/Modals/newTaskModal",
              params: { contact: JSON.stringify(contact) },
            });
          }}
        >
          <Ionicons name="send" size={25} color={themes[theme].text} />
          <Text
            className={`text-base text-center text-[${themes[theme].text}]`}
          >
            {i18n.t("sendErrand")}
          </Text>
        </TouchableOpacity>

        {/* Toggle favorite contact */}
        {contactDetails.favorite ? (
          <TouchableOpacity
            className={`mt-3 py-3 px-1 flex-1 rounded-2xl items-center justify-around gap-1.5 border border-yellow-500 bg-yellow-200`}
            activeOpacity={0.8}
            onPress={toggleFavoriteContact}
          >
            <Octicons name="star" size={25} color={themes[theme].text} />
            <Text
              className={`text-base text-center text-[${themes[theme].text}]`}
            >
              {i18n.t("unfavorite")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className={`mt-3 py-3 px-1 flex-1 rounded-2xl items-center justify-around gap-1.5 border border-yellow-500 bg-yellow-50`}
            activeOpacity={0.8}
            onPress={toggleFavoriteContact}
          >
            <Octicons name="star-fill" size={25} color={themes[theme].text} />
            <Text
              className={`text-base text-center text-[${themes[theme].text}]`}
            >
              {i18n.t("favorite")}
            </Text>
          </TouchableOpacity>
        )}

        {/* Toggle block contact */}
        {contactDetails.blocked ? (
          <TouchableOpacity
            className={`mt-3 py-3 px-1 flex-1 rounded-2xl items-center justify-around gap-1.5 border border-red-500 bg-red-200`}
            activeOpacity={0.8}
            onPress={toggleBlockContact}
          >
            <Feather name="user-check" size={28} color="#dc2626" />
            <Text
              className={`text-base text-red-600 font-semibold text-center`}
            >
              {i18n.t("unblock")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className={`mt-3 py-3 px-1 flex-1 rounded-2xl items-center justify-around gap-1.5 border border-red-500 bg-red-50`}
            activeOpacity={0.8}
            onPress={toggleBlockContact}
          >
            <Feather name="user-x" size={28} color="#dc2626" />
            <Text className="text-base text-red-600 font-semibold text-center">
              {i18n.t("block")}
            </Text>
          </TouchableOpacity>
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
              {t === "sent" ? i18n.t("outgoing") : i18n.t("incoming")}
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
