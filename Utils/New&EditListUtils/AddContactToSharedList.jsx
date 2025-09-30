import { View, Text, Pressable, FlatList, Image } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "expo-router";

import {
  contactsAtom,
  currentListAtom,
  themeAtom,
  userAtom,
  usersSharedWithAtom,
} from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const AddContactToSharedList = () => {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [contacts] = useAtom(contactsAtom);
  const [, setCurrentList] = useAtom(currentListAtom);
  const [usersSharedWith, setUsersSharedWith] = useAtom(usersSharedWithAtom);

  const [contactSearchedInput, setContactSearchedInput] = useState("");

  const sortByFavoriteAndNameSurname = (a, b) => {
    if (user.favoriteUsers.includes(a.id) && !user.favoriteUsers.includes(b.id))
      return -1;
    if (!user.favoriteUsers.includes(a.id) && user.favoriteUsers.includes(b.id))
      return 1;

    const fullNameA = `${a.name ?? ""}${a.surname ?? ""}`.toLowerCase();
    const fullNameB = `${b.name ?? ""}${b.surname ?? ""}`.toLowerCase();
    return fullNameA.localeCompare(fullNameB);
  };

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
  }, [navigation, theme, handleOk]);

  const sharedUsers = useMemo(
    () =>
      contacts
        .filter((c) => usersSharedWith.includes(c.id))
        .sort(sortByFavoriteAndNameSurname),
    [contacts, usersSharedWith]
  );

  const filteredUsersNotInSharedList = useMemo(
    () =>
      contacts
        .filter(
          (c) =>
            !usersSharedWith.includes(c.id) &&
            (c.name + c.surname)
              .toLowerCase()
              .includes(contactSearchedInput.toLowerCase().trim())
        )
        .sort(sortByFavoriteAndNameSurname),
    [contacts, usersSharedWith, contactSearchedInput]
  );

  const toggleUser = (userId) => {
    setUsersSharedWith((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
    setCurrentList((prev) => ({
      ...prev,
      usersShared: prev.usersShared.includes(userId)
        ? prev.usersShared.filter((id) => id !== userId)
        : [...prev.usersShared, userId],
    }));
  };

  const renderContactItem = ({ item, isShared }) => (
    <View className="px-3 py-1 flex-row justify-between items-center">
      <View className="flex-row items-center gap-3">
        {/* FIX THISSSS if the contact has no image, show the default icon */}
        {item.photoUrl ? (
          <Image
            source={{ uri: item.photoUrl }}
            className="w-9 h-9 rounded-full"
          />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={36}
            color={themes["light"].taskSecondText}
          />
        )}
        <Text className={`text-lg text-[${themes[theme].text}]`}>
          {item.name} {item.surname}
        </Text>
      </View>
      <View className="mr-3 flex-row items-center gap-4">
        {user.favoriteUsers.includes(item.id) && (
          <Octicons name="star-fill" size={20} color="#FFD700" />
        )}
        <Pressable onPress={() => toggleUser(item.id)} hitSlop={8}>
          <Octicons
            name={isShared ? "check-circle-fill" : "circle"}
            size={20}
            color={isShared ? themes[theme].text : themes[theme].taskSecondText}
          />
        </Pressable>
      </View>
    </View>
  );

  return (
    <FlatList
      className={`flex-1 bg-[${themes[theme].background}]`}
      ListHeaderComponent={
        <View>
          {sharedUsers.length !== 0 && (
            <Text
              className={`p-4 text-base font-semibold text-[${themes[theme].text}]`}
            >
              {i18n.t("sharedWith")}
            </Text>
          )}
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
        </View>
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
