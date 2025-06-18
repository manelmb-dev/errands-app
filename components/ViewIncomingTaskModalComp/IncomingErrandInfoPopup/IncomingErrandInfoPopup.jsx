import { Pressable, Text, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

import { themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../../constants/themes";

export default function IncomingErrandInfoPopup() {
  const [theme] = useAtom(themeAtom);

  return (
    <Menu>
      <MenuTrigger>
        <Pressable className="px-4 py-3">
          <Ionicons
            name="help-circle-outline"
            size={27}
            color={themes[theme].text}
          />
        </Pressable>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            padding: 16,
            backgroundColor: themes[theme].buttonMenuBackground,
            borderRadius: 12,
            width: 240,
          },
        }}
      >
        <MenuOption>
          <View>
            <Text
              className={`text-[${themes[theme].text}] text-base font-semibold mb-2`}
            >
              Información de la tarea
            </Text>
            <Text className={`text-[${themes[theme].taskSecondText}] text-sm`}>
              Esta tarea ha sido enviada o recibida por otro usuario. No puedes
              modificar ningún detalle. Solo el propietario tiene permisos de
              edición.
            </Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}
