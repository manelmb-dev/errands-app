import { Pressable, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { userAtom } from "../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

const RenderRightActionsErrand = ({
  errand,
  setErrands,
  onDeleteWithUndo,
  openSwipeableRef,
}) => {
  const [user] = useAtom(userAtom);

  const deleteErrand = async () => {
    if (user.id === errand.ownerId) {
      // Delete errand locally
      setErrands((prev) =>
        prev.map((e) => (e.id === errand.id ? { ...e, deleted: true } : e))
      );

      // Delete errand after timeout
      onDeleteWithUndo(errand);

      // TODO: FIRESTORE UPDATEEE
      // await updateErrandInFirestore({ ...errand, deleted: true });
    } else if (user.id !== errand.ownerId) {
      // Change assignedId to ownerId locally
      setErrands((prev) =>
        prev.map((e) =>
          e.id === errand.id ? { ...e, assignedId: errand.ownerId } : e
        )
      );
      // Send notification push to ownerId
      // await sendNotificationToOwner(errand.ownerId, ...);

      // TODO: FIRESTORE UPDATEEE
      // await updateErrandInFirestore({ ...errand, assignedId: errand.ownerId });
    }
  };

  return (
    <View className="flex-row h-full">
      <TouchableOpacity
        className="w-20 bg-blue-600 justify-center items-center"
        activeOpacity={0.6}
        onPress={() => {
          if (errand.ownerId === user.id) {
            router.push({
              pathname: "Modals/editTaskModal",
              params: { errand: JSON.stringify(errand) },
            });
          } else {
            router.push({
              pathname: "Modals/viewIncomingTaskModal",
              params: { errand: JSON.stringify(errand) },
            });
          }
          openSwipeableRef.current?.close();
        }}
      >
        <Ionicons name="list-circle" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        className="w-20 bg-red-600 justify-center items-center"
        activeOpacity={0.6}
        onPress={deleteErrand}
      >
        <Ionicons name="trash-outline" size={23} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default RenderRightActionsErrand;
