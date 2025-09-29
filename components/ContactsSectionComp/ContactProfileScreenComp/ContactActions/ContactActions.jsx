import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { contactsAtom, themeAtom } from "../../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import MuteOptionsPopup from "./MuteOptionsPopup/MuteOptionsPopup";
import { themes } from "../../../../constants/themes";
import i18n from "../../../../constants/i18n";

const ContactActions = ({ currentContact }) => {
  const router = useRouter();

  const [theme] = useAtom(themeAtom);
  const [, setContacts] = useAtom(contactsAtom);

  const [contactDetails, setContactDetails] = useState(currentContact);

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

  return (
    <View className="flex-row w-full mb-6 gap-2 items-stretch self-center">
      {/* Send errand to contact */}
      <TouchableOpacity
        className={`flex-1 h-24 rounded-2xl items-center justify-evenly border border-gray-300 bg-[${themes[theme].surfaceBackground}]`}
        activeOpacity={0.6}
        onPress={() => {
          router.push({
            pathname: "/Modals/newTaskModal",
            params: { contact: JSON.stringify(contactDetails) },
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
        <Text className={`text-base text-center text-[${themes[theme].text}]`}>
          {contactDetails.favorite ? i18n.t("unfavorite") : i18n.t("favorite")}
        </Text>
      </TouchableOpacity>

      {/* Mute Popup contact */}
      <View className="flex-1">
        <MuteOptionsPopup contactDetails={contactDetails} />
      </View>
    </View>
  );
};

export default ContactActions;
