import { Pressable, Touchable, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { contactsAtom } from "../constants/storeAtoms";
import { useAtom } from "jotai";

import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";

const RenderRightActionsContact = ({ contact, openSwipeableRef }) => {
  const router = useRouter();

  const [, setContacts] = useAtom(contactsAtom);

  const toggleFavorite = async () => {
    // Update contact locally
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contact.id ? { ...c, favorite: !c.favorite } : c
      )
    );

    openSwipeableRef.current?.close();

    // TODO: FIRESTORE UPDATEEE
    // await updateContactInFirestore(contact);
  };

  return (
    <View className="flex-row h-full">
      <TouchableOpacity
        className="w-20 bg-yellow-300 justify-center items-center"
        activeOpacity={0.6}
        onPress={toggleFavorite}
      >
        <Octicons name="star" size={26} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        className="w-20 bg-blue-600 justify-center items-center"
        activeOpacity={0.6}
        onPress={() => {
          router.push({
            pathname: "/Modals/newTaskModal",
            params: { contact: JSON.stringify(contact) },
          });

          openSwipeableRef.current?.close();
        }}
      >
        {/*
        I want this icon below but it doest no find it
        FIX THISSS UPDATEEEE
        <MaterialDesignIcons
          name="invoice-text-send-outline"
          size={24}
          color="white"
        /> */}
        <Ionicons name="send" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default RenderRightActionsContact;
