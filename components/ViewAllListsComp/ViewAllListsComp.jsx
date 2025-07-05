import { View, Text, TouchableHighlight, Pressable, Alert } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import DraggableFlatList from "react-native-draggable-flatlist";

import {
  errandsAtom,
  listsAtom,
  themeAtom,
  userAtom,
} from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import { themes } from "../../constants/themes";
import { useEffect } from "react";
import i18n from "../../constants/i18n";

const ViewAllListsComp = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
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
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerBackTitle: i18n.t("back"),
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  const handleDragEnd = (data) => {
    setLists(data);

    // FIRESTONE UPDATEEE FIXX THIS
    // update lists on the server
  };

  const ownNotSahredLists = lists
    .filter((list) => list.ownerId === user.id)
    .filter((list) => list.usersShared.length === 1)
    .filter((list) => list.usersShared[0] === user.id);

  const sharedLists = lists
    .filter((list) => list.usersShared.length > 1)
    .filter((list) => list.usersShared.includes(user.id));

  const renderItem = ({ item, drag, isActive }) => (
    <Pressable
      onLongPress={drag}
      disabled={isActive}
      className={`flex-row justify-between items-center px-5 py-5 border-b border-[${themes[theme].borderColor}]`}
      style={{
        backgroundColor: isActive
          ? themes[theme].buttonMenuBackground
          : themes[theme].background,
        borderColor: themes[theme].borderColor,
        transform: [{ scale: isActive ? 1.03 : 1 }],
        elevation: isActive ? 8 : 0,
        shadowColor: isActive ? "#000" : "transparent",
        shadowOpacity: isActive ? 0.15 : 0,
        shadowRadius: isActive ? 10 : 0,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      <View className="flex-row items-center gap-4">
        <Ionicons
          className={`p-2 rounded-xl ${theme === "light" ? `bg-${item.color}-300` : `bg-${item.color}-600`}`}
          name={item.icon}
          size={23}
          color={themes[theme].text}
        />
        <Text className={`text-lg text-[${themes[theme].listTitle}]`}>
          {item.title}
        </Text>
      </View>
      <View className="flex-row gap-4">
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/Modals/editListModal",
              params: { list: JSON.stringify(item) },
            })
          }
        >
          <Feather
            className={`p-2 rounded-xl ${theme === "light" ? `bg-blue-300` : `bg-blue-600`}`}
            name="edit"
            size={23}
            color={themes[theme].text}
          />
        </Pressable>
        <Pressable onPress={() => confirmDeleteList(item.id)}>
          <Ionicons
            className={`p-2 rounded-xl ${theme === "light" ? `bg-red-300` : `bg-red-600`}`}
            name="trash"
            size={23}
            color={themes[theme].text}
          />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View className={`flex-1 bg-[${themes[theme].background}]`}>
      {/* Own not shared lists section */}
      <View
        className={`px-5 py-4 border-b border-[${themes[theme].borderColor}]`}
      >
        <Text className={`text-lg font-bold text-[${themes[theme].text}]`}>
          {i18n.t("myLists")}
        </Text>
      </View>
      <DraggableFlatList
        animationConfig={{
          scale: {
            damping: 40,
            stiffness: 400,
          },
        }}
        data={ownNotSahredLists}
        onDragEnd={({ data }) => handleDragEnd(data)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListFooterComponent={() => (
          <TouchableHighlight
            underlayColor={themes[theme].buttonMenuBackground}
            onPress={() => router.push("/Modals/newListModal")}
          >
            <View
              className={`w-full flex-row justify-between items-center border-b border-[${themes[theme].borderColor}]`}
            >
              <View className={`flex-row items-center pl-5 gap-5`}>
                <Ionicons
                  className={`p-2 rounded-xl bg-[${themes[theme].buttonMenuBackground}] border border-dashed border-[${themes[theme].text}]`}
                  name="add"
                  size={22}
                  color={`${themes[theme].text}`}
                />
                <View
                  className={`flex-1 py-7 flex-row items-center justify-between`}
                >
                  <Text className={`text-lg text-[${themes[theme].listTitle}]`}>
                    {i18n.t("addNewList")}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        )}
      />

      {/* Shared lists section */}
      <View
        className={`px-5 py-4 border-b border-[${themes[theme].borderColor}]`}
      >
        <Text className={`text-lg font-bold text-[${themes[theme].text}]`}>
          {i18n.t("sharedLists")}
        </Text>
      </View>
      <DraggableFlatList
        animationConfig={{
          scale: {
            damping: 40,
            stiffness: 400,
          },
        }}
        data={sharedLists}
        onDragEnd={({ data }) => handleDragEnd(data)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          height: "100%",
        }}
        ListFooterComponent={() => (
          <TouchableHighlight
            underlayColor={themes[theme].buttonMenuBackground}
            onPress={() => router.push("/Modals/newListModal")}
          >
            <View
              className={`w-full flex-row justify-between items-center border-b border-[${themes[theme].borderColor}]`}
            >
              <View className={`flex-row items-center pl-5 gap-5`}>
                <Ionicons
                  className={`p-2 rounded-xl bg-[${themes[theme].buttonMenuBackground}] border border-dashed border-[${themes[theme].text}]`}
                  name="add"
                  size={22}
                  color={`${themes[theme].text}`}
                />
                <View
                  className={`flex-1 py-7 flex-row items-center justify-between`}
                >
                  <Text className={`text-lg text-[${themes[theme].listTitle}]`}>
                    {i18n.t("addNewList")}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
};
export default ViewAllListsComp;
