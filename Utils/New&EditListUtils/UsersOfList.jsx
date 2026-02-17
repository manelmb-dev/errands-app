import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

import {
  usersSharedWithAtom,
  currentListAtom,
  contactsAtom,
  userAtom,
} from "../../constants/storeAtoms";
import { useAtom } from "jotai";
import { themeAtom } from "../../constants/storeUiAtoms";

import { Ionicons } from "@expo/vector-icons";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const sortByNameSurname = (a, b) => {
  const fullNameA = `${a.name ?? ""}${a.surname ?? ""}`.toLowerCase();
  const fullNameB = `${b.name ?? ""}${b.surname ?? ""}`.toLowerCase();
  return fullNameA.localeCompare(fullNameB);
};

const UsersOfList = () => {
  const router = useRouter();

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [contacts] = useAtom(contactsAtom);
  const [currentList, setCurrentList] = useAtom(currentListAtom);
  const [usersSharedWith, setUsersSharedWith] = useAtom(usersSharedWithAtom);

  const sharedUsers = usersSharedWith.map((userId) => {
    const contact = contacts.find((c) => c.id === userId);
    if (contact)
      return { id: userId, name: contact.name, surname: contact.surname };
    // FIX THISSSS Below: contacts will have to be replaced for users collection
    const unknownContact = contacts.find((c) => c.id === userId);
    if (unknownContact) return { id: userId, name: unknownContact.username };
  });

  const removeUserFromShared = (userId) => {
    setUsersSharedWith((prev) => prev.filter((id) => id !== userId));
    setCurrentList((prev) => ({
      ...prev,
      usersShared: prev.usersShared.includes(userId)
        ? prev.usersShared.filter((id) => id !== userId)
        : [...prev.usersShared, userId],
    }));
  };

  return (
    <ScrollView
      contentContainerStyle={{
        borderBottomColor: themes[theme].borderColor,
        borderBottomWidth: 1,
      }}
    >
      <View className={`flex-1 bg-[${themes[theme].surfaceBackground}]`}>
        {/* Display the current user at the top */}
        <View
          key={user.id}
          className="px-3 py-1 flex-row justify-between items-center"
        >
          <View className="flex-row items-center gap-3">
            {/* If there is no picture, show the default icon */}
            <Ionicons
              name="person-circle-outline"
              size={36}
              color={themes["light"].taskSecondText}
            />
            <Text className={`text-lg text-[${themes[theme].text}]`}>
              {user.name} {user.surname}
            </Text>
          </View>
          {currentList.ownerId === user.id && (
            <Text
              className={`mr-2 text-base text-[${themes[theme].taskSecondText}]`}
            >
              {i18n.t("owner")}
            </Text>
          )}
        </View>

        {/* Display the shared users */}
        {sharedUsers.sort(sortByNameSurname).map((contact) => (
          <View
            key={contact.id}
            className="px-3 py-1 flex-row justify-between items-center"
          >
            <View className="flex-row items-center gap-3">
              {/* If there is no picture, show the default icon */}
              <Ionicons
                name="person-circle-outline"
                size={36}
                color={themes["light"].taskSecondText}
              />
              <Text className={`text-lg text-[${themes[theme].text}]`}>
                {contact.name} {contact.surname || ""}
              </Text>
            </View>
            {currentList.ownerId === user.id && (
              <Pressable
                onPress={() => removeUserFromShared(contact.id)}
                hitSlop={3}
              >
                <Ionicons
                  className="mr-1.5"
                  name="close-outline"
                  size={22}
                  color={themes["light"].taskSecondText}
                />
              </Pressable>
            )}
            {currentList.ownerId === contact.id && (
              <Text
                className={`mr-2 text-base text-[${themes[theme].taskSecondText}]`}
              >
                {i18n.t("owner")}
              </Text>
            )}
          </View>
        ))}

        {/* Add user button */}
        {currentList.ownerId === user.id && (
          <View>
            <TouchableHighlight
              underlayColor={themes[theme].borderColor}
              onPress={() => {
                router.push("/Modals/addContactToSharedListModal");
              }}
            >
              <View className={`px-3 py-1 flex-row items-center gap-3`}>
                <Ionicons
                  name="add-circle-outline"
                  size={36}
                  color={themes["light"].taskSecondText}
                />
                <Text className={`text-lg text-[${themes[theme].text}]`}>
                  {i18n.t("addUser")}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default UsersOfList;
