import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

import { themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";

import RenderRightActionsContact from "../../../Utils/RenderRightActionsContact";
import { themes } from "../../../constants/themes";

const SwipeableContact = ({ contact, openSwipeableRef, swipeableRefs }) => {
  const router = useRouter();

  const [theme] = useAtom(themeAtom);

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
        className={`py-2.5 px-4 flex-row items-center justify-between bg-[${themes[theme].background}] border-b ${
          theme === "light" ? "border-gray-300" : "border-gray-700"
        }`}
        onPress={() => {
          if (
            openSwipeableRef.current &&
            openSwipeableRef.current !== swipeableRefs.current[contact.id]
          ) {
            openSwipeableRef.current.close();
            openSwipeableRef.current = null;
            return;
          }
          router.push({
            pathname: `/contactProfileScreen`,
            params: { contact: JSON.stringify(contact) },
          });
        }}
      >
        <View className="flex-row items-center gap-3">
          <Ionicons
            name="person-circle-outline"
            size={46}
            color={themes["light"].taskSecondText}
          />
          <Text
            className="text-lg font-semibold"
            style={{ color: themes[theme].text }}
          >
            {contact.name} {contact.surname}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          {contact.blocked && (
            <Feather name="user-x" size={25} color="#dc2626" />
          )}
          {contact.favorite && (
            <Octicons name="star-fill" size={25} color="#FFD700" />
          )}
        </View>
      </Pressable>
    </Swipeable>
  );
};

export default SwipeableContact;
