import React from "react";
import { Platform, Alert, TouchableOpacity } from "react-native";
import ContextMenuView from "react-native-context-menu-view";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAtom } from "jotai";
import { themeAtom } from "../../../../constants/storeAtoms";

import { themes } from "../../../../constants/themes";
import { router } from "expo-router";

export default function ListPopupMenu() {
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
        <MaterialIcons
          className="mr-3"
          name="dashboard-customize"
          size={22}
          color={themes[theme].text}
        />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            backgroundColor: themes[theme].buttonMenuBackground,
            borderRadius: 10,
            elevation: 12, // shadow Android
            shadowColor: themes[theme].popupShadow, // shadow iOS
            shadowOpacity: 0.4,
            shadowRadius: 30,
          },
        }}
      >
        <MenuOption
          onSelect={() => router.push("/Modals/newListModal")}
          text="Añadir lista"
          customStyles={{
            optionWrapper: {
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomColor: themes[theme].listsSeparator,
              borderBottomWidth: 1,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
            optionText: {
              fontSize: 16,
              color: themes[theme].text,
            },
          }}
        />
        <MenuOption
          onSelect={() => handleSelect("Editar listas")}
          // FIX Thissssss
          text="Editar listas"
          customStyles={{
            optionWrapper: {
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            },
            optionText: {
              fontSize: 16,
              color: themes[theme].text,
            },
          }}
        />
      </MenuOptions>
    </Menu>
  );
}
