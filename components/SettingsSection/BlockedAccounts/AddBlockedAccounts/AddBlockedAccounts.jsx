import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  FlatList,
  Alert,
} from "react-native";

import {
  contactsAtom,
  userAtom,
} from "../../../../constants/storeAtoms";
import { themeAtom } from "../../../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import { Ionicons } from "@expo/vector-icons";

import { themes } from "../../../../constants/themes";
import i18n from "../../../../constants/i18n";

const AddBlockedAccounts = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [theme] = useAtom(themeAtom);
  const [contacts] = useAtom(contactsAtom);
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: i18n.t("blockAnAccount"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerBackTitle: i18n.t("back"),
      headerShadowVisible: true,
      headerSearchBarOptions: null,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme, router]);

  const unBlockedContacts = contacts.filter(
    (c) => !user.blockedUsers.includes(c.id)
  );

  const blockUser = (accountId) => {
    setUser((prev) => ({
      ...prev,
      blockedUsers: [...prev.blockedUsers, accountId],
      favoriteUsers: prev.favoriteUsers.filter((id) => id !== accountId),
    }));

    navigation.goBack();

    // UPDATEEEE FIXXX THISSS FIRESTONEEE
  };

  const confirmBlockContact = (contact) => {
    Alert.alert(
      `${i18n.t("blockUserQuestion")} ${contact.name}${contact.surname ? ` ${contact.surname}` : ""}?`,
      `${i18n.t("blockUserText")}`,
      [
        { text: i18n.t("cancel") },
        {
          text: i18n.t("block"),
          onPress: () => blockUser(contact.id),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View className={`flex-1 py-4 bg-[${themes[theme].background}]`}>
      <FlatList
        data={unBlockedContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            className={`w-full py-2.5 px-4 flex-row items-center justify-between bg-[${themes[theme].background}] border-b border-[${themes[theme].borderColor}]`}
            onPress={() => {
              router.push({
                pathname: `/contactProfileScreen`,
                params: { contact: JSON.stringify(item) },
              });
            }}
          >
            <View className="mr-3 flex-1 flex-row items-center gap-3">
              <Ionicons
                name="person-circle-outline"
                size={46}
                color={themes[theme].taskSecondText}
              />
              <View className="flex-1">
                <Text
                  className={`text-lg font-semibold text-[${themes[theme].text}]`}
                  numberOfLines={1}
                >
                  {item.name} {item.surname}
                </Text>
                {item.username && (
                  <Text
                    className={`text-base text-[${themes[theme].taskSecondText}]`}
                    numberOfLines={1}
                  >
                    {item.username}
                  </Text>
                )}
              </View>
            </View>

            {/* Block button */}
            <TouchableOpacity
              className={`py-2.5 px-6 ${theme === "light" ? "bg-gray-300" : "bg-gray-600"} rounded-xl`}
              onPress={() => confirmBlockContact(item)}
              activeOpacity={0.7}
            >
              <Text className={`text-[${themes[theme].text}] font-semibold`}>
                {i18n.t("block")}
              </Text>
            </TouchableOpacity>
          </Pressable>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 mt-14 justify-center items-center">
            <Text
              className={`text-[${themes[theme].text}] text-lg font-semibold`}
            >
              {i18n.t("noBlockedAccounts")}
            </Text>
          </View>
        )}
      />
    </View>
  );
};
export default AddBlockedAccounts;
