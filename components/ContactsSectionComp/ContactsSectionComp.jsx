import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, FlatList, TextInput } from "react-native";
import { useNavigation } from "expo-router";

import { contactsAtom, themeAtom, userAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import SwipeableContact from "./SwipeableContact/SwipeableContact";
import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const ContactsSectionComp = () => {
  const navigation = useNavigation();

  const swipeableRefs = useRef({});
  const openSwipeableRef = useRef(null);

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [contacts] = useAtom(contactsAtom);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("contacts"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  const filteredContacts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return contacts
      .filter((c) =>
        `${c.name} ${c.surnames} ${c.alias}`.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        if (
          user.favoriteUsers.includes(a.id) &&
          !user.favoriteUsers.includes(b.id)
        )
          return -1;
        if (
          !user.favoriteUsers.includes(a.id) &&
          user.favoriteUsers.includes(b.id)
        )
          return 1;
        return a.name.localeCompare(b.name);
      });
  }, [contacts, searchQuery, user]);

  return (
    <View className={`flex-1 bg-[${themes[theme].background}]`}>
      <View
        className={`mx-4 px-3 my-3 flex-row items-center rounded-xl border ${
          theme === "light"
            ? "border-gray-300 bg-gray-100"
            : "border-gray-700 bg-gray-800"
        }`}
      >
        <Ionicons
          name="search"
          size={20}
          color={themes[theme].iconColor}
          className="mr-2"
        />
        <TextInput
          placeholder={i18n.t("searchContact")}
          placeholderTextColor={themes[theme].taskSecondText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 h-14 text-xl leading-tight"
          style={{ color: themes[theme].text }}
        />
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableContact
            contact={item}
            openSwipeableRef={openSwipeableRef}
            swipeableRefs={swipeableRefs}
          />
        )}
      />
    </View>
  );
};

export default ContactsSectionComp;
