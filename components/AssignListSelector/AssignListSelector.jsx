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
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAtom } from "jotai";
import {
  listAssignedAtom,
  listsAtom,
  themeAtom,
} from "../../constants/storeAtoms";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const AssignContactSelector = () => {
  const navigation = useNavigation();

  const [lists] = useAtom(listsAtom);
  const [listAssigned, setListAssigned] = useAtom(listAssignedAtom);
  const [theme] = useAtom(themeAtom);

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
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`h-16 border-b border-[${themes[theme].listsSeparator}]`}
              underlayColor={themes[theme].background}
              onPress={() => {
                setListAssigned(item);
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
        <View
          className={`h-16 px-7 flex-row gap-5 items-center ${
            listAssigned?.id === ""
              ? theme === "light"
                ? "bg-slate-300"
                : "bg-gray-800"
              : ""
          }`}
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
        </View>
      </View>
    </View>
  );
};

export default AssignContactSelector;
