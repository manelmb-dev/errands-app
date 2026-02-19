import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { View, Text, TouchableHighlight } from "react-native";
import { useEffect, useMemo } from "react";

import {
  usersSharedWithAtom,
  currentListAtom,
  errandsAtom,
  listsAtom,
  userAtom,
} from "../../../../../constants/storeAtoms";
import { themeAtom } from "../../../../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import { Ionicons } from "@expo/vector-icons";

import { themes } from "../../../../../constants/themes";
import i18n from "../../../../../constants/i18n";

const ContactSharedLists = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [errands] = useAtom(errandsAtom);
  const [, setCurrentList] = useAtom(currentListAtom);
  const [lists] = useAtom(listsAtom);
  const [, setUsersSharedWith] = useAtom(usersSharedWithAtom);

  const { contact } = useLocalSearchParams();
  const currentContact = useMemo(() => JSON.parse(contact), [contact]);

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("sharedLists"),
      headerBackTitle: i18n.t("back"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  const sharedLists = useMemo(() => {
    return lists.filter(
      (list) =>
        list.usersShared.includes(currentContact.uid) &&
        list.usersShared.includes(user.uid),
    );
  }, [lists, currentContact, user]);

  return (
    <View className={`flex-1 bg-[${themes[theme].background}] px-4`}>
      {sharedLists.length > 0 ? (
        <View className={`mt-5 gap-4`}>
          <View
            className={`bg-[${themes[theme].surfaceBackground}] rounded-3xl border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
          >
            {sharedLists.map((list, index) => (
              <View
                key={list.id}
                className={`${index === 0 && "rounded-t-3xl"} ${index === sharedLists.length - 1 && "rounded-b-3xl"}`}
              >
                <TouchableHighlight
                  className={`${index === 0 && "rounded-t-3xl pt-1"} ${index === sharedLists.length - 1 && "rounded-b-3xl pb-1"}`}
                  underlayColor={themes[theme].background}
                  onPress={() => {
                    setCurrentList(list);
                    router.push("/listTasks");
                  }}
                >
                  <View
                    className={`w-full flex-row justify-between items-center ${index === 0 && "rounded-t-3xl"} ${index === sharedLists.length - 1 && "rounded-b-3xl"}`}
                  >
                    <View
                      className={`flex-row items-center ml-5 gap-5 ${index === 0 && "rounded-t-xl"} ${index === sharedLists.length - 1 && "rounded-b-3xl"}`}
                    >
                      <Ionicons
                        className={`p-2 rounded-xl ${theme === "light" ? `bg-${list.color}-300` : `bg-${list.color}-600`}`}
                        name={list.icon}
                        size={23}
                        color={`${themes[theme].text}`}
                      />
                      <View
                        className={`flex-1 py-4 flex-row items-center justify-between ${index !== sharedLists.length - 1 && `border-b  border-[${themes[theme].borderColor}]`}`}
                      >
                        <Text
                          className={`text-lg text-[${themes[theme].listTitle}]`}
                        >
                          {list.title}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <Text
                            className={` text-lg font-semibold text-[${themes[theme].listTitle}]`}
                          >
                            {
                              errands.filter(
                                (errand) =>
                                  errand.listId === list.id &&
                                  !errand.deleted &&
                                  !errand.completed,
                              ).length
                            }
                          </Text>
                          <Ionicons
                            className="mr-3"
                            name="chevron-forward-outline"
                            size={18}
                            color={themes[theme].taskSecondText}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            ))}
          </View>
          <View
            className={`mt-4 bg-[${themes[theme].surfaceBackground}] self-center rounded-3xl`}
          >
            <TouchableHighlight
              className={`rounded-3xl`}
              underlayColor={themes[theme].background}
              onPress={() => {
                setCurrentList({
                  id: "",
                  ownerUid: user.uid,
                  title: "",
                  icon: "",
                  color: "",
                  usersShared: [],
                });
                setUsersSharedWith([]);
                router.push({
                  pathname: "/Modals/newListModal",
                  params: { contact: JSON.stringify(currentContact) },
                });
              }}
            >
              <View
                className={`flex-row justify-center items-center rounded-3xl border border-[${themes[theme].borderColor}]`}
              >
                <View className={`flex-row items-center pl-5 gap-5`}>
                  <Ionicons
                    className={`p-1.5 rounded-xl bg-[${themes[theme].surfaceBackground}] border border-dashed border-[${themes[theme].text}]`}
                    name="add"
                    size={22}
                    color={`${themes[theme].text}`}
                  />
                  <View className="flex-1 py-5">
                    <Text
                      className={`text-lg text-[${themes[theme].listTitle}]`}
                    >
                      {i18n.t("addNewList")}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      ) : (
        <View
          className={`mt-5 py-6 bg-[${themes[theme].surfaceBackground}] items-center justify-center rounded-3xl border border-[${themes[theme].borderColor}]`}
        >
          <Text
            className={`text-lg text-[${themes[theme].text}] font-semibold`}
          >
            {i18n.t("noSharedLists")}
          </Text>
          <TouchableHighlight
            className={`px-4 py-3 mt-8 w-[90%] border border-[${themes[theme].borderColor}] rounded-2xl bg-[${themes[theme].background}]`}
            underlayColor={themes[theme].borderColor}
            onPress={() => {
              setCurrentList({
                id: "",
                ownerUid: user.uid,
                title: "",
                icon: "",
                color: "",
                usersShared: [],
              });
              setUsersSharedWith([]);
              router.push({
                pathname: "/Modals/newListModal",
                params: { contact: JSON.stringify(currentContact) },
              });
            }}
          >
            <Text
              className={`text-lg text-center text-[${themes[theme].text}] font-semibold`}
            >
              {i18n.t("addList")}
            </Text>
          </TouchableHighlight>
        </View>
      )}
    </View>
  );
};
export default ContactSharedLists;
