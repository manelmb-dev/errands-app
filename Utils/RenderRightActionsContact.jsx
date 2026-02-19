import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { contactsAtom, userAtom } from "../constants/storeAtoms";
import { useAtom } from "jotai";

import { Ionicons, Octicons, MaterialDesignIcons } from "@expo/vector-icons";

const RenderRightActionsContact = ({
  contact,
  openSwipeableRef,
  isContactFavorite,
}) => {
  const router = useRouter();

  const [user, setUser] = useAtom(userAtom);

  const toggleFavoriteContact = () => {
    let updatedFavoriteUsers;

    if (isContactFavorite) {
      updatedFavoriteUsers = user.favoriteUsers.filter(
        (id) => id !== contact.uid
      );
    } else {
      updatedFavoriteUsers = [...user.favoriteUsers, contact.uid];
    }
    const updatedUser = {
      ...user,
      favoriteUsers: updatedFavoriteUsers,
    };

    setUser(updatedUser);

    openSwipeableRef.current.close();

    // TODO: FIRESTORE UPDATEEE FIX THISSS
    // setUser((prev) =>
    //   prev.map((c) => (c.uid === updatedContact.uid ? updatedContact : c))
    // );
  };

  return (
    <View className="flex-row h-full">
      <TouchableOpacity
        className="w-20 bg-yellow-300 justify-center items-center"
        activeOpacity={0.6}
        onPress={toggleFavoriteContact}
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
