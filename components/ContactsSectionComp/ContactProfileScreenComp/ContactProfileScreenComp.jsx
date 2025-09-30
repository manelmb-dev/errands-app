import { View, Image, TouchableHighlight, Text, Alert } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import {
  contactsAtom,
  themeAtom,
  userAtom,
} from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import ContactSharedTasksMenu from "./ContactSharedTasksMenu/ContactSharedTasksMenu";
import ContactActions from "./ContactActions/ContactActions";
import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

const ContactProfileScreenComp = () => {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);
  const [contacts] = useAtom(contactsAtom);
  const [user, setUser] = useAtom(userAtom);

  const { contact } = useLocalSearchParams();
  const parsedContact = JSON.parse(contact);

  const currentContact =
    contacts.find((c) => c.id === parsedContact.id) || parsedContact;

  const isContactBlocked = user.blockedUsers.includes(currentContact.id);

  useEffect(() => {
    navigation.setOptions({
      title: currentContact.name + " " + currentContact.surname,
      headerBackTitle: i18n.t("back"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerRight: () => null,
    });
  }, [navigation, currentContact, theme]);

  const confirmBlockContact = () => {
    Alert.alert(
      `${i18n.t("blockUserQuestion")} ${currentContact.name} ${currentContact.surname}?`,
      `${i18n.t("blockUserText")}`,
      [
        { text: i18n.t("cancel") },
        {
          text: i18n.t("block"),
          onPress: toogleBlockContact,
          style: "destructive",
        },
      ]
    );
  };

  const toogleBlockContact = () => {
    let updatedBlockedUsers;

    if (isContactBlocked) {
      updatedBlockedUsers = user.blockedUsers.filter(
        (id) => id !== currentContact.id
      );
    } else {
      updatedBlockedUsers = [...user.blockedUsers, currentContact.id];
    }

    const updatedUser = { ...user, blockedUsers: updatedBlockedUsers };

    setUser(updatedUser);

    // TODO: FIRESTORE UPDATEEE FIX THISSS
    // setUser((prev) =>
    //   prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    // );
  };

  return (
    <View className={`flex-1 px-4 bg-[${themes[theme].background}] gap-4`}>
      {/* Contact details */}

      {/* Image contact or icon */}
      <View className="flex items-center">
        {currentContact.photoURL ? (
          <Image
            className="w-20 h-20 rounded-full"
            source={{ uri: currentContact.photoURL }}
          />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={80}
            color={themes[theme].iconColor}
          />
        )}
      </View>

      <ContactActions currentContact={currentContact} />

      <ContactSharedTasksMenu currentContact={currentContact} />

      <View
        className={`bg-[${themes[theme].surfaceBackground}] rounded-xl border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
      >
        <TouchableHighlight
          className={`rounded-xl`}
          underlayColor={themes[theme].background}
          activeOpacity={0.8}
          onPress={isContactBlocked ? toogleBlockContact : confirmBlockContact}
        >
          <View className={`py-4 flex-row items-center pl-5 gap-5`}>
            <Feather
              name={isContactBlocked ? "user-check" : "user-x"}
              size={28}
              color="red"
            />
            <View className={`flex-1 flex-row justify-between`}>
              <Text className={`text-red-500 text-lg font-medium`}>
                {isContactBlocked ? i18n.t("unblockUser") : i18n.t("blockUser")}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default ContactProfileScreenComp;
