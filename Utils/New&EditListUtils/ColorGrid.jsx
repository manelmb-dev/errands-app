import { View, TouchableOpacity } from "react-native";
import React from "react";

import { useAtom } from "jotai";
import { themeAtom } from "../../constants/storeAtoms";

import { colors } from "../../constants/iconsColorsLists";
import { themes } from "../../constants/themes";

const ColorGrid = ({ assignedColor, setAssignedColor }) => {
  const [theme] = useAtom(themeAtom);

  return (
    <View
      className={`flex-row flex-wrap items-center justify-center my-2 px-2`}
    >
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => setAssignedColor(color)}
          className={`rounded-2xl p-0.5 bg-[${themes[theme].surfaceBackground}] ${
            assignedColor === color
              ? "border-4 border-blue-600"
              : "border-4 border-transparent"
          }`}
        >
          <View
            className={`rounded-xl w-14 h-14 ${theme === "light" ? `bg-${color}-300` : `bg-${color}-600`}`}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ColorGrid;
