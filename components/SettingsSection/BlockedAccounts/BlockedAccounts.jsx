import { useNavigation, useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect } from "react";

import {
  contactsAtom,
  languageAtom,
  themeAtom,
  userAtom,
} from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

const BlockedAccounts = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [theme] = useAtom(themeAtom);
  const [lang] = useAtom(languageAtom);
  const [contacts] = useAtom(contactsAtom);
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: i18n.t("blockedAccounts"),
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: true,
      headerLeft: () => null,
      headerRight: () => (
        <Ionicons
          name="add"
          color={themes[theme].blueHeadText}
          size={24}
          onPress={() => router.push("/Settings/addBlockedAccounts")}
        />
      ),
    });
  }, [navigation, theme, router]);

  const blockedContacts = contacts.filter((c) =>
    user.blockedUsers.includes(c.id)
  );

  const unblockAccount = (accountId) => {
    const updatedBlockedUsers = user.blockedUsers.filter(
      (id) => id !== accountId
    );

    setUser((prev) => {
      return {
        ...prev,
        blockedUsers: updatedBlockedUsers,
      };
    });
  };

  const confirmUnblockAccount = (account) => {
    Alert.alert(
      `${lang === "es" ? "¿" : ""}${i18n.t("unblock")} ${account.name}${account.surname ? ` ${account.surname}` : ""}${account.username ? ` (@${account.username})` : ""}?`,
      `${i18n.t("unblockText")}`,
      [
        { text: i18n.t("cancel") },
        {
          text: i18n.t("unblock"),
          onPress: () => unblockAccount(account.id),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View className={`flex-1 py-4 bg-[${themes[theme].background}]`}>
      <FlatList
        data={blockedContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            className={`w-full py-2.5 px-4 flex-row items-center justify-between bg-[${themes[theme].background}] border-b ${
              theme === "light" ? "border-gray-300" : "border-gray-700"
            }`}
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

            {/* Unblock button */}
            <TouchableOpacity
              className={`py-2.5 px-4 bg-[${themes[theme].blueHeadText}] rounded-xl`}
              onPress={() => confirmUnblockAccount(item)}
              activeOpacity={0.7}
            >
              <Text className={`text-[${themes["dark"].text}] font-semibold`}>
                {i18n.t("unblock")}
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

export default BlockedAccounts;
