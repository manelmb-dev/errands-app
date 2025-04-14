import { useEffect } from "react";
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
  userAtom,
} from "../../constants/storeAtoms";

import { themes } from "../../constants/themes";

const AssignContactSelector = () => {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [lists] = useAtom(listsAtom);
  const [listAssigned, setListAssigned] = useAtom(listAssignedAtom);
  const [theme] = useAtom(themeAtom);

  useEffect(() => {
    navigation.setOptions({
      title: "Lista",
      presentation: "modal",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Text className={`text-2xl text-[${themes[theme].blueHeadText}]`}>
            Cancelar
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, theme]);

  const sortedLists = [
    ...lists,
    { title: "Sin lista", id: "", icon: "list", color: "slate" },
  ];

  return (
    <View className={`flex-1 bg-[${themes[theme].background}]`}>
      <Text
        className={`py-5 text-lg font-bold text-center text-[${themes[theme].text}] bg-blue-200  shadow-orange-200`}
      >
        {listAssigned ? `${listAssigned.title}` : "Sin lista"}
      </Text>
      <Text className={`m-2 text-lg text-[${themes[theme].text}] font-bold`}>
        Selecciona una lista
      </Text>
      <FlatList
        data={sortedLists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="h-16 border-b border-gray-300"
            onPress={() => {
              setListAssigned(item);
              navigation.goBack();
            }}
          >
            <View
              className={`h-full px-3 flex-row gap-5 items-center ${
                listAssigned.id === item.id ? `bg-slate-200` : ""
              }`}
            >
              {/* Add profile photo below */}
              <Ionicons
                className="p-2"
                name={item.icon}
                size={22}
                color={item.color}
              />
              <View className="flex-1 flex-row justify-between">
                <Text className={`text-lg text-[${themes[theme].text}]`}>
                  {item.title}
                </Text>
                <View className="flex-row gap-4">
                  {listAssigned.id === item.id && (
                    <FontAwesome6
                      name="check"
                      size={22}
                      color={themes["light"].blueHeadText}
                    />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AssignContactSelector;
