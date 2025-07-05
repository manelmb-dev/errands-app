import {
  Pressable,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

import {
  contactsAtom,
  themeAtom,
  userAtom,
  usersSharedWithAtom,
} from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";
import { useRouter } from "expo-router";

const UsersOfList = ({ listOwner }) => {
  const router = useRouter();

  const [user] = useAtom(userAtom);
  const [contacts] = useAtom(contactsAtom);
  const [theme] = useAtom(themeAtom);
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
  };

  console.log("usersSharedWith", usersSharedWith);

  return (
    <ScrollView
      contentContainerStyle={{
        borderBottomColor: themes[theme].borderColor,
        borderBottomWidth: 1,
      }}
    >
      <View className={`flex-1 bg-[${themes[theme].buttonMenuBackground}]`}>
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
          {listOwner === user.id && (
            <Text
              className={`mr-2 text-base text-[${themes[theme].taskSecondText}]`}
            >
              {i18n.t("owner")}
            </Text>
          )}
        </View>

        {/* Display the shared users */}
        {sharedUsers.map((contact) => (
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
            {listOwner === user.id && (
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
            {listOwner === contact.id && (
              <Text
                className={`mr-2 text-base text-[${themes[theme].taskSecondText}]`}
              >
                {i18n.t("owner")}
              </Text>
            )}
          </View>
        ))}

        {listOwner === user.id && (
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
        {/* Add user button */}
      </View>
    </ScrollView>
  );
};

export default UsersOfList;
