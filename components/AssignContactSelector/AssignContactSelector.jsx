import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "expo-router";

import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import { useAtom } from "jotai";
import {
  contactsAtom,
  listAssignedAtom,
  listsAtom,
  themeAtom,
  userAssignedAtom,
  userAtom,
} from "../../constants/storeAtoms";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const sortByName = (a, b) =>
  a.name.localeCompare(b.name) || a.surname?.localeCompare(b.surname);

const AssignContactSelector = () => {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [contacts] = useAtom(contactsAtom);
  const [lists] = useAtom(listsAtom);
  const [userAssigned, setUserAssigned] = useAtom(userAssignedAtom);
  const [listAssigned, setListAssigned] = useAtom(listAssignedAtom);
  const [theme] = useAtom(themeAtom);

  const [contactSearchedInput, setContactSearchedInput] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("assignErrand"),
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
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Text className={`text-2xl text-[${themes[theme].blueHeadText}]`}>
            {i18n.t("cancel")}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, theme, contactSearchedInput]);

  const sortedContacts = useMemo(() => {
    // If list is not shared
    if (listAssigned.usersShared.length === 1) {
      return [
        { ...user },
        ...contacts
          .filter((c) => user.favoriteUsers.includes(c.id))
          .sort(sortByName),
        ...contacts
          .filter((c) => !user.favoriteUsers.includes(c.id))
          .sort(sortByName),
      ];
    }

    // If list is shared
    if (listAssigned.usersShared.length !== 1) {
      return [
        { id: "unassigned", name: i18n.t("unassigned") },
        { ...user },
        ...contacts
          .filter(
            (c) =>
              listAssigned.usersShared.includes(c.id) &&
              user.favoriteUsers.includes(c.id),
          )
          .sort(sortByName),
        ...contacts
          .filter(
            (c) =>
              listAssigned.usersShared.includes(c.id) &&
              !user.favoriteUsers.includes(c.id),
          )
          .sort(sortByName),
        // FIX THISSSS Below: contacts will have to be users
        ...contacts
          .filter(
            (c) =>
              listAssigned.usersShared.includes(c.id) &&
              !contacts.some((existing) => existing.id === c.id) &&
              c.id !== user.id,
          )
          .sort(sortByName),
      ];
    }
  }, [contacts, user, listAssigned.usersShared]);

  useEffect(() => {
    setFilteredContacts(
      sortedContacts.filter((contact) => {
        const fullName =
          contact.name + (contact.surname ? " " + contact.surname : "");
        return fullName
          .toLowerCase()
          .includes(contactSearchedInput.toLowerCase());
      }),
    );
  }, [contactSearchedInput, sortedContacts]);

  return (
    <SafeAreaProvider className={`flex-1 bg-[${themes[theme].background}]`}>
      <Text
        className={`py-5 text-lg font-bold text-center text-[${themes[theme].text}]  ${theme === "light" ? "bg-blue-300" : "bg-blue-700"}`}
      >
        {userAssigned.id === user.id
          ? i18n.t("errandForMe")
          : userAssigned.name +
            (userAssigned.surname ? ` ${userAssigned.surname}` : "")}
      </Text>
      {filteredContacts.length > 0 && (
        <Text
          className={`m-3 ml-5 text-lg text-[${themes[theme].text}] font-bold`}
        >
          {i18n.t("selectContact")}
        </Text>
      )}

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="pt-12 items-center">
            <Text className={`text-[${themes[theme].taskSecondText}] text-xl`}>
              {i18n.t("noContacts")}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`h-16 border-b border-[${themes[theme].borderColor}]`}
            underlayColor={themes[theme].background}
            onPress={() => {
              // If assigned list is unassigned, current user assigned is not the user and the user presses on self the assigned list will be the first user list
              if (
                item.id === user.id &&
                userAssigned.id !== user.id &&
                listAssigned.id === "unassigned"
              ) {
                setUserAssigned(item);
                setListAssigned(lists[0]);
              }
              // If assigned list is a shared list, current user assigned is not the user and the user presses on self only will change the user assigned
              else if (
                item.id === user.id &&
                userAssigned.id !== user.id &&
                listAssigned.usersShared.length !== 1
              ) {
                setUserAssigned(item);
              }
              // If assigned list is NOT a shared list, the user presses on a contact the user assgined will be the contact selected and the list assigned will be the general shared list
              else if (
                item.id !== user.id &&
                listAssigned.usersShared.length === 1
              ) {
                setUserAssigned(item);
                setListAssigned({
                  id: "unassigned",
                  title: i18n.t("shared"),
                  usersShared: [user.id],
                });
              }
              // If assigned list is a shared list, the user presses on a contact only the user assgined will be changed for the contact selected
              else if (
                item.id !== user.id &&
                listAssigned.usersShared.length !== 1
              ) {
                setUserAssigned(item);
              }
              navigation.goBack();
            }}
          >
            <View
              className={`h-full px-4 flex-row gap-5 items-center ${
                userAssigned.id === item.id &&
                `${theme === "light" ? "bg-slate-300" : "bg-gray-800"}`
              }`}
            >
              {/* Add profile photo below */}
              <Ionicons
                name="person-circle-outline"
                size={38}
                color={themes["light"].taskSecondText}
              />
              <View className="flex-1 flex-row justify-between">
                <Text className={`text-lg text-[${themes[theme].text}]`}>
                  {item.name} {item.surname}{" "}
                  {item.id === user.id && `(${i18n.t("me")})`}
                </Text>
                <View className="flex-row gap-4">
                  {userAssigned.id === item.id && (
                    <FontAwesome6
                      name="check"
                      size={22}
                      color={themes["light"].blueHeadText}
                    />
                  )}
                  {user.favoriteUsers.includes(item.id) && (
                    <Octicons name="star-fill" size={25} color="#FFD700" />
                  )}
                  {item.id === user.id && (
                    <Feather name="user" size={25} color={themes[theme].text} />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaProvider>
  );
};

export default AssignContactSelector;
