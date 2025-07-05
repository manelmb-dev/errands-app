import { View, Text, Pressable, TouchableHighlight } from "react-native";
import { useRouter } from "expo-router";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  errandsAtom,
  listsAtom,
  themeAtom,
  userAtom,
} from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";
import ListPopupMenu from "./ListPopupMenu/ListPopupMenu";
import i18n from "../../../constants/i18n";

export default function ListSection() {
  const router = useRouter();

  const [theme] = useAtom(themeAtom);
  const [user] = useAtom(userAtom);
  const [errands] = useAtom(errandsAtom);
  const [lists] = useAtom(listsAtom);

  const totalErrandsDeleted = errands
    .filter((errand) => errand.deleted)
    .filter((e) => e.ownerId === user.id).length;

  const ownNotSahredLists = lists
    .filter((list) => list.ownerId === user.id)
    .filter((list) => list.usersShared.length === 1)
    .filter((list) => list.usersShared[0] === user.id);

  return (
    <View>
      <View className="w-full flex-row justify-between mt-4 mb-1">
        <Text className={`text-xl font-bold ml-3 text-[${themes[theme].text}]`}>
          {i18n.t("myLists")}
        </Text>
        <ListPopupMenu />
      </View>

      {/* Lists section */}
      <View
        className={`w-full bg-[${themes[theme].buttonMenuBackground}] border border-[${themes[theme].borderColor}] rounded-t-3xl rounded-b-3xl shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
      >
        {ownNotSahredLists.map((list, index) => (
          <View key={list.id} className={`${index === 0 && "rounded-t-3xl"}`}>
            <TouchableHighlight
              className={`${index === 0 && "rounded-t-3xl pt-1"}`}
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
              <View
                className={`w-full flex-row justify-between items-center ${index === 0 && "rounded-t-3xl"}`}
              >
                <View
                  className={`flex-row items-center ml-5 gap-5 ${index === 0 && "rounded-t-xl"}`}
                >
                  <Ionicons
                    className={`p-2 rounded-xl ${theme === "light" ? `bg-${list.color}-300` : `bg-${list.color}-600`}`}
                    name={list.icon}
                    size={23}
                    color={`${themes[theme].text}`}
                  />
                  <View
                    className={`flex-1 py-4 flex-row items-center justify-between border-b  border-[${themes[theme].borderColor}]`}
                  >
                    <Text
                      className={`text-lg text-[${themes[theme].listTitle}]`}
                    >
                      {list.title}
                    </Text>
                    <Text
                      className={`mr-7 text-lg font-semibold text-[${themes[theme].listTitle}]`}
                    >
                      {
                        errands
                          .filter((errand) => errand.listId === list.id)
                          .filter((errand) => !errand.deleted)
                          .filter((errand) => !errand.completed).length
                      }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        ))}

        {/* Shared Errands */}
        <View>
          <TouchableHighlight
            className={`${totalErrandsDeleted === 0 && "rounded-b-3xl pb-1"}`}
            underlayColor={themes[theme].background}
            onPress={() => {
              router.push({
                pathname: "/sharedTasks",
                params: {
                  tabParams: JSON.stringify({
                    type: "all",
                    status: "pending",
                  }),
                },
              });
            }}
          >
            <View
              className={`w-full flex-row justify-between items-center ${totalErrandsDeleted === 0 && "rounded-b-3xl"}`}
            >
              <View className={`flex-row items-center ml-5 gap-5`}>
                <MaterialCommunityIcons
                  className={`p-2 rounded-xl ${theme === "light" ? `bg-slate-300` : `bg-slate-600`}`}
                  name="account-group"
                  size={23}
                  color={`${themes[theme].text}`}
                />
                <View
                  className={`flex-1 py-4 flex-row items-center justify-between ${totalErrandsDeleted !== 0 && `border-b  border-[${themes[theme].borderColor}]`}`}
                >
                  <Text className={`text-lg text-[${themes[theme].listTitle}]`}>
                    {i18n.t("shared")}
                  </Text>
                  <Text
                    className={`mr-7 text-lg font-semibold text-[${themes[theme].listTitle}]`}
                  >
                    {
                      errands
                        .filter((errand) => !errand.deleted)
                        .filter((errand) => !errand.completed)
                        .filter((errand) => errand.listId === "")
                        .filter(
                          (errand) => errand.ownerId !== errand.assignedId
                        ).length
                    }
                  </Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>

        {/* Errands deleted */}
        {totalErrandsDeleted > 0 && (
          <View className="rounded-b-3xl">
            <TouchableHighlight
              className={`rounded-b-3xl pb-1`}
              underlayColor={themes[theme].background}
              onPress={() => {
                router.push("/deletedTasks");
              }}
            >
              <View
                className={`w-full flex-row justify-between items-center rounded-b-3xl`}
              >
                <View
                  className={`flex-row items-center ml-5 gap-5 rounded-b-xl`}
                >
                  <Ionicons
                    className={`p-2 rounded-xl ${theme === "light" ? `bg-red-300` : `bg-red-600`}`}
                    name="trash"
                    size={23}
                    color={`${themes[theme].text}`}
                  />
                  <View
                    className={`flex-1 py-4 flex-row items-center justify-between`}
                  >
                    <Text
                      className={`text-lg text-[${themes[theme].listTitle}]`}
                    >
                      {i18n.t("deleted")}
                    </Text>
                    <Text
                      className={`mr-7 text-lg font-semibold text-[${themes[theme].listTitle}]`}
                    >
                      {
                        errands
                          .filter((errand) => errand.deleted === true)
                          .filter((errand) => errand.ownerId === user.id).length
                      }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        )}
      </View>
    </View>
  );
}
