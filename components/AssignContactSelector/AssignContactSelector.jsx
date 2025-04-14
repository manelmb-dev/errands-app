import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "expo-router";

import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAtom } from "jotai";
import {
  contactsAtom,
  themeAtom,
  userAssignedAtom,
  userAtom,
} from "../../constants/storeAtoms";

import { themes } from "../../constants/themes";
import { SafeAreaView } from "react-native-safe-area-context";

const AssignContactSelector = () => {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [contacts] = useAtom(contactsAtom);
  const [userAssigned, setUserAssigned] = useAtom(userAssignedAtom);
  const [theme] = useAtom(themeAtom);

  const [contactSearchedInput, setContactSearchedInput] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  useEffect(() => {
    navigation.setOptions({
      title: "Asignar recordatorio",
      presentation: "modal",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: {
        placeholder: "Buscar",
        onChangeText: (event) => {
          setContactSearchedInput(event.nativeEvent.text.replace(/\s+/g, ""));
        },
      },
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Text className={`text-2xl text-[${themes[theme].blueHeadText}]`}>
            Cancelar
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, theme, contactSearchedInput]);

  const sortedContacts = useMemo(() => {
    return [
      { ...user },
      ...contacts
        .filter((c) => c.favorite)
        .sort(
          (a, b) =>
            a.name.localeCompare(b.name) || a.surname.localeCompare(b.surname)
        ),
      ...contacts
        .filter((c) => !c.favorite)
        .sort(
          (a, b) =>
            a.name.localeCompare(b.name) || a.surname.localeCompare(b.surname)
        ),
    ];
  }, [contacts, user]);

  useEffect(() => {
    setFilteredContacts(
      sortedContacts.filter((contact) =>
        (contact.name + contact.surname)
          .toLowerCase()
          .includes(contactSearchedInput.toLowerCase())
      )
    );
  }, [contactSearchedInput, sortedContacts]);

  return (
    <SafeAreaView className={`flex-1 bg-[${themes[theme].background}]`}>
      <Text
        className={`py-5 text-lg font-bold text-center text-[${themes[theme].text}] bg-blue-200  shadow-orange-200`}
      >
        {userAssigned.id === user.id
          ? "Recordatorio para mi"
          : userAssigned.name + " " + userAssigned.surname}
      </Text>
      {filteredContacts.length > 0 && (
        <Text className={`m-2 text-lg text-[${themes[theme].text}] font-bold`}>
          Selecciona un contacto
        </Text>
      )}

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="pt-12 items-center">
            <Text className={`text-[${themes[theme].taskSecondText}] text-xl`}>
              No existe ningún contacto con este nombre
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className="h-16 border-b border-gray-300"
            onPress={() => {
              setUserAssigned(item);
              navigation.goBack();
            }}
          >
            <View
              className={`h-full px-3 flex-row gap-5 items-center ${
                userAssigned.id === item.id ? `bg-slate-200` : ""
              }`}
            >
              {/* Add profile photo below */}
              <Ionicons
                className="p-2 bg-slate-500 rounded-full border border-gray-700"
                name="person"
                size={22}
                color={themes["light"].background}
              />
              <View className="flex-1 flex-row justify-between">
                <Text className={`text-lg text-[${themes[theme].text}]`}>
                  {item.name} {item.surname} {item.id === user.id && "(Tú)"}
                </Text>
                <View className="flex-row gap-4">
                  {userAssigned.id === item.id && (
                    <FontAwesome6
                      name="check"
                      size={22}
                      color={themes["light"].blueHeadText}
                    />
                  )}
                  {item.favorite === true && (
                    <AntDesign name="star" size={22} color="orange" />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default AssignContactSelector;
