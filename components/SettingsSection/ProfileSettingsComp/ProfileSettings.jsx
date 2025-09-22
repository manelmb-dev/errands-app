import { useNavigation } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";

import { themeAtom, userAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";
import users from "../../../users";

function SettingsSection() {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);
  const [user, setUser] = useAtom(userAtom);

  const [formData, setFormData] = useState(user);

  const [usernameTaken, setUsernameTaken] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: i18n.t("profile"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerBackTitleVisible: false,
      headerShadowVisible: true,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeUsername = async (text) => {
    const lowerCaseUsername = text.trim().toLowerCase();
    setFormData((prev) => ({ ...prev, username: lowerCaseUsername }));

    if (!lowerCaseUsername) {
      setUsernameTaken(false);
      return;
    }

    try {
      // const usersRef = collection(db, "users");
      // const q = query(usersRef, where("username", "==", text));
      // const querySnapshot = await getDocs(q);

      // const isTaken = querySnapshot.docs.some((doc) => doc.id !== user.id);

      const isTaken = users.some(
        (doc) =>
          doc.username.toLowerCase() === lowerCaseUsername &&
          doc.id !== formData.id,
      );

      setUsernameTaken(isTaken);
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameTaken(false);
    }
  };

  const handleSave = () => {
    // FIRESTONEEEE Update
    console.log("Guardar en DB:", formData);
    setUser(formData);
  };

  const confirmChangesAlert = () => {
    Alert.alert(i18n.t("saveChanges"), i18n.t("confirmSaveChanges"), [
      { text: i18n.t("cancel"), style: "cancel" },
      {
        text: i18n.t("save"),
        style: "default",
        onPress: handleSave,
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(i18n.t("deleteAccount"), i18n.t("confirmDeleteAccount"), [
      { text: i18n.t("cancel"), style: "cancel" },
      {
        text: i18n.t("delete"),
        style: "destructive",
        onPress: () => console.log("Eliminar cuenta de Firestore UPDATEEEE"),
      },
    ]);
  };

  return (
    <View className={`h-full px-6 py-4 bg-[${themes[theme].background}] gap-6`}>
      {/* Header profile */}
      <View className={`flex items-center`}>
        <TouchableOpacity onPress={() => console.log("Cambiar foto UPDATEEE")}>
          {formData.photoURL ? (
            <Image
              source={{ uri: formData.photoURL }}
              className="h-24 rounded-full"
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={90}
              color={themes[theme].iconColor}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Cambiar foto UPDATEEE")}>
          <Text
            className={`text-lg font-semibold text-[${themes[theme].blueHeadText}]`}
          >
            {i18n.t("setNewPhoto")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      {/* Name & Surname */}
      <View className="gap-6">
        <View
          className={`bg-[${themes[theme].surfaceBackground}] rounded-xl border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
        >
          <TextInput
            className={`p-5 text-lg leading-tight text-[${themes[theme].text}] border-b border-[${themes[theme].borderColor}]`}
            placeholder={i18n.t("name")}
            placeholderTextColor="red"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          <TextInput
            className={`p-5 text-lg leading-tight text-[${themes[theme].text}]`}
            placeholder={i18n.t("surname")}
            placeholderTextColor="red"
            value={formData.surname.trim()}
            onChangeText={(text) => handleChange("surname", text)}
          />
        </View>

        {/* Birthdate, Email & Username */}
        <View>
          <View
            className={`bg-[${themes[theme].surfaceBackground}] rounded-xl border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
          >
            {/* <TextInput
              className={`p-5 text-lg leading-tight text-[${themes[theme].text}] border-b border-[${themes[theme].borderColor}]`}
              placeholder={i18n.t("birthdate")}
              placeholderTextColor={themes[theme].taskSecondText}
              value={formData.birthdate}
              onChangeText={(text) => handleChange("birthdate", text)}
            /> */}
            <Text
              className={`p-5 text-lg leading-tight text-[${themes[theme].text}] border-b border-[${themes[theme].borderColor}]`}
            >
              {formData.email}
            </Text>
            <TextInput
              className={`p-5 text-lg leading-tight text-[${themes[theme].text}]`}
              placeholder={i18n.t("username")}
              placeholderTextColor="red"
              value={formData.username}
              onChangeText={(text) => handleChangeUsername(text)}
              autoCapitalize="none"
            />
          </View>
          <Text className={`p-1 text-sm text-red-500`}>
            {usernameTaken ? i18n.t("usernameAlreadyTaken") : ""}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className={`mt-6 rounded-xl border-hairline ${theme === "light" ? "border-red-500 bg-red-100" : "border-red-300 bg-red-950 opacity-80"} `}
        onPress={handleDeleteAccount}
      >
        <Text className={`p-5 text-lg leading-tight text-red-500`}>
          {i18n.t("deleteAccount")}
        </Text>
      </TouchableOpacity>

      {/* Save changes button */}
      <TouchableOpacity
        onPress={confirmChangesAlert}
        className={`rounded-xl p-4 ${
          usernameTaken || !formData.name.trim() || !formData.surname.trim()
            ? "bg-gray-500"
            : "bg-blue-600"
        }`}
        disabled={
          usernameTaken || !formData.name.trim() || !formData.surname.trim()
        }
      >
        <Text className="text-white text-center text-xl font-semibold">
          {i18n.t("saveChanges")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default SettingsSection;
