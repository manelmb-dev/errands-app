import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { View, Image } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import ContactSharedTasks from "./ContactSharedTasks/ContactSharedTasks";
import ContactActions from "./ContactActions/ContactActions";
import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

const ContactProfileScreenComp = () => {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);

  const { contact } = useLocalSearchParams();
  const currentContact = useMemo(() => JSON.parse(contact), [contact]);

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

  return (
    <View className={`flex-1 px-4 bg-[${themes[theme].background}]`}>
      {/* Contact details */}

      {/* Image contact or icon */}
      <View className="mb-3 flex items-center">
        {currentContact.photoURL ? (
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

      <ContactActions currentContact={currentContact} />

      <ContactSharedTasks currentContact={currentContact} />
    </View>
  );
};

export default ContactProfileScreenComp;
