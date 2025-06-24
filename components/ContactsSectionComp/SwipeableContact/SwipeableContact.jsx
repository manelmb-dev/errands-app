import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

import { contactsAtom, themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import RenderRightActionsContact from "../../../Utils/RenderRightActionsContact";
import { themes } from "../../../constants/themes";

const SwipeableContact = ({ contact, openSwipeableRef, swipeableRefs }) => {
  const router = useRouter();

  const [theme] = useAtom(themeAtom);
  const [, setContacts] = useAtom(contactsAtom);

  const toggleFavorite = (id) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c))
    );
  };
  return (
    <Swipeable
      ref={(ref) => (swipeableRefs.current[contact.id] = ref)}
      renderRightActions={() => (
        <RenderRightActionsContact
          contact={contact}
          openSwipeableRef={openSwipeableRef}
        />
      )}
      onSwipeableOpenStartDrag={() => {
        if (
          openSwipeableRef.current &&
          openSwipeableRef.current !== swipeableRefs.current[contact.id]
        ) {
          openSwipeableRef.current.close();
        }
        openSwipeableRef.current = swipeableRefs.current[contact.id];
      }}
    >
      <Pressable
        className={`py-5 px-4 flex-row items-center justify-between bg-[${themes[theme].background}] border-b ${
          theme === "light" ? "border-gray-300" : "border-gray-700"
        }`}
        onPress={() => {
          router.push({
            pathname: `/Modals/contact-detail}`,
            params: contact,
          });
        }}
      >
        <View className="flex-col">
          <Text
            className="text-base font-semibold"
            style={{ color: themes[theme].text }}
          >
            {contact.name} {contact.surnames}
          </Text>
          {contact.alias ? (
            <Text className="text-xs" style={{ color: themes[theme].gray }}>
              @{contact.alias}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite(contact.id)}
          hitSlop={10}
        >
          <Ionicons
            name={contact.favorite ? "star" : "star-outline"}
            size={22}
            color={
              contact.favorite ? "#FFD700" : theme === "dark" ? "#fff" : "#000"
            }
          />
        </TouchableOpacity>
      </Pressable>
    </Swipeable>
  );
};

export default SwipeableContact;
