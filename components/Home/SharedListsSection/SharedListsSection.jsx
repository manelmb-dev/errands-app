import { View, Text, TouchableHighlight } from "react-native";
import { useRouter } from "expo-router";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  currentListAtom,
  errandsAtom,
  listsAtom,
  themeAtom,
  userAtom,
  usersSharedWithAtom,
} from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";
import ListPopupMenu from "../ListsSection/ListPopupMenu/ListPopupMenu";

export default function SharedListSection() {
  const router = useRouter();

  const [theme] = useAtom(themeAtom);
  const [user] = useAtom(userAtom);
  const [errands] = useAtom(errandsAtom);
  const [, setCurrentList] = useAtom(currentListAtom);
  const [lists] = useAtom(listsAtom);
  const [, setUsersSharedWith] = useAtom(usersSharedWithAtom);

  const sharedLists = lists
    .filter((list) => list.usersShared.length > 1)
    .filter((list) => list.usersShared.includes(user.id));

  return (
    <View>
      <View className="w-full flex-row justify-between mt-4 mb-1">
        <Text className={`text-xl font-bold ml-3 text-[${themes[theme].text}]`}>
          {i18n.t("sharedLists")}
        </Text>
        <ListPopupMenu />
      </View>

      {/* Lists section */}
      <View
        className={`w-full bg-[${themes[theme].buttonMenuBackground}] border border-[${themes[theme].borderColor}] rounded-t-3xl rounded-b-3xl shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
      >
        {sharedLists.length > 0 ? (
          sharedLists.map((list, index) => (
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
          ))
        ) : (
          <View className={`py-4 items-center justify-center`}>
            <Text className={`text-lg text-[${themes[theme].text}]`}>
              {i18n.t("noSharedLists")}
            </Text>
            <TouchableHighlight
              className={`px-4 py-2 mt-3 w-[90%] border border-[${themes[theme].borderColor}] rounded-2xl bg-[${themes[theme].buttonMenuBackground}]`}
              underlayColor={themes[theme].background}
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
            >
              <Text
                className={`text-lg text-center text-[${themes[theme].text}]`}
              >
                {i18n.t("addList")}
              </Text>
            </TouchableHighlight>
          </View>
        )}
      </View>
    </View>
  );
}
