// Utils/SwipeableFullErrand.jsx
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { FadeOut } from "react-native-reanimated";
import { Pressable, Text, View } from "react-native";
import React from "react";

import { Ionicons, Octicons } from "@expo/vector-icons";

import { contactsAtom, userAtom } from "../../../constants/storeAtoms";
import { themeAtom } from "../../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import DeletedErrandRenderRightActions from "./DeletedErrandRenderRightActions/DeletedErrandRenderRightActions";
import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";
import { Alert } from "react-native";
// import formatErrandDate from "../../../constants/formatDay";

const SwipeableFullErrand = ({
  errand,
  setErrands,
  openSwipeableRef,
  swipeableRefs,
}) => {
  const [theme] = useAtom(themeAtom);
  const [user] = useAtom(userAtom);
  const [contacts] = useAtom(contactsAtom);

  const assignedContact = contacts.find(
    (contact) => contact.id.toString() === errand.assignedId.toString(),
  );

  const creatorContact = contacts.find(
    (contact) => contact.id.toString() === errand.ownerId.toString(),
  );

  const restoreErrand = async (errandId) => {
    setErrands((prevErrands) => {
      return prevErrands.map((errand) => {
        if (errand.id === errandId) {
          return {
            ...errand,
            deleted: false,
            dateDeleted: null,
          };
        }
        return errand;
      });
    });
    // FIRESTONEEE UPDATEEEE
    //     try {
    //       const errandRef = doc(db, "errands", errandId);

    //       await updateDoc(errandRef, {
    //         deleted: false,
    //         dateDeleted: null,
    //       });

    //       console.log(`Errand ${errandId} restored successfully!`);
    //     } catch (error) {
    //       console.error("Error restoring errand:", error);
    //       throw error;
    //     }
  };

  const confirmRestoreErrand = (errandId) => {
    Alert.alert(
      `${i18n.t("recoverDeletedErrand")}`,
      `${i18n.t("recoverAlertText")}`,
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("recover"),
          onPress: () => restoreErrand(errandId),
          style: "default",
        },
      ],
    );
  };

  return (
    <Swipeable
      // className={`bg-[${themes[theme].background}]`}
      ref={(ref) => (swipeableRefs.current[errand.id] = ref)}
      renderRightActions={() => (
        <DeletedErrandRenderRightActions errand={errand} />
      )}
      onSwipeableOpenStartDrag={() => {
        if (
          openSwipeableRef.current &&
          openSwipeableRef.current !== swipeableRefs.current[errand.id]
        ) {
          openSwipeableRef.current.close();
        }
        openSwipeableRef.current = swipeableRefs.current[errand.id];
      }}
    >
      <Animated.View exiting={FadeOut}>
        <Pressable
          className={`pl-3 flex-row items-center justify-between bg-[${themes[theme].background}]`}
          onPress={() => {
            if (
              openSwipeableRef.current &&
              openSwipeableRef.current !== swipeableRefs.current[errand.id]
            ) {
              openSwipeableRef.current.close();
              openSwipeableRef.current = null;
              return;
            } else if (openSwipeableRef.current === null) {
              confirmRestoreErrand(errand.id);
            }
            // FIX THISSS
          }}
        >
          {/* Check icon */}
          {errand.completed ? (
            <Octicons
              className="p-3 self-center"
              name={"check-circle-fill"}
              size={20}
              color={"#6E727A"}
            />
          ) : (
            <Octicons
              className="p-3 self-center"
              name={"circle"}
              size={20}
              color={"#6E727A"}
            />
          )}

          {/* Content errand */}
          <View
            style={{ height: 57 }}
            className={`px-1 flex-1 flex-row justify-between items-center border-b ${
              theme === "light" ? "border-gray-300" : "border-neutral-700"
            }`}
          >
            {/* Title & shared user */}
            <View className="flex-1 flex-col px-1">
              <Text
                className={`text-[${themes[theme].taskTitle}] text-lg`}
                numberOfLines={1}
              >
                {errand.title}
              </Text>

              {user.uid !== errand.ownerId &&
                user.uid === errand.assignedId && (
                  <View className="flex-row">
                    <View
                      className={`flex-row my-0.5 px-2 p-0.5 bg-[${themes[theme].taskIncomingFromBg}] rounded-lg items-center gap-2`}
                    >
                      <Ionicons
                        name="send"
                        size={10}
                        color="#6E727A"
                        style={{ transform: [{ rotateY: "180deg" }] }}
                      />
                      <Text
                        className={`text-sm text-[${themes[theme].taskSecondText}]`}
                      >
                        {creatorContact.displayName}
                      </Text>
                    </View>
                  </View>
                )}

              {errand.ownerId === user.uid &&
                user.uid !== errand.assignedId && (
                  <View className="flex-row">
                    <View
                      className={`flex-row my-0.5 px-2 p-0.5 bg-[${themes[theme].outgoingTaskToBg}] rounded-lg items-center gap-2`}
                    >
                      <Ionicons name="send" size={10} color="#6E727A" />
                      <Text
                        className={`text-sm text-[${themes[theme].taskSecondText}]`}
                      >
                        {assignedContact.displayName}
                      </Text>
                    </View>
                  </View>
                )}
            </View>

            {/* Status icons */}
            <View className="flex-row items-center gap-2 pr-4">
              {errand.marked && (
                <Ionicons name="flag" size={17} color="#FFC402" />
              )}
              {/* {errand.repeat && errand.repeat !== "never" && (
                <Ionicons name="repeat" size={17} color="#6E727A" />
              )} */}
              {/* {errand.dateErrand ? (
                <View
                  className={`py-1 px-0.5 rounded-lg items-center justify-center min-w-[88px] ${
                    new Date(
                      `${errand.dateErrand}T${errand.timeErrand || "24:00"}`
                    ) < new Date()
                      ? `${theme === "light" ? "bg-red-100" : "bg-red-950 "}`
                      : `${theme === "light" ? "bg-gray-200" : "bg-neutral-800 "}`
                  }`}
                >
                  <Text
                    className={` ${
                      new Date(
                        `${errand.dateErrand}T${errand.timeErrand || "24:00"}`
                      ) < new Date()
                        ? `${theme === "light" ? "text-red-400" : "text-red-500"}`
                        : `text-[${themes[theme].taskSecondText}]`
                    }`}
                  >
                    {formatErrandDate(errand)}
                  </Text>
                </View>
              ) : (
                <View
                  className={`py-2 px-2 rounded-full items-center justify-center border border-dashed ${theme === "light" ? "border-gray-400" : "border-neutral-700"}`}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={17}
                    color={`${themes[theme].taskSecondText}`}
                  />
                </View>
              )} */}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Swipeable>
  );
};

export default SwipeableFullErrand;
