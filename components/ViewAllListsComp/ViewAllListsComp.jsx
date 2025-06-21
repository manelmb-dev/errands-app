import { View, Text, TouchableHighlight, Pressable, Alert } from "react-native";
import { useNavigation, useRouter } from "expo-router";

import { errandsAtom, listsAtom, themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import { themes } from "../../constants/themes";
import { useEffect } from "react";
import i18n from "../../constants/i18n";

const ViewAllLists = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [lists, setLists] = useAtom(listsAtom);

  const listErrandsCount = (listId) => {
    return errands
      .filter((errand) => errand.listId === listId)
      .filter((errand) => !errand.completed)
      .filter((errand) => !errand.deleted).length;
  };

  const deleteErrandsFromList = (listId) => {
    // Delete all the errands from this list locally
    const updatedErrands = errands.filter((errand) => errand.listId !== listId);
    setErrands(updatedErrands);

    // FIRESTONE UPDATEEE FIXX this
  };

  const deleteList = (listId) => {
    // Delete all the errands from this list
    deleteErrandsFromList(listId);

    // Remove list locally
    const updatedLists = lists.filter((list) => list.id !== listId);
    setLists(updatedLists);

    // FIRESTONE UPDATEEE FIXX THIS
  };

  const confirmDeleteList = (listId) => {
    Alert.alert(
      `${i18n.t("deleteList")}`,
      `${listErrandsCount(listId) === 0 ? `${i18n.t("areYouSureDeleteList")}` : `${i18n.t("thisListContains")} ${listErrandsCount(listId)} ${listErrandsCount(listId) > 1 ? `${i18n.t("errands").toLowerCase()}` : `${i18n.t("errand").toLowerCase()}`}. ${i18n.t("deleteListTextAlert")}`} `,
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("delete"),
          onPress: () => deleteList(listId),
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: i18n.t("editLists"),
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  return (
    <View className={`w-full bg-[${themes[theme].background}] `}>
      {lists.map((list, index) => (
        <View key={list.id} className={`${index === 0 && "rounded-t-3xl"}`}>
          <TouchableHighlight
            underlayColor={themes[theme].background}
            onPress={() => {
              router.push({
                pathname: "/listTasks",
                params: {
                  list: JSON.stringify(list),
                },
              });
            }}
          >
            <View className={`w-full flex-row justify-between items-center`}>
              <View className={`flex-row items-center ml-5 gap-5`}>
                <Ionicons
                  className={`p-2 rounded-xl ${theme === "light" ? `bg-${list.color}-300` : `bg-${list.color}-600`}`}
                  name={list.icon}
                  size={23}
                  color={`${themes[theme].text}`}
                />
                <View
                  className={`flex-1 py-6 flex-row items-center justify-between ${index !== lists.length && `border-b  border-[${themes[theme].listsSeparator}]`}`}
                >
                  <Text className={`text-lg text-[${themes[theme].listTitle}]`}>
                    {list.title}
                  </Text>
                  <View className="mx-4 flex-row gap-4">
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: "/Modals/editListModal",
                          params: { list: JSON.stringify(list) },
                        })
                      }
                    >
                      <Feather
                        className={`p-2 rounded-xl ${theme === "light" ? `bg-blue-300` : `bg-blue-600`}`}
                        name="edit"
                        size={23}
                        color={`${themes[theme].text}`}
                      />
                    </Pressable>
                    <Pressable onPress={() => confirmDeleteList(list.id)}>
                      <Ionicons
                        className={`p-2 rounded-xl ${theme === "light" ? `bg-red-300` : `bg-red-600`}`}
                        name="trash"
                        size={23}
                        color={`${themes[theme].text}`}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      ))}
    </View>
  );
};
export default ViewAllLists;
