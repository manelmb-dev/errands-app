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
  listAssignedAtom,
  listsAtom,
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
  const [lists] = useAtom(listsAtom);
  const [userAssigned, setUserAssigned] = useAtom(userAssignedAtom);
  const [, setListAssigned] = useAtom(listAssignedAtom);
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
        className={`py-5 text-lg font-bold text-center text-[${themes[theme].text}]  ${theme === "light" ? "bg-blue-300" : "bg-blue-700"}`}
      >
        {userAssigned.id === user.id
          ? "Recordatorio para mi"
          : userAssigned.name + " " + userAssigned.surname}
      </Text>
      {filteredContacts.length > 0 && (
        <Text
          className={`m-3 ml-5 text-lg text-[${themes[theme].text}] font-bold`}
        >
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
            className={`h-16 border-b border-[${themes[theme].listsSeparator}]`}
            underlayColor={themes[theme].background}
            onPress={() => {
              setUserAssigned(item);
              if (item.id === user.id) {
                setListAssigned(lists[0]);
              } else if (item.id !== user.id) {
                setListAssigned("");
              }
              navigation.goBack();
            }}
          >
            <View
              className={`h-full px-4 flex-row gap-5 items-center ${
                userAssigned.id === item.id &&
                `${theme === "light" ? "bg-slate-300" : "bg-gray-800"}`
              }`}
            >
              {/* Add profile photo below */}
              <Ionicons
                name="person-circle-outline"
                size={38}
                color={themes["light"].taskSecondText}
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
