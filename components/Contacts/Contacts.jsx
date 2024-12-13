import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { useAtom } from "jotai";
import { themeAtom } from "../../constants/storeAtoms";

import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../constants/themes";

function Contacts() {
  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <View className={`h-full bg-[${themes[theme].background}]`}>
      <View className="w-full flex-row items-center justify-between mb-2">
        <Pressable
          className="flex-row items-center px-1"
          onPress={() => router.push("/")}
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color={themes[theme].blueHeadText}
          />
          <Text className={`text-[${themes[theme].blueHeadText}] text-xl`}>
            Listas
          </Text>
        </Pressable>
        <Ionicons
          className="px-3 ml-9"
          name="options"
          size={26}
          color={themes[theme].blueHeadText}
        />
      </View>
    </View>
  );
}
export default Contacts;
