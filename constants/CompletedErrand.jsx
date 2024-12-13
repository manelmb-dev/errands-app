import { Text, TextInput, View } from "react-native";
import { themes } from "./themes";

import { themeAtom } from "./storeAtoms";
import { useAtom } from "jotai";

import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import formatErrandDate from "./formatErrandDate";
import formatCompletedErrandDate from "./formatCompletedErrandDate";

const userId = "user123";

function CompletedErrand({ errand }) {
  const [theme] = useAtom(themeAtom);

  return (
    <View key={errand.id}>
      <View className="flex-row rounded-xl pr-3 pt-3 pb-2">
        <View className="pl-4">
          <Octicons name="check-circle-fill" size={18} color="green" />
        </View>
        <View className="flex-1 pl-3">
          <TextInput className="text-[#6E727A]" defaultValue={errand.title} />
          {userId !== errand.creatorId && userId === errand.assignedId && (
            <View className="flex-row">
              <View
                className={`flex-row my-0.5 px-2 p-1 bg-[${themes[theme].taskReceivedFromBg}] rounded-lg items-center gap-2`}
              >
                <Ionicons
                  name="send"
                  size={10}
                  color="#6E727A"
                  style={{
                    transform: [{ rotateY: "180deg" }],
                  }}
                />
                <Text
                  className={`text-sm text-[${themes[theme].taskSecondText}]`}
                >
                  {errand.creatorId}
                </Text>
              </View>
            </View>
          )}
          {errand.creatorId === userId && userId !== errand.assignedId && (
            <View className="flex-row">
              <View
                className={`flex-row my-0.5 px-2 p-1 bg-[${themes[theme].taskSentToBg}] rounded-lg items-center gap-2`}
              >
                <Ionicons name="send" size={10} color="#6E727A" />
                <Text
                  className={`text-sm text-[${themes[theme].taskSecondText}]`}
                >
                  {errand.assignedId}
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
                  {errand.repeat}
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
          <Ionicons
            className="ml-1"
            name="information-circle-outline"
            size={26}
            color="#6E727A"
          />
        </View>
      </View>
      <View
        className={`h-[0.5px] w-full bg-[${themes[theme].listsSeparator}] ml-11`}
      />
    </View>
  );
}

export default CompletedErrand;
