import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";

function BottomToolbar({ activeSection, setActiveSection }) {
  const router = useRouter();

  const [theme] = useAtom(themeAtom);

  return (
    <View
      className={`w-full flex-row px-2 justify-around items-center pb-6 border-t border-[${themes[theme].listsSeparator}] bg-[${themes[theme].background}]`}
    >
      <Pressable
        onPress={() => setActiveSection("home")}
        className="flex-1 items-center pt-2 pb-4"
      >
        <Ionicons
          name={activeSection === "home" ? "home" : "home-outline"}
          size={26}
          color={themes[theme].text}
        />
      </Pressable>

      <Pressable
        onPress={() => setActiveSection("search")}
        className="flex-1 items-center  pt-2 pb-4"
      >
        <Ionicons
          name={activeSection === "search" ? "search" : "search-outline"}
          size={28}
          color={themes[theme].text}
        />
      </Pressable>

      <Pressable
        onPress={() => setActiveSection("notifications")}
        className="flex-1 items-center pt-2 pb-4"
      >
        <Ionicons
          name={
            activeSection === "notifications"
              ? "notifications"
              : "notifications-outline"
          }
          size={29}
          color={themes[theme].text}
        />
      </Pressable>

      <Pressable
        onPress={() => router.push("/Modals/newTaskModal")}
        className="flex-1 items-center pt-2 pb-4"
      >
        <Ionicons
          name={
            activeSection === "newTask" ? "add-circle" : "add-circle-outline"
          }
          size={31}
          color={themes[theme].text}
        />
      </Pressable>

      <Pressable
        onPress={() => setActiveSection("settings")}
        className="flex-1 items-center pt-2 pb-4"
      >
        <Ionicons
          name={activeSection === "settings" ? "settings" : "settings-outline"}
          size={27}
          color={themes[theme].text}
        />
      </Pressable>
    </View>
  );
}
export default BottomToolbar;
