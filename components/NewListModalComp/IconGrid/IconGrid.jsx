import { ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAtom } from "jotai";
import { themeAtom } from "../../../constants/storeAtoms";
import { themes } from "../../../constants/themes";
import { icons } from "../../../constants/iconsColorsLists";

const IconGrid = ({ assignedIcon, setAssignedIcon, assignedColor }) => {
  const [theme] = useAtom(themeAtom);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {icons.map((icon) => (
        <TouchableOpacity
          key={icon}
          onPress={() => setAssignedIcon(icon)}
          className={`w-14 h-14 items-center justify-center rounded-xl p-0.5 ${
            assignedIcon === icon
              ? "border-2 border-blue-600"
              : "border-2 border-transparent"
          }`}
        >
          <Ionicons
            name={icon}
            size={35}
            color={assignedIcon === icon ? assignedColor : themes[theme].text}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default IconGrid;
