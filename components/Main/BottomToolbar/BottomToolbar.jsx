import { View, Pressable, TouchableHighlight } from "react-native";
import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { themeAtom } from "../../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";

function BottomToolbar({ activeSection, setActiveSection }) {
  const router = useRouter();

  const [theme] = useAtom(themeAtom);

  return (
    <View
      className={`w-full flex-row px-2 pb-7 pt-1.5 justify-around items-center border-t border-[${themes[theme].borderColor}] bg-[${themes[theme].background}]`}
    >
      <Pressable
        onPress={() => setActiveSection("home")}
        className="flex-1 items-center p-2 px-4"
      >
        <Ionicons
          name={activeSection === "home" ? "home" : "home-outline"}
          size={26}
          color={themes[theme].text}
        />
      </Pressable>

      <Pressable
        onPress={() => setActiveSection("search")}
        className="flex-1 items-center  p-2 px-4"
      >
        <Ionicons
          name={activeSection === "search" ? "search" : "search-outline"}
          size={28}
          color={themes[theme].text}
        />
      </Pressable>

      <Pressable
        onPress={() => setActiveSection("ai")}
        className="flex-1 items-center  p-2 px-4"
      >
        <Ionicons
          name={activeSection === "ai" ? "sparkles" : "sparkles-outline"}
          size={28}
          color={themes[theme].text}
        />
      </Pressable>

      <TouchableHighlight
        onPress={() => router.push("/Modals/newTaskModal")}
        className={`items-center p-2 px-4 bg-[${themes[theme].surfaceBackground}] rounded-2xl`}
        underlayColor={themes[theme].borderColor}
      >
        <Ionicons
          name={activeSection === "newTask" ? "add" : "add-outline"}
          size={31}
          color={themes[theme].text}
        />
      </TouchableHighlight>

      <Pressable
        onPress={() => setActiveSection("notifications")}
        className="flex-1 items-center p-2 px-4"
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
        onPress={() => setActiveSection("settings")}
        className="flex-1 items-center p-2 px-4"
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
