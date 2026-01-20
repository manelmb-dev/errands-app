import { Pressable, Text, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAtom } from "jotai";
import {
  contactsAtom,
  errandsAtom,
  themeAtom,
  userAtom,
} from "../constants/storeAtoms";

import formatCompletedErrandDate from "../constants/formatCompletedErrandDate";
import formatErrandDate from "../constants/formatCompletedErrandDate";
import { themes } from "../constants/themes";
import i18n from "../constants/i18n";

function CompletedErrand({ errand }) {
  const [user] = useAtom(userAtom);
  const [, setErrands] = useAtom(errandsAtom);
  const [contacts] = useAtom(contactsAtom);
  const [theme] = useAtom(themeAtom);

  const repeatOptions = [
    { label: i18n.t("never"), value: "never" },
    { label: i18n.t("daily"), value: "daily" },
    { label: i18n.t("weekDays"), value: "weekDays" },
    { label: i18n.t("weekendDays"), value: "weekendDays" },
    { label: i18n.t("weekly"), value: "weekly" },
    { label: i18n.t("monthly"), value: "monthly" },
    { label: i18n.t("yearly"), value: "yearly" },
  ];

  const assignedContact = contacts.find(
    (contact) => contact.id.toString() === errand.assignedId.toString()
  );

  const creatorContact = contacts.find(
    (contact) => contact.id.toString() === errand.ownerId.toString()
  );

  const repeatOptionSelected = repeatOptions.find(
    (option) => option.value === errand.repeat
  );

  const uncompleteErrand = () => {
    // FIRESTONEEE UPDATE
    setErrands((prevErrands) =>
      prevErrands.map((e) => {
        if (e.id === errand.id) {
          return {
            ...e,
            completed: false,
            completedDateErrand: "",
            completedTimeErrand: "",
            completedBy: null,
          };
        }
        return e;
      })
    );
  };

  return (
    <Animated.View key={errand.id} exiting={FadeOut}>
      <Pressable
        className={`flex-row bg-[${themes[theme].background}] rounded-xl mx-4 my-1.5 pr-2 pt-3 pb-2  border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
      >
        <Octicons
          onPress={uncompleteErrand}
          className="px-3"
          name="check-circle-fill"
          size={20}
          color="green"
        />
        <View className="flex-1 flex-shrink">
          <Text className="text-[#6E727A] flex-shrink">{errand.title}</Text>
          {user.id !== errand.ownerId && user.id === errand.assignedId && (
            <View className="flex-row">
              <View
                className={`flex-row my-0.5 px-2 p-1 bg-[${themes[theme].taskIncomingFromBg}] rounded-lg items-center gap-2`}
              >
                <Ionicons name="return-down-back" size={14} color="#6E727A" />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className={`flex-shrink text-sm text-[${themes[theme].taskSecondText}]`}
                >
                  {creatorContact.name} {creatorContact.surname}
                </Text>
              </View>
            </View>
          )}
          {errand.ownerId === user.id && user.id !== errand.assignedId && (
            <View className="flex-row">
              <View
                className={`flex-row my-0.5 px-2 p-1 bg-[${themes[theme].outgoingTaskToBg}] rounded-lg items-center gap-2`}
              >
                <Ionicons
                  name="return-down-forward"
                  size={14}
                  color="#6E727A"
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className={`flex-shrink text-sm text-[${themes[theme].taskSecondText}]`}
                >
                  {assignedContact.name} {assignedContact.surname}
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
                  className={`text-sm text-[${themes[theme].taskSecondText}]`}
                >
                  {`${formatErrandDate(errand)}, ${errand.timeErrand}`}
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
          <View className="flex-row items-center">
            <Text className={`text-sm text-[${themes[theme].taskSecondText}]`}>
              {`Completado: ${formatCompletedErrandDate(errand)}, ${errand.completedTimeErrand}`}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-end">
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

export default CompletedErrand;
