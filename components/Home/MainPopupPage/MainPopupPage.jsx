import React from "react";
import { Platform, Alert, TouchableOpacity } from "react-native";
import ContextMenuView from "react-native-context-menu-view";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";
import Ionicons from "react-native-vector-icons/Ionicons";
import { themes } from "../../../constants/themes";
import { useAtom } from "jotai";
import { themeAtom } from "../../../constants/storeAtoms";

export default function MainPopupPage() {
  const [theme] = useAtom(themeAtom);
  const handleSelect = (key) => {
    Alert.alert("Has pulsado", key);
    // Aquí puedes usar navigation.navigate('Pantalla') si lo deseas
  };

  //   if (Platform.OS === "ios") {
  //     return (
  //       <ContextMenuView
  //         style={{ padding: 4 }}
  //         menuConfig={{
  //           menuTitle: "Menú",
  //           menuItems: [
  //             { actionKey: "contactos", actionTitle: "Contactos" },
  //             { actionKey: "configuracion", actionTitle: "Configuración" },
  //             { actionKey: "perfil", actionTitle: "Perfil" },
  //           ],
  //         }}
  //         onPressMenuItem={({ nativeEvent }) =>
  //           handleSelect(nativeEvent.actionKey)
  //         }
  //       >
  //         <Ionicons name="options" size={24} color={iconColor} />
  //       </ContextMenuView>
  //     );
  //   }

  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
        }}
      >
        <Ionicons name="options" size={24} color={themes[theme].blueHeadText} />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          anchorStyle: {
            marginTop: 12, // 👈 desplaza el popup más abajo
          },
          optionsContainer: {
            backgroundColor: themes[theme].buttonMenuBackground,
            borderRadius: 10,
            elevation: 6, // shadow Android
            shadowColor: "#000", // shadow iOS
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
          },
          optionWrapper: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomColor: "#e0e0e0",
            borderBottomWidth: 1,
          },
          optionText: {
            fontSize: 16,
            color: themes[theme].text,
          },
        }}
      >
        <MenuOption
          onSelect={() => handleSelect("contactos")}
          text="Contactos"
        />
        <MenuOption
          onSelect={() => handleSelect("configuracion")}
          text="Configuración"
        />
        <MenuOption onSelect={() => handleSelect("perfil")} text="Perfil" />
      </MenuOptions>
    </Menu>
  );
}
