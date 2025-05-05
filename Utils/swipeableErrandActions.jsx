// utils/swipeableErrandActions.jsx

import { router } from "expo-router";
import { View, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export function swipeableErrandActions({ setErrands, openSwipeableRef }) {
  const markErrandWithFlag = (errand) => {
    const updatedErrand = {
      ...errand,
      marked: !errand.marked,
    };

    setErrands((prev) =>
      prev.map((e) => (e.id === updatedErrand.id ? updatedErrand : e)),
    );

    // FIRESTORE UPDATE pending
    // await updateErrandInFirestore(updatedErrand);
  };

  const renderRightActions = (errand) => (
    <View className="flex-row h-full mr-4">
      <Pressable
        className="w-16 my-1.5 rounded-xl bg-[#FFC402] justify-center items-center"
        onPress={() => {
          markErrandWithFlag(errand);
          openSwipeableRef.current?.close();
        }}
      >
        <Ionicons name="flag" size={24} color="white" />
      </Pressable>

      <Pressable
        className="w-16 my-1.5 rounded-xl bg-blue-600 justify-center items-center"
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
        className="w-16 my-1.5 rounded-xl bg-red-600 justify-center items-center"
        onPress={() =>
          setErrands((prev) => prev.filter((e) => e.id !== errand.id))
        }
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </Pressable>
    </View>
  );

  return {
    markErrandWithFlag,
    renderRightActions,
  };
}
