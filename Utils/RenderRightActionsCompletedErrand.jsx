import { Pressable, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const RenderRightActionsCompletedErrand = ({ errand, setErrands }) => {
  const deleteErrand = () => {
    setErrands((prev) => prev.filter((e) => e.id !== errand.id));
    // TODO: FIRESTORE UPDATEEEEE
  };

  return (
    <View className="flex-row h-full mr-4">
      <Pressable
        onPress={deleteErrand}
        className="w-16 my-1.5 rounded-xl bg-red-600 justify-center items-center active:opacity-80"
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </Pressable>
    </View>
  );
};

export default RenderRightActionsCompletedErrand;
