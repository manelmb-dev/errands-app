import { ScrollView, Text, View } from "react-native";

import {
  contactsAtom,
  themeAtom,
  userAtom,
  usersSharedWithAtom,
} from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

const sortByNameSurname = (a, b) => {
  const fullNameA = `${a.name ?? ""}${a.surname ?? ""}`.toLowerCase();
  const fullNameB = `${b.name ?? ""}${b.surname ?? ""}`.toLowerCase();
  return fullNameA.localeCompare(fullNameB);
};

const ListSharedUsers = ({ listOwner }) => {
  const [user] = useAtom(userAtom);
  const [contacts] = useAtom(contactsAtom);
  const [theme] = useAtom(themeAtom);
  const [usersSharedWith] = useAtom(usersSharedWithAtom);

  const sharedUsers = usersSharedWith.map((userId) => {
    const contact = contacts.find((c) => c.id === userId);
    if (contact)
      return { id: userId, name: contact.name, surname: contact.surname };
    // FIX THISSSS Below: contacts will have to be replaced for users collection
    const unknownContact = contacts.find((c) => c.id === userId);
    if (unknownContact) return { id: userId, name: unknownContact.username };
  });

  return (
    <ScrollView
      contentContainerStyle={{
        borderBottomColor: themes[theme].borderColor,
        borderBottomWidth: 1,
      }}
    >
      <View className={`flex-1 bg-[${themes[theme].background}]`}>
        {/* Display the current user at the top */}
        <View
          key={user.id}
          className="px-3.5 py-2 flex-row justify-between items-center"
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
          {listOwner === user.id && (
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
            className="px-3.5 py-2 flex-row justify-between items-center"
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
            {listOwner === contact.id && (
              <Text
                className={`mr-2 text-base text-[${themes[theme].taskSecondText}]`}
              >
                {i18n.t("owner")}
              </Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ListSharedUsers;
