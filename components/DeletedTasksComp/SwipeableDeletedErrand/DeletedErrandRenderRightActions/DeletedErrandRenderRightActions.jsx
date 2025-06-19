import { useAtom } from "jotai";
import { View, Pressable } from "react-native";

import { errandsAtom } from "../../../../constants/storeAtoms";

import Ionicons from "react-native-vector-icons/Ionicons";

const DeletedErrandRenderRightActions = ({ errand }) => {
  const [, setErrands] = useAtom(errandsAtom);
  const deleteErrandPermanently = () => {
    // Delete errand locally
    setErrands((prev) => prev.filter((e) => e.id !== errand.id));

    // TODO: FIRESTORE UPDATEEE
    // await delete element from firestore
  };
  return (
    <View className="flex-row h-full">
      <Pressable
        onPress={deleteErrandPermanently}
        className="w-20 bg-red-600 justify-center items-center"
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </Pressable>
    </View>
  );
};
export default DeletedErrandRenderRightActions;
