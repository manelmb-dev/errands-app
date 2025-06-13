import { View, TextInput, Pressable, ScrollView } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "expo-router";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAtom } from "jotai";
import {
  errandsAtom,
  listsAtom,
  themeAtom,
  userAtom,
} from "../../constants/storeAtoms";

import { themes } from "../../constants/themes";
import FullErrand from "../../Utils/fullErrand";

function OwnTasks() {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [lists, setLists] = useAtom(listsAtom);

  useEffect(() => {
    navigation.setOptions({
      title: "Mios",
      headerBackTitle: "Atrás",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerRight: () => (
        <Ionicons name="options" color={themes[theme].blueHeadText} size={24} />
      ),
    });
  }, [navigation, theme]);

  return (
    <View className={`h-full bg-[${themes[theme].background}]`}>
      <ScrollView>
        <Pressable>
          {/* List reminders */}
          {errands
            .filter((errand) => !errand.deleted)
            .filter((errand) => !errand.completed)
            .filter(
              (errand) =>
                errand.ownerId === user.id && user.id === errand.assignedId
            )
            .sort((a, b) => {
              const dateA = new Date(
                `${a.dateErrand}T${a.timeErrand || "20:00"}`
              );
              const dateB = new Date(
                `${b.dateErrand}T${b.timeErrand || "20:00"}`
              );
              return dateA - dateB;
            })
            .map((errand, index) => (
              <FullErrand key={errand.id} errand={errand} />
            ))}

          {/* New reminder */}
          <View className="flex-row rounded-xl pr-3 pt-3 pb-4">
            <View className="pl-4">
              <Octicons name="plus-circle" size={18} color="#6E727A" />
            </View>
            <View className="flex-1 pl-3">
              <TextInput
                className="text-[#161618]"
                placeholder="Añadir recordatorio"
                placeholderTextColor={themes[theme].addNewTaskText}
              />
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}
export default OwnTasks;
