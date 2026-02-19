import { TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useMemo } from "react";

import { listsAtom, userAtom } from "../constants/storeAtoms";
import { useAtom } from "jotai";

import { Ionicons } from "@expo/vector-icons";

const RenderRightActionsErrand = ({
  errand,
  setErrands,
  onDeleteWithUndo,
  openSwipeableRef,
}) => {
  const [user] = useAtom(userAtom);
  const [lists] = useAtom(listsAtom);

  const errandList = useMemo(
    () => lists.find((list) => list.id === errand.listId),
    [lists, errand.listId],
  );

  const deleteErrand = async () => {
    if (user.uid === errand.ownerUid || errandList !== undefined) {
      // Delete errand locally
      setErrands((prev) =>
        prev.map((e) => (e.id === errand.id ? { ...e, deleted: true } : e)),
      );

      // Delete errand after timeout
      onDeleteWithUndo(errand);

      // TODO: FIRESTORE UPDATEEE
      // await updateErrandInFirestore({ ...errand, deleted: true });

      // Send notification push to usersShared if errand was in a shared list
    } else if (user.uid !== errand.ownerUid && errandList !== undefined) {
      // Change assignedUid to ownerUid locally
      setErrands((prev) =>
        prev.map((e) =>
          e.id === errand.id ? { ...e, assignedUid: errand.ownerUid } : e,
        ),
      );
      // Send notification push to ownerUid
      // await sendNotificationToOwner(errand.ownerUid, ...);

      // TODO: FIRESTORE UPDATEEE
      // await updateErrandInFirestore({ ...errand, assignedUid: errand.ownerUid });
    }
  };

  return (
    <View className="flex-row h-full">
      {(errand.ownerUid === user.uid || errandList !== undefined) && (
        <TouchableOpacity
          className="w-20 bg-blue-600 justify-center items-center"
          activeOpacity={0.6}
          onPress={() => {
            router.push({
              pathname: "Modals/editTaskModal",
              params: { errand: JSON.stringify(errand) },
            });
            openSwipeableRef.current?.close();
          }}
        >
          <Ionicons name="list-circle" size={24} color="white" />
        </TouchableOpacity>
      )}

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
