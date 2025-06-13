import { View } from "react-native";
import { useState } from "react";

import { themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import RenderSection from "./RenderSection/RenderSection";
import BottomToolbar from "./BottomToolbar/BottomToolbar";
import { themes } from "../../constants/themes";

function Main() {
  const [theme] = useAtom(themeAtom);

  const [activeSection, setActiveSection] = useState("home");

  return (
    <View className={`flex-1 bg-[${themes[theme].background}] items-center`}>
      <View className="w-full flex-1 items-center">
        <RenderSection activeSection={activeSection} />
      </View>
      <BottomToolbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </View>
  );
}

export default Main;
