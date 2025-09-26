import { View, Text, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import { themeAtom, contactsAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import ContactSharedTasks from "./ContactSharedTasks/ContactSharedTasks";
import MuteOptionsPopup from "./MuteOptionsPopup/MuteOptionsPopup";
import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const ContactProfileScreenComp = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [theme] = useAtom(themeAtom);
  const [, setContacts] = useAtom(contactsAtom);

  const { contact } = useLocalSearchParams();
  const currentContact = useMemo(() => JSON.parse(contact), [contact]);

  const [contactDetails, setContactDetails] = useState(currentContact);

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

  return (
    <View
      className={`flex-1 bg-[${themes[theme].background}]`}
      style={{ backgroundColor: themes[theme].background }}
    >
      {/* Contact details */}

      {/* Image contact or icon */}
      <View className="mb-3 flex items-center">
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
      <View className="flex-row w-11/12 mb-6 gap-2 items-stretch self-center">
        {/* Send errand to contact */}
        <TouchableOpacity
          className={`flex-1 h-24 rounded-2xl items-center justify-evenly border border-gray-300 bg-[${themes[theme].surfaceBackground}]`}
          activeOpacity={0.6}
          onPress={() => {
            router.push({
              pathname: "/Modals/newTaskModal",
              params: { contact: JSON.stringify(contact) },
            });
          }}
        >
          <Ionicons name="send" size={25} color={themes[theme].text} />
          <Text
            style={{ color: themes[theme].text }}
            className="text-base text-center"
          >
            {i18n.t("sendErrand")}
          </Text>
        </TouchableOpacity>

        {/* Toggle favorite contact */}
        <TouchableOpacity
          className={`flex-1 h-24 rounded-2xl items-center justify-evenly border border-yellow-500 ${contactDetails.favorite ? `${theme === "light" ? "bg-yellow-200" : "bg-yellow-700"}` : `bg-[${themes[theme].surfaceBackground}]`}`}
          activeOpacity={0.7}
          onPress={toggleFavoriteContact}
        >
          <Octicons
            name={contactDetails.favorite ? "star-fill" : "star"}
            size={25}
            color={themes[theme].text}
          />
          <Text
            className={`text-base text-center text-[${themes[theme].text}]`}
          >
            {contactDetails.favorite
              ? i18n.t("unfavorite")
              : i18n.t("favorite")}
          </Text>
        </TouchableOpacity>

        {/* Mute Popup contact */}
        <View className="flex-1">
          <MuteOptionsPopup contactDetails={contactDetails} />
        </View>

        {/* Toggle block contact */}
        <TouchableOpacity
          className={`flex-1 h-24 rounded-2xl items-center justify-evenly border border-red-500 ${contactDetails.blocked ? `${theme === "light" ? "bg-red-200" : "bg-red-700"}` : `bg-[${themes[theme].surfaceBackground}]`}`}
          activeOpacity={0.7}
          onPress={toggleBlockContact}
        >
          <Feather
            name={contactDetails.blocked ? "user-check" : "user-x"}
            size={28}
            color={themes[theme].text}
          />
          <Text
            className={`text-base text-center text-[${themes[theme].text}]`}
          >
            {contactDetails.blocked ? i18n.t("unblock") : i18n.t("block")}
          </Text>
        </TouchableOpacity>
      </View>

      <ContactSharedTasks currentContact={currentContact} />
    </View>
  );
};

export default ContactProfileScreenComp;
