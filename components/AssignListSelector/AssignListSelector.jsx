import { useEffect, useMemo } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "expo-router";

import { FontAwesome6, Ionicons } from "@expo/vector-icons";

import { useAtom } from "jotai";
import {
  listAssignedAtom,
  userAssignedAtom,
  listsAtom,
  userAtom,
} from "../../constants/storeAtoms";
import { themeAtom } from "../../constants/storeUiAtoms";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const AssignContactSelector = () => {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [lists] = useAtom(listsAtom);
  const [, setUserAssigned] = useAtom(userAssignedAtom);
  const [listAssigned, setListAssigned] = useAtom(listAssignedAtom);
  const [theme] = useAtom(themeAtom);

  const sortedLists = useMemo(() => {
    return [...lists].sort((a, b) => {
      const aIsShared = a.usersShared.length > 1;
      const bIsShared = b.usersShared.length > 1;

      // Si a no es compartida y b sí, a va primero
      if (!aIsShared && bIsShared) return -1;
      // Si a es compartida y b no, b va primero
      if (aIsShared && !bIsShared) return 1;
      // Si ambas son compartidas o no compartidas, mantener orden original
      return 0;
    });
  }, [lists]);

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("list"),
      presentation: "modal",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Text className={`text-2xl text-[${themes[theme].blueHeadText}]`}>
            {i18n.t("cancel")}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, theme]);

  return (
    <View className={`flex-1 bg-[${themes[theme].background}]`}>
      <Text
        className={`py-5 text-lg font-bold text-center text-[${themes[theme].text}] ${theme === "light" ? "bg-blue-300" : "bg-blue-700"}`}
      >
        {listAssigned ? `${listAssigned.title}` : i18n.t("shared")}
      </Text>
      <Text
        className={`m-3 ml-5 text-lg text-[${themes[theme].text}] font-bold`}
      >
        {i18n.t("selectList")}
      </Text>
      <View>
        <FlatList
          data={sortedLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              underlayColor={themes[theme].background}
              className={`h-16 border-b border-[${themes[theme].borderColor}]`}
              onPress={() => {
                // If list is NOT shared set user assigned to user
                if (item.usersShared.length === 1) {
                  setListAssigned(item);
                  setUserAssigned(user);
                }
                // If list is shared set user assigned to unassigned
                else if (item.usersShared.length > 1) {
                  setListAssigned(item);
                  setUserAssigned({
                    uid: "unassigned",
                    name: i18n.t("unassigned"),
                  });
                }
                navigation.goBack();
              }}
            >
              <View
                className={`h-full px-7 flex-row gap-5 items-center ${
                  listAssigned.id === item.id &&
                  `${theme === "light" ? "bg-slate-300" : "bg-gray-800"}`
                }`}
              >
                {/* Add profile photo below */}
                <Ionicons
                  className={`bg-${item.color}-300 p-2 rounded-xl`}
                  name={item.icon}
                  size={22}
                  color={`${themes[theme].text}`}
                />
                <View className="flex-1 flex-row justify-between">
                  <Text className={`text-lg text-[${themes[theme].text}]`}>
                    {item.title}
                  </Text>
                  <View className="flex-row gap-4 items-center">
                    {item.usersShared.length > 1 && (
                      <Text
                        className={`text-sm text-[${themes[theme].taskSecondText}]`}
                      >
                        {i18n.t("sharedSingular")}
                      </Text>
                    )}
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
        {/* Shared list option */}
        <TouchableOpacity
          activeOpacity={0.7}
          underlayColor={themes[theme].background}
          className={`h-16 px-7 flex-row gap-5 items-center ${
            listAssigned?.id === ""
              ? theme === "light"
                ? "bg-slate-300"
                : "bg-gray-800"
              : ""
          }`}
          onPress={() => {
            Alert.alert(
              i18n.t("invalidAction"),
              `${i18n.t("sharedListSelectedAlertText")}`,
              [
                {
                  text: i18n.t("ok"),
                  onPress: () => {
                    navigation.goBack();
                    setUserAssigned(user);
                    setListAssigned(lists[0]);
                  },
                }, // Dismiss the alert,
              ]
            );
          }}
        >
          <Ionicons
            className={`bg-slate-300 p-2 rounded-xl`}
            name="people"
            size={22}
            color={`${themes[theme].text}`}
          />
          <View className="flex-1 flex-row justify-between">
            <Text className={`text-lg text-[${themes[theme].text}]`}>
              {i18n.t("shared")}
            </Text>
            <View className="flex-row gap-4">
              {listAssigned.id === "" && (
                <FontAwesome6
                  name="check"
                  size={22}
                  color={themes["light"].blueHeadText}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AssignContactSelector;
