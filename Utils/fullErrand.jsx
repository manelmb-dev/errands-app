import DateTimePickerModal from "react-native-modal-datetime-picker";
import Animated, { FadeOut } from "react-native-reanimated";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import {
  contactsAtom,
  errandsAtom,
  listsAtom,
  userAtom,
} from "../constants/storeAtoms";
import { useAtom } from "jotai";
import { themeAtom } from "../constants/storeUiAtoms";

import { Ionicons, Octicons } from "@expo/vector-icons";

import formatErrandDate from "../constants/formatErrandDate";
import { themes } from "../constants/themes";
import i18n from "../constants/i18n";

// TODO: fix problems with id's because of the mock errands. the id of the contacts of the mock errands does not match any id of the contacts

function FullErrand({
  errand,
  openSwipeableRef,
  swipeableRefs,
  onCompleteWithUndo,
}) {
  const today = new Date().toISOString().split("T")[0];

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [contacts] = useAtom(contactsAtom);
  const [lists] = useAtom(listsAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

  const { watch, setValue } = useForm({
    defaultValues: { ...errand },
  });

  const assignedContact = useMemo(() => {
    if (errand.assignedUid === user.uid) return user;

    const contact = contacts.find(
      (contact) => contact.uid === errand.assignedUid,
    );
    if (contact) return contact;

    // FIX THISSSS Below: contacts will have to be replaced for users collection
    const unknownContact = contacts.find(
      (user) => user.uid === errand.assignedUid,
    );
    if (unknownContact) {
      return { id: errand.assignedUid, name: unknownContact.username };
    }
    return null;
  }, [contacts, errand.assignedUid, user]);

  const creatorContact = useMemo(
    () =>
      contacts.find(
        (contact) => contact.uid.toString() === errand.ownerUid.toString(),
      ),
    [contacts, errand.ownerUid],
  );

  const errandList = useMemo(
    () => lists.find((list) => list.id === errand.listId),
    [lists, errand.listId],
  );

  const handleDateTimeConfirm = (datetime) => {
    const dateString = datetime.toISOString().split("T")[0];
    setValue("dateErrand", dateString);
    // const hourString = datetime.toLocaleTimeString([], {
    //   hour: "2-digit",
    //   minute: "2-digit",
    // });
    // setValue("timeErrand", hourString);

    console.log("dateErrand", dateString);

    const updatedErrand = {
      ...errand,
      dateErrand: dateString,
      // timeErrand: hourString,
    };

    setErrands((prevErrands) =>
      prevErrands.map((e) => (e.id === updatedErrand.id ? updatedErrand : e)),
    );

    errands.sort((a, b) => {
      const dateA = new Date(a.dateErrand);
      const dateB = new Date(b.dateErrand);
      return dateA - dateB;
    });

    // Modify errand to DB FIRESTOREEE
    // await updateErrandInFirestore(updatedErrand);

    setIsDateTimePickerVisible(false);
  };

  const completeErrand = () => {
    const actualTime = new Date();
    const formattedDate = actualTime.toISOString().split("T")[0];
    const formattedTime = actualTime.toTimeString().slice(0, 5);

    // Complete errand locally
    setErrands((prev) =>
      prev.map((e) =>
        e.id === errand.id
          ? {
              ...e,
              completed: true,
              completedDateErrand: formattedDate,
              completedTimeErrand: formattedTime,
              completedBy: user.uid,
            }
          : e,
      ),
    );

    // Complete errand after timeout
    onCompleteWithUndo({
      ...errand,
      completed: true,
      completedDateErrand: formattedDate,
      completedTimeErrand: formattedTime,
      completedBy: user.uid,
    });

    // Send notifications if needed to all the users
  };

  const navigateToModal = useCallback(() => {
    if (
      openSwipeableRef.current &&
      openSwipeableRef.current !== swipeableRefs.current[errand.id]
    ) {
      openSwipeableRef.current.close();
      openSwipeableRef.current = null;
      return;
    }

    const pathname =
      errand.ownerUid === user.uid || errandList !== undefined
        ? "Modals/editTaskModal"
        : "Modals/viewIncomingTaskModal";

    router.push({
      pathname,
      params: { errand: JSON.stringify(errand) },
    });
  }, [errand, user.uid, openSwipeableRef, swipeableRefs, errandList]);

  return (
    <Animated.View exiting={FadeOut}>
      <Pressable
        className={`pl-3 flex-row items-center justify-between bg-[${themes[theme].background}]`}
        onPress={navigateToModal}
      >
        {/* Check icon */}
        <Octicons
          onPress={completeErrand}
          className="p-3 self-center"
          name={"circle"}
          size={20}
          color={"#6E727A"}
        />

        {/* Content errand */}
        <View
          style={{ height: 61 }}
          className={`px-1 flex-1 flex-row justify-between items-center border-b ${theme === "light" ? "border-gray-300" : "border-neutral-700"}`}
        >
          {/* Title & shared user */}
          <View className="flex-1 flex-col items-start min-w-0">
            <Text
              className={`text-[${themes[theme].taskTitle}] text-lg`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {errand.title}
            </Text>

            {user.uid !== errand.ownerUid &&
              user.uid === errand.assignedUid &&
              errandList === undefined && (
                <View
                  className={`self-start flex-row my-0.5 p-2 py-0.5 bg-[${themes[theme].taskIncomingFromBg}] rounded-lg items-center gap-2 max-w-full`}
                >
                  <Ionicons name="return-down-back" size={16} color="#6E727A" />
                  <Text
                    className={`flex-shrink text-sm text-[${themes[theme].taskSecondText}]`}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {creatorContact.displayName}
                  </Text>
                </View>
              )}

            {errand.ownerUid === user.uid &&
              user.uid !== errand.assignedUid &&
              assignedContact !== undefined &&
              errandList === undefined && (
                <View
                  className={`self-start flex-row my-0.5 p-2 py-0.5 bg-[${themes[theme].outgoingTaskToBg}] rounded-lg items-center gap-2 max-w-full`}
                >
                  <Ionicons
                    name="return-down-forward"
                    size={16}
                    color="#6E727A"
                  />
                  <Text
                    className={`flex-shrink text-sm text-[${themes[theme].taskSecondText}]`}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {assignedContact.displayName}
                  </Text>
                </View>
              )}

            {assignedContact &&
              errandList !== undefined &&
              errandList.usersShared.length > 1 && (
                <View
                  className={`self-start flex-row my-0.5 px-2 py-0.5 bg-[${themes[theme].taskAssignedSharedListBg}] rounded-lg items-center max-w-full`}
                >
                  {/* <Ionicons
                      name="return-down-back"
                      size={18}
                      color="#6E727A"
                    /> */}
                  <Text
                    className={`flex-shrink text-sm text-[${themes[theme].taskSecondText}]`}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {assignedContact.displayName}
                  </Text>
                </View>
              )}
          </View>

          {/* Status icons */}
          <View className="flex-row items-center gap-2 pr-4">
            {errand.marked && (
              <Ionicons name="flag" size={17} color="#FFC402" />
            )}
            {errand.repeat && errand.repeat !== "never" && (
              <Ionicons name="repeat" size={17} color="#6E727A" />
            )}
            {errand.dateErrand ? (
              <TouchableOpacity
                activeOpacity={0.6}
                className={`py-1 px-0.5 rounded-lg items-center justify-center min-w-[88px] ${new Date(`${errand.dateErrand}T${errand.timeErrand || "24:00"}`) < new Date() ? `${theme === "light" ? "bg-red-100" : "bg-red-950 "}` : `${theme === "light" ? "bg-gray-200" : "bg-neutral-800 "}`}`}
                onPress={() => {
                  if (
                    errand.ownerUid === user.uid ||
                    (errandList && errandList.usersShared.length > 1)
                  ) {
                    setIsDateTimePickerVisible(true);
                  } else {
                    router.push({
                      pathname: "Modals/viewIncomingTaskModal",
                      params: { errand: JSON.stringify(errand) },
                    });
                  }
                }}
              >
                <Text
                  className={` ${new Date(`${errand.dateErrand}T${errand.timeErrand || "24:00"}`) < new Date() ? `${theme === "light" ? "text-red-400" : "text-red-500"}` : `text-[${themes[theme].taskSecondText}]`}`}
                >
                  {formatErrandDate(errand)}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.6}
                className={`py-1 px-1 rounded-full items-center justify-center border border-dashed ${theme === "light" ? "border-gray-400" : "border-neutral-700"}`}
                onPress={() => {
                  if (errand.ownerUid === user.uid) {
                    setIsDateTimePickerVisible(true);
                  } else {
                    router.push({
                      pathname: "Modals/viewIncomingTaskModal",
                      params: { errand: JSON.stringify(errand) },
                    });
                  }
                }}
              >
                <Ionicons
                  className="p-0.5 self-center"
                  name="calendar-outline"
                  size={19}
                  color={`${themes[theme].taskSecondText}`}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Pressable>

      <DateTimePickerModal
        isVisible={isDateTimePickerVisible}
        isDarkModeEnabled={theme === "dark"}
        themeVariant={theme === "light" ? "light" : "dark"}
        mode="date"
        display="inline"
        date={
          watch("dateErrand") ? new Date(watch("dateErrand")) : new Date(today)
        }
        onConfirm={handleDateTimeConfirm}
        onCancel={() => setIsDateTimePickerVisible(false)}
        locale={i18n.locale}
        accentColor={themes[theme].blueHeadText}
        textColor={themes[theme].text}
        confirmTextIOS={i18n.t("confirm")}
        cancelTextIOS={i18n.t("cancel")}
        minuteInterval={5}
      />
    </Animated.View>
  );
}

export default FullErrand;
