import { Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";

import {
  contactsAtom,
  errandsAtom,
  themeAtom,
  userAtom,
} from "../constants/storeAtoms";
import { useAtom } from "jotai";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import formatErrandDate from "../constants/formatErrandDate";
import { themes } from "../constants/themes";
import { router } from "expo-router";

const repeatOptions = [
  { label: "Nunca", value: "never" },
  { label: "Todos los días", value: "daily" },
  { label: "Entre semana", value: "weekDays" },
  { label: "Los fines de semana", value: "weekendDays" },
  { label: "Todas las semanas", value: "weekly" },
  { label: "Todos los meses", value: "monthly" },
  { label: "Todos los años", value: "yearly" },
];

function FullErrand({
  errand,
  openSwipeableRef,
  swipeableRefs,
  onCompleteWithUndo,
}) {
  const [user] = useAtom(userAtom);
  const [, setErrands] = useAtom(errandsAtom);
  const [contacts] = useAtom(contactsAtom);
  const [theme] = useAtom(themeAtom);

  const assignedContact = contacts.find(
    (contact) => contact.id.toString() === errand.assignedId.toString()
  );

  const creatorContact = contacts.find(
    (contact) => contact.id.toString() === errand.ownerId.toString()
  );

  const repeatOptionSelected = repeatOptions.find(
    (option) => option.value === errand.repeat
  );

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
            }
          : e
      )
    );

    // Complete errand after timeout
    onCompleteWithUndo({
      ...errand,
      completed: true,
      completedDateErrand: formattedDate,
      completedTimeErrand: formattedTime,
    });
  };

  return (
    <Animated.View exiting={FadeOut}>
      <Pressable
        className={`flex-row bg-[${themes[theme].buttonMenuBackground}] rounded-xl mx-4 my-1.5 pr-2 pt-3 pb-2 border-hairline ${theme === "light" ? "border-gray-300" : "border-neutral-950"} shadow ${theme === "light" ? "shadow-gray-200" : "shadow-neutral-950"}`}
        onPress={() => {
          if (
            openSwipeableRef.current &&
            openSwipeableRef.current !== swipeableRefs.current[errand.id]
          ) {
            openSwipeableRef.current.close();
            openSwipeableRef.current = null;
            return;
          }
          router.push({
            pathname: "Modals/editTaskModal",
            params: { errand: JSON.stringify(errand) },
          });
        }}
      >
        <Octicons
          onPress={completeErrand}
          className="px-2"
          name={"circle"}
          size={21}
          color={"#6E727A"}
        />
        <View className="flex-1">
          <TextInput
            className={`text-[${themes[theme].taskTitle}]`}
            defaultValue={errand.title}
          />
          {user.id !== errand.ownerId && user.id === errand.assignedId && (
            <View className="flex-row">
              <View
                className={`flex-row my-0.5 px-2 p-1 bg-[${themes[theme].taskReceivedFromBg}] rounded-xl items-center gap-2`}
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
                  {creatorContact.name} {creatorContact.surname}
                </Text>
              </View>
            </View>
          )}
          {errand.ownerId === user.id && user.id !== errand.assignedId && (
            <View className="flex-row">
              <View
                className={`flex-row my-0.5 px-2 p-1 bg-[${themes[theme].submittedTaskToBg}] rounded-xl items-center gap-2`}
              >
                <Ionicons name="send" size={10} color="#6E727A" />
                <Text
                  className={`text-sm text-[${themes[theme].taskSecondText}]`}
                >
                  <Text
                    className={`text-sm text-[${themes[theme].taskSecondText}]`}
                  >
                    {assignedContact.name} {assignedContact.surname}
                  </Text>
                </Text>
              </View>
            </View>
          )}
          {errand.description && (
            <View>
              <Text
                className={`text-sm text-[${themes[theme].taskSecondText}]`}
              >
                {errand.description}
              </Text>
            </View>
          )}
          <View className="flex-row">
            {errand.dateErrand && (
              <View className="flex-row items-center">
                <Text
                  className={`text-sm ${
                    new Date(
                      `${errand.dateErrand}T${errand.timeErrand || "24:00"}`
                    ) < new Date()
                      ? "text-red-600"
                      : `text-[${themes[theme].taskSecondText}]`
                  }`}
                >
                  {formatErrandDate(errand)}
                </Text>
              </View>
            )}
            {errand.repeat && errand.repeat !== "never" && (
              <View className="flex-row items-center ml-2">
                <Ionicons name="repeat" size={16} color="#6E727A" />
                <Text
                  className={`text-sm text-[${themes[theme].taskSecondText}] ml-1`}
                >
                  {repeatOptionSelected.label}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View className="flex-row justify-end">
          {/* {new Date(`${errand.dateErrand}T${errand.timeErrand || "24:00"}`) <
            new Date() && (
            <Pressable>
              <Ionicons
                className="mt-1 ml-1"
                name="calendar-outline"
                size={20}
                color="#dc2626"
              />
            </Pressable>
          )} */}
          {errand.marked && (
            <Ionicons
              className="mt-1 ml-1"
              name="flag"
              size={20}
              color="#FFC402"
            />
          )}
          {/* <Ionicons
            className="ml-1"
            name="information-circle-outline"
            size={26}
            color="#6E727A"
          /> */}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default FullErrand;
