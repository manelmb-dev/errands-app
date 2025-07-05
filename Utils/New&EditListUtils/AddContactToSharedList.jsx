import { View, Text, Pressable, ScrollView, FlatList } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "expo-router";

import {
  contactsAtom,
  themeAtom,
  userAtom,
  usersSharedWithAtom,
} from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";
import addContactToSharedList from "../../app/Modals/addContactToSharedListModal";
const AddContactToSharedList = () => {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [contacts] = useAtom(contactsAtom);
  const [theme] = useAtom(themeAtom);
  const [usersSharedWith, setUsersSharedWith] = useAtom(usersSharedWithAtom);

  const [contactSearchedInput, setContactSearchedInput] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  const handleOk = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("shareList"),
      presentation: "modal",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: {
        placeholder: i18n.t("search"),
        onChangeText: (event) => {
          setContactSearchedInput(event.nativeEvent.text.replace(/\s+/g, ""));
        },
      },
      headerLeft: () => null,
      headerRight: () => (
        <Pressable onPress={handleOk}>
          <Text
            className={`text-2xl font-semibold text-[${themes[theme].blueHeadText}]`}
          >
            {i18n.t("save")}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, theme, contactSearchedInput, handleOk]);

  const sharedUsers = useMemo(
    () => contacts.filter((c) => usersSharedWith.includes(c.id)),
    [contacts, usersSharedWith]
  );

  const filteredUsersNotInSharedList = useMemo(
    () =>
      contacts.filter(
        (c) =>
          !usersSharedWith.includes(c.id) &&
          (c.name + c.surname)
            .toLowerCase()
            .includes(contactSearchedInput.toLowerCase().trim())
      ),
    [contacts, usersSharedWith, contactSearchedInput]
  );

  const toggleUser = (id) => {
    setUsersSharedWith((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const renderContactItem = ({ item, isShared }) => (
    <View className="px-3 py-1 flex-row justify-between items-center">
      <View className="flex-row items-center gap-3">
        {/* FIX THISSSS if the contact has no image, show the default icon */}
        <Ionicons
          name="person-circle-outline"
          size={36}
          color={themes["light"].taskSecondText}
        />
        <Text className={`text-lg text-[${themes[theme].text}]`}>
          {item.name} {item.surname}
        </Text>
      </View>
      <Octicons
        onPress={() => toggleUser(item.id)}
        hitSlop={8}
        className="px-3"
        name={isShared ? "check-circle-fill" : "circle"}
        size={20}
        color={isShared ? themes[theme].text : themes[theme].taskSecondText}
      />
    </View>
  );

  return (
    <FlatList
      className={`flex-1 bg-[${themes[theme].background}]`}
      ListHeaderComponent={
        <>
          <Text
            className={`p-4 text-base font-semibold text-[${themes[theme].text}]`}
          >
            {i18n.t("sharedWith")}
          </Text>
          {sharedUsers.map((contact) => (
            <View key={contact.id}>
              {renderContactItem({ item: contact, isShared: true })}
            </View>
          ))}
          <Text
            className={`p-4 text-base font-semibold text-[${themes[theme].text}]`}
          >
            {i18n.t("addContact")}
          </Text>
        </>
      }
      data={filteredUsersNotInSharedList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => renderContactItem({ item, isShared: false })}
      contentContainerStyle={{ paddingBottom: 40, paddingTop: 100 }}
      keyboardShouldPersistTaps="handled"
    />
  );
};
export default AddContactToSharedList;
