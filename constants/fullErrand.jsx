import { Pressable, Text, TextInput, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { contactsAtom, errandsAtom, themeAtom, userAtom } from "./storeAtoms";
import { useAtom } from "jotai";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import formatErrandDate from "./formatErrandDate";
import { themes } from "./themes";
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

function FullErrand({ errand }) {
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

  const renderRightActions = () => (
    <View className="flex-row h-full mr-1">
      <Pressable
        className="w-16 my-1 rounded-xl bg-blue-600 justify-center items-center"
        onPress={() => {
          router.push({
            pathname: "Modals/editTaskModal",
            params: {
              errand: JSON.stringify(errand),
            },
          });
        }}
      >
        <Ionicons name="list-circle" size={24} color="white" />
      </Pressable>
      <Pressable
        className="w-16 my-1 rounded-xl bg-red-600 justify-center items-center"
        onPress={() =>
          setErrands((errands) => errands.filter((e) => e.id !== errand.id))
        }
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </Pressable>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View
        className={`flex-row bg-[${themes[theme].buttonMenuBackground}] shadow shadow-slate-200 rounded-xl mx-4 my-1 pr-2 pt-3 pb-2 border-hairline ${theme === "light" ? "shadow-slate-200" : "shadow-neutral-950"}`}
      >
        <View className="pl-3">
          <Octicons name="circle" size={18} color="#6E727A" />
        </View>
        <View className="flex-1 pl-3">
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
                <Text className="text-sm text-[#6E727A] ml-1">
                  {repeatOptionSelected.label}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View className="flex-row justify-end">
          {new Date(`${errand.dateErrand}T${errand.timeErrand || "24:00"}`) <
            new Date() && (
            <Pressable>
              <Ionicons
                className="mt-1 ml-1"
                name="calendar-outline"
                size={20}
                color="#dc2626"
              />
            </Pressable>
          )}
          {errand.marked && (
            <Ionicons
              className="mt-1 ml-1"
              name="flag"
              size={20}
              color="#FFC402"
            />
          )}
          <Ionicons
            className="ml-1"
            name="information-circle-outline"
            size={26}
            color="#6E727A"
          />
        </View>
      </View>
    </Swipeable>
  );
}

export default FullErrand;
