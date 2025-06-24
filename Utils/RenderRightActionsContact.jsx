import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import { contactsAtom } from "../constants/storeAtoms";
import { useAtom } from "jotai";

import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import Ionicons from "react-native-vector-icons/Ionicons";

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
      <Pressable
        className="w-16 bg-yellow-300 justify-center items-center"
        onPress={toggleFavorite}
      >
        <Ionicons name="star-outline" size={24} color="white" />
      </Pressable>
      <Pressable
        className="w-16 bg-blue-600 justify-center items-center"
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
        <Ionicons name="send" size={24} color="white" />
      </Pressable>
    </View>
  );
};

export default RenderRightActionsContact;
