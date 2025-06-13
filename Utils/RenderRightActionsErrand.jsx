import { Pressable, View } from "react-native";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

const RenderRightActionsErrand = ({ errand, setErrands }) => {
  const deleteErrand = () => {
    setErrands((prev) =>
      prev.map((e) => (e.id === errand.id ? { ...e, deleted: true } : e))
    );

    // TODO: FIRESTORE UPDATEEE
    // await updateErrandInFirestore({ ...errand, deleted: true });
  };

  return (
    <View className="flex-row h-full">
      <Pressable
        className="w-16 bg-blue-600 justify-center items-center"
        onPress={() => {
          router.push({
            pathname: "Modals/editTaskModal",
            params: { errand: JSON.stringify(errand) },
          });
        }}
      >
        <Ionicons name="list-circle" size={24} color="white" />
      </Pressable>

      <Pressable
        className="w-16 bg-red-600 justify-center items-center"
        onPress={deleteErrand}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </Pressable>
    </View>
  );
};

export default RenderRightActionsErrand;
