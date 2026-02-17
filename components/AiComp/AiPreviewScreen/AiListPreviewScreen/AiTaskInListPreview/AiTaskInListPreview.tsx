import { Pressable, Text, View } from "react-native";

import { Ionicons, Octicons } from "@expo/vector-icons";

import { ThemeMode } from "../../../../../constants/storeUiAtoms";

import { AiDraft } from "../../../types";
import { ThemeTokens, themes } from "../../../../../constants/themes";

type DraftList = Extract<AiDraft, { type: "list" }>;
type DraftTask = DraftList["tasks"][number];

type Props = {
  item: DraftTask;
  checked: boolean;
  onToggle: () => void;
  theme: ThemeMode;
  t: ThemeTokens;
};

export default function AiTaskInListPreview({
  item,
  checked,
  onToggle,
  theme,
  t,
}: Props) {
  return (
    <Pressable
      className={`pl-3 flex-row items-center justify-between bg-[${t.background}]`}
      onPress={onToggle}
    >
      {/* Check icon for selection */}
      <Octicons
        className="p-3 self-center"
        name={checked ? "check-circle-fill" : "circle"}
        size={20}
        color={checked ? t.blueHeadText : "#6E727A"}
      />

      {/* Content errand */}
      <View
        style={{ height: 61 }}
        className={`px-1 flex-1 flex-row justify-between items-center border-b ${theme === "light" ? "border-gray-300" : "border-neutral-700"}`}
      >
        {/* Title & metadata badges */}
        <View className="flex-1 flex-col items-start min-w-0">
          <Text
            className={`text-[${t.taskTitle}] text-lg`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>

          {/* Assigned user badge */}
          {!!item.assignedName && (
            <View
              className={`self-start flex-row my-0.5 px-2 py-0.5 bg-[${t.taskAssignedSharedListBg}] rounded-lg items-center max-w-full`}
            >
              <Text
                className={`flex-shrink text-sm text-[${t.taskSecondText}]`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.assignedName}
              </Text>
            </View>
          )}
        </View>

        {/* Status icons and date */}
        <View className="flex-row items-center gap-2 pr-4">
          {/* Priority flag */}
          {!!item.priority && item.priority !== "none" && (
            <Ionicons
              name="flag"
              size={17}
              color={
                item.priority === "high"
                  ? "#DC2626"
                  : item.priority === "medium"
                    ? "#F97316"
                    : "#FFC402"
              }
            />
          )}

          {/* Date display */}
          {!!item.dateErrand && (
            <View
              className={`py-1 px-2 rounded-lg items-center justify-center min-w-[88px] ${theme === "light" ? "bg-gray-200" : "bg-neutral-800"}`}
            >
              <Text className={`text-[${t.taskSecondText}]`}>
                {item.dateErrand}
                {!!item.timeErrand && ` ${item.timeErrand}`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
