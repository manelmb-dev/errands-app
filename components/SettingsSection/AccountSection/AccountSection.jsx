import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";

import { themeAtom } from "../../../constants/storeUiAtoms";
import { userAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

const AccountSection = () => {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);
  const [user] = useAtom(userAtom);

  // const [recoveryEmail, setRecoveryEmail] = useState(user.email ?? "");

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: i18n.t("account"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: true,
      headerSearchBarOptions: null,
      headerBackTitleVisible: false,
    });
  }, [navigation, theme]);

  // const confirmSaveRecoveryEmail = () => {
  //   Alert.alert(i18n.t("saveChanges"), i18n.t("confirmSaveRecoveryEmail"), [
  //     { text: i18n.t("cancel"), style: "cancel" },
  //     {
  //       text: i18n.t("save"),
  //       onPress: () => {
  //         console.log("SAVE RECOVERY EMAIL:", recoveryEmail);
  //         // TODO: update firestore
  //       },
  //     },
  //   ]);
  // };

  const handleDeleteAccount = () => {
    Alert.alert(i18n.t("deleteAccount"), i18n.t("confirmDeleteAccount"), [
      { text: i18n.t("cancel"), style: "cancel" },
      {
        text: i18n.t("delete"),
        style: "destructive",
        onPress: () => {
          console.log("DELETE ACCOUNT");
          // TODO: delete account flow
        },
      },
    ]);
  };

  return (
    <View className={`flex-1 px-6 py-4 bg-[${themes[theme].background}]`}>
      {/* Account info */}
      <View className="gap-6">
        <View
          className={`bg-[${themes[theme].surfaceBackground}] rounded-xl border border-[${themes[theme].borderColor}]`}
        >
          <Text
            className={`p-4 text-lg text-[${themes[theme].taskSecondText}]`}
          >
            {i18n.t("accountInfo")}
          </Text>

          {/* Phone number */}
          <View className={`border-t border-[${themes[theme].borderColor}]`}>
            <Text className={`p-4 text-lg text-[${themes[theme].text}]`}>
              {i18n.t("phoneNumber")}
            </Text>
            <Text
              className={`px-4 pb-4 text-lg font-medium text-[${themes[theme].taskSecondText}]`}
            >
              {user.phoneNumber}
            </Text>
          </View>

          {/* Recovery email */}
          <View className={`border-t border-[${themes[theme].borderColor}]`}>
            <Text className={`p-4 text-lg text-[${themes[theme].text}]`}>
              {i18n.t("email")}
            </Text>
            <Text className={`px-4 pb-4 text-lg text-[${themes[theme].text}]`}>
              {user.email ? `${user.email}` : `${i18n.t("noUserEmail")}`}
            </Text>
            {/* <TextInput
              className={`px-4 pb-4 text-lg text-[${themes[theme].text}]`}
              placeholder={i18n.t("addRecoveryEmail")}
              placeholderTextColor={themes[theme].taskSecondText}
              value={recoveryEmail}
              onChangeText={setRecoveryEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            /> */}
          </View>
        </View>

        {/* Security info */}
        <View
          className={`bg-[${themes[theme].surfaceBackground}] rounded-xl border border-[${themes[theme].borderColor}]`}
        >
          <Text
            className={`p-4 text-base text-[${themes[theme].taskSecondText}]`}
          >
            {i18n.t("accountSecurityInfo")}
          </Text>
          <Text className={`px-4 pb-4 text-lg text-[${themes[theme].text}]`}>
            {i18n.t("accountSecurityDescription")}
          </Text>
        </View>

        {/* Save button */}
        {/* <TouchableOpacity
            onPress={confirmSaveRecoveryEmail}
            className="rounded-xl bg-blue-600 p-4"
          >
            <Text className="text-white text-center text-lg font-semibold">
              {i18n.t("saveChanges")}
            </Text>
          </TouchableOpacity> */}

        {/* Delete account button */}
        <TouchableOpacity
          activeOpacity={100}
          className={`mt-4 rounded-xl opacity-80 border-hairline ${theme === "light" ? "border-red-500 bg-red-200" : "border-red-300 bg-red-950"}`}
          onPress={handleDeleteAccount}
        >
          <Text className="p-5 text-xl text-red-500 text-center">
            {i18n.t("deleteAccount")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountSection;
