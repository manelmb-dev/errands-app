import { useNavigation, useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";

import { themeAtom, userAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

function SettingsSection() {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);
  const [user, setUser] = useAtom(userAtom);

  const [formData, setFormData] = useState(user);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: i18n.t("profile"),
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

  const handleSave = () => {
    // Aquí luego llamarás a tu función de Firestore
    console.log("Guardar en DB:", formData);
    setUser(formData);
  };

  return (
    <View className={`mx-6 py-4 bg-[${themes[theme].background}]`}>
      {/* Header perfil */}
      <View
        className={`flex-1 p-4 items-center gap-4 bg-[${themes[theme].buttonMenuBackground}]`}
      >
        <TouchableOpacity
          className="h-20"
          onPress={() => console.log("Cambiar foto")}
        >
          {formData.photoURL ? (
            <Image
              source={{ uri: formData.photoURL }}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={70}
              color={themes[theme].iconColor}
            />
          )}
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-black">
            {formData.name} {formData.surname}
          </Text>
          <Text className="text-gray-500">@{formData.username}</Text>
        </View>
      </View>

      {/* Formulario */}
      <View className="gap-4">
        <TextInput
          className="border-b pb-2"
          placeholder="Nombre"
          value={formData.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        <TextInput
          className="border-b pb-2"
          placeholder="Apellidos"
          value={formData.surname}
          onChangeText={(text) => handleChange("surname", text)}
        />
        <TextInput
          className="border-b pb-2"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChangeText={(text) => handleChange("username", text)}
        />
        <TextInput
          className="border-b pb-2"
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />
      </View>

      {/* Botón guardar */}
      <View className="p-6 mt-6">
        <TouchableOpacity
          onPress={handleSave}
          className="bg-blue-600 rounded-xl py-3"
        >
          <Text className="text-white text-center text-lg font-semibold">
            {i18n.t("saveChanges")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SettingsSection;
