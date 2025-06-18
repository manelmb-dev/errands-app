import { Pressable, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const RenderRightActionsCompletedErrand = ({
  errand,
  setErrands,
  onDeleteWithUndo,
}) => {
  const deleteErrand = () => {
    // Delete errand locally
    setErrands((prev) =>
      prev.map((e) => (e.id === errand.id ? { ...e, deleted: true } : e))
    );

    // Delete errand after timeout
    onDeleteWithUndo(errand);

    // TODO: FIRESTORE UPDATEEE
    // await updateErrandInFirestore({ ...errand, deleted: true });
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
