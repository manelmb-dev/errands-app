import { View, Text, Modal, Pressable } from "react-native";
import { router } from "expo-router";

import { themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";

const SettingsMainModal = ({
  modalSettingsVisible,
  setModalSettingsVisible,
  toggleTheme,
}) => {
  const [theme] = useAtom(themeAtom);

  return (
    <Modal
      visible={modalSettingsVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModalSettingsVisible(false)}
    >
      {/* Full view 50% obscure */}
      <View className="flex-1 bg-black/50">
        <Pressable
          className="flex-1"
          onPress={() => setModalSettingsVisible(false)}
        />
        <View
          className={`absolute top-28 right-5 bg-[${themes[theme].buttonMenuBackground}] rounded-2xl w-[70%] shadow-2xl`}
        >
          {/* Opción: Contactos */}
          <Pressable
            onPress={() => {
              setModalSettingsVisible(false);
              router.push("/contacts");
            }}
          >
            <Text className={`text-lg text-[${themes[theme].text}] py-2 pl-4`}>
              Contactos
            </Text>
          </Pressable>

          {/* Opción: Configuración */}
          <Pressable onPress={() => setModalSettingsVisible(false)}>
            <Text className={`text-lg text-[${themes[theme].text}] py-2 pl-4`}>
              Configuración
            </Text>
          </Pressable>

          {/* Opción: Mi cuenta */}
          <Pressable onPress={() => setModalSettingsVisible(false)}>
            <Text className={`text-lg text-[${themes[theme].text}] py-2 pl-4`}>
              Mi cuenta
            </Text>
          </Pressable>

          {/* Opción: Cambio de tema */}
          <Pressable onPress={toggleTheme}>
            <Text className={`text-lg text-[${themes[theme].text}] py-2 pl-4`}>
              Light/Dark
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default SettingsMainModal;
