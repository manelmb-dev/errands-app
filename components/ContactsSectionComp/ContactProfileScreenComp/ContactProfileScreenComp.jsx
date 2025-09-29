import { View, Image, TouchableHighlight, Text, Alert } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import { contactsAtom, themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import ContactSharedTasksMenu from "./ContactSharedTasksMenu/ContactSharedTasksMenu";
import ContactActions from "./ContactActions/ContactActions";
import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

const ContactProfileScreenComp = () => {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);
  const [contacts, setContacts] = useAtom(contactsAtom);

  const { contact } = useLocalSearchParams();
  const parsedContact = JSON.parse(contact);

  const currentContact =
    contacts.find((c) => c.id === parsedContact.id) || parsedContact;

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
    Alert.alert(`${i18n.t("blockUser")}?`, `${i18n.t("blockUserText")}`, [
      { text: i18n.t("cancel") },
      {
        text: i18n.t("block"),
        onPress: toogleBlockContact,
        style: "destructive",
      },
    ]);
  };

  const toogleBlockContact = () => {
    const updatedContact = {
      ...currentContact,
      blocked: !currentContact.blocked,
    };
    setContacts((prev) =>
      prev.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    );

    // TODO: FIRESTORE UPDATEEE FIX THISSS
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
          onPress={
            currentContact.blocked ? toogleBlockContact : confirmBlockContact
          }
        >
          <View className={`py-4 flex-row items-center pl-5 gap-5`}>
            <Feather
              name={currentContact.blocked ? "user-check" : "user-x"}
              size={28}
              color="red"
            />
            <View className={`flex-1 flex-row justify-between`}>
              <Text className={`text-red-500 text-lg font-medium`}>
                {currentContact.blocked
                  ? i18n.t("unblockUser")
                  : i18n.t("blockUser")}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default ContactProfileScreenComp;
