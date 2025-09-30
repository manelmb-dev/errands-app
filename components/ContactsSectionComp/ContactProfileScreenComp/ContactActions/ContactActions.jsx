import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { themeAtom, userAtom } from "../../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import MuteOptionsPopup from "./MuteOptionsPopup/MuteOptionsPopup";
import { themes } from "../../../../constants/themes";
import i18n from "../../../../constants/i18n";

const ContactActions = ({ currentContact }) => {
  const router = useRouter();

  const [theme] = useAtom(themeAtom);
  const [user, setUser] = useAtom(userAtom);

  const [contactDetails] = useState(currentContact);

  const isContactFavorite = user.favoriteUsers.includes(currentContact.id);

  const toggleFavoriteContact = () => {
    let updatedFavoriteUsers;

    if (isContactFavorite) {
      updatedFavoriteUsers = user.favoriteUsers.filter(
        (id) => id !== currentContact.id
      );
    } else {
      updatedFavoriteUsers = [...user.favoriteUsers, currentContact.id];
    }
    const updatedUser = {
      ...user,
      favoriteUsers: updatedFavoriteUsers,
    };

    setUser(updatedUser);

    // TODO: FIRESTORE UPDATEEE FIX THISSS
    // setUser((prev) =>
    //   prev.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    // );
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
        className={`flex-1 h-24 rounded-2xl items-center justify-evenly border border-yellow-500 ${isContactFavorite ? `${theme === "light" ? "bg-yellow-200" : "bg-yellow-700"}` : `bg-[${themes[theme].surfaceBackground}]`}`}
        activeOpacity={0.7}
        onPress={toggleFavoriteContact}
      >
        <Octicons
          name={isContactFavorite ? "star-fill" : "star"}
          size={25}
          color={themes[theme].text}
        />
        <Text className={`text-base text-center text-[${themes[theme].text}]`}>
          {isContactFavorite ? i18n.t("unfavorite") : i18n.t("favorite")}
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
