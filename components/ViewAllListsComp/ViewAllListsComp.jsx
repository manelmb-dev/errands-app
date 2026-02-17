import {
  View,
  Text,
  TouchableHighlight,
  Pressable,
  Alert,
  FlatList,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";

import { Ionicons, Feather } from "@expo/vector-icons";

import {
  currentListAtom,
  errandsAtom,
  listsAtom,
  userAtom,
  usersSharedWithAtom,
} from "../../constants/storeAtoms";
import { useAtom } from "jotai";
import { themeAtom } from "../../constants/storeUiAtoms";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";

const ViewAllListsComp = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [lists, setLists] = useAtom(listsAtom);
  const [, setCurrentList] = useAtom(currentListAtom);
  const [, setUsersSharedWith] = useAtom(usersSharedWithAtom);

  const listErrandsCount = (listId) =>
    errands.filter((e) => e.listId === listId && !e.completed && !e.deleted)
      .length;

  const deleteList = (listId) => {
    setErrands((prev) => prev.filter((e) => e.listId !== listId));
    setLists((prev) => prev.filter((l) => l.id !== listId));
  };

  const confirmDeleteList = (listId) => {
    Alert.alert(
      i18n.t("deleteList?"),
      listErrandsCount(listId) === 0
        ? i18n.t("areYouSureDeleteList")
        : `${i18n.t("thisListContains")} ${listErrandsCount(listId)} ${
            listErrandsCount(listId) > 1
              ? i18n.t("errands").toLowerCase()
              : i18n.t("errand").toLowerCase()
          }. ${i18n.t("deleteListTextAlert")}`,
      [
        {
          text: i18n.t("delete"),
          onPress: () => deleteList(listId),
          style: "destructive",
        },
        { text: i18n.t("cancel"), style: "cancel" },
      ]
    );
  };

  const leaveList = (listId) => {
    // Assign errands that are assigned to the user to another user of the usersShared list

    // Remove user from shared users list locally
    const updatedLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            usersShared: list.usersShared.filter(
              (userId) => userId !== user.id
            ),
          }
        : list
    );
    setLists(updatedLists);

    // sent notification to the rest of the shared users

    // FIRESTONE UPDATEEE FIXX THIS
  };

  const confirmLeaveList = (listId) => {
    Alert.alert(`${i18n.t("leaveList?")}`, `${i18n.t("textAlertLeaveList")}`, [
      {
        text: i18n.t("leaveList"),
        onPress: () => leaveList(listId),
        style: "destructive",
      },
      {
        text: i18n.t("cancel"),
        style: "cancel",
      },
    ]);
  };

  const ownLists = useMemo(
    () =>
      lists.filter((l) => l.ownerId === user.id && l.usersShared.length === 1),
    [lists, user.id]
  );

  const sharedLists = useMemo(
    () =>
      lists
        .filter(
          (l) => l.usersShared.length > 1 && l.usersShared.includes(user.id)
        )
        .sort((a, b) => {
          const aIsOwner = a.ownerId === user.id ? 0 : 1;
          const bIsOwner = b.ownerId === user.id ? 0 : 1;
          return aIsOwner - bIsOwner;
        }),
    [lists, user.id]
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: i18n.t("editLists"),
      headerTitleStyle: { color: themes[theme].text },
      headerBackTitle: i18n.t("back"),
      headerStyle: { backgroundColor: themes[theme].background },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
    });
  }, [navigation, theme]);

  const renderListItem = ({ item }) => (
    <View
      key={item.id}
      className={`flex-row justify-between items-center px-5 py-5 border-b border-[${themes[theme].borderColor}]`}
      style={{ backgroundColor: themes[theme].background }}
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
      {item.ownerId === user.id ? (
        <View className="flex-row gap-4">
          <Pressable
            onPress={() => {
              setCurrentList(item);
              router.push("/Modals/editListModal");
            }}
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
      ) : (
        <Pressable onPress={() => confirmLeaveList(item.id)}>
          <Ionicons
            className={`p-2 rounded-xl ${theme === "light" ? `bg-red-300` : `bg-red-600`}`}
            name="exit-outline"
            size={23}
            color={themes[theme].text}
          />
        </Pressable>
      )}
    </View>
  );

  const renderFooter = () => (
    <TouchableHighlight
      underlayColor={themes[theme].surfaceBackground}
      onPress={() => {
        setCurrentList({
          id: "",
          ownerId: user.id,
          title: "",
          icon: "",
          color: "",
          usersShared: [],
        });
        setUsersSharedWith([]);
        router.push("/Modals/newListModal");
      }}
      className="w-4/6 mt-6 self-center rounded-2xl"
    >
      <View
        className={`flex-row justify-center items-center rounded-2xl border border-[${themes[theme].borderColor}]`}
      >
        <View className={`flex-row items-center pl-5 gap-5`}>
          <Ionicons
            className={`p-2 rounded-xl bg-[${themes[theme].surfaceBackground}] border border-dashed border-[${themes[theme].text}]`}
            name="add"
            size={22}
            color={`${themes[theme].text}`}
          />
          <View className="flex-1 py-7">
            <Text className={`text-lg text-[${themes[theme].listTitle}]`}>
              {i18n.t("addNewList")}
            </Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );

  return (
    <View className={`flex-1 bg-[${themes[theme].background}]`}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 60 }}
        data={[...sharedLists]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderListItem({ item })}
        ListHeaderComponent={() => (
          <>
            <View
              className={`px-5 py-4 border-b border-[${themes[theme].borderColor}]`}
            >
              <Text
                className={`text-lg font-bold text-[${themes[theme].text}]`}
              >
                {i18n.t("myLists")}
              </Text>
            </View>
            {ownLists.map((item) => renderListItem({ item }))}
            <View
              className={`px-5 py-4 border-b border-[${themes[theme].borderColor}]`}
            >
              <Text
                className={`text-lg font-bold text-[${themes[theme].text}]`}
              >
                {i18n.t("sharedLists")}
              </Text>
            </View>
          </>
        )}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default ViewAllListsComp;
