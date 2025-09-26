import { useLocalSearchParams } from "expo-router";
import { View, Image } from "react-native";
import React, { useMemo } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import ContactSharedTasks from "./ContactSharedTasks/ContactSharedTasks";
import ContactActions from "./ContactActions/ContactActions";
import { themes } from "../../../constants/themes";

const ContactProfileScreenComp = () => {
  const [theme] = useAtom(themeAtom);

  const { contact } = useLocalSearchParams();
  const currentContact = useMemo(() => JSON.parse(contact), [contact]);

  return (
    <View className={`flex-1 bg-[${themes[theme].background}]`}>
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
