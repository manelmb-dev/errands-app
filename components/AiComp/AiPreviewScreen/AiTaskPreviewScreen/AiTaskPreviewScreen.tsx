// components/AiComp/AiPreviewScreen/AiTaskPreviewScreen/AiTaskPreviewScreen.tsx
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { themeAtom } from "../../../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../../constants/themes";
import i18n from "../../../../constants/i18n";
import type { AiDraft } from "../../types";

type DraftTask = Extract<AiDraft, { type: "task" }>;

type Props = {
  draft: DraftTask;
  reset: () => void;
  error: string | null;
};

export default function AiTaskPreviewScreen({ draft, reset, error }: Props) {
  const [theme] = useAtom(themeAtom);
  const t = themes[theme];

  return (
    <View className={`flex-1 w-full pt-24 px-4 bg-[${t.background}]`}>
      {/* Header */}
      <View className={`pt-4 pb-3 border-b border-[${t.borderColor}]`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className={`text-xl font-bold text-[${t.text}]`}>
              {i18n.t("taskPreview")}
            </Text>
            <Text className={`text-sm text-[${t.taskSecondText}] mt-1`}>
              {i18n.t("singleTask")}
            </Text>
          </View>

          <Pressable onPress={reset} hitSlop={8}>
            <View className="flex-row items-center gap-2 px-4 py-2 rounded-full">
              <Ionicons name="refresh" size={18} color={t.blueHeadText} />
              <Text className={`text-[${t.blueHeadText}] font-semibold`}>
                {i18n.t("retry")}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 100,
        }}
      >
        {/* Task Preview Card */}
        <View
          className={`p-5 rounded-2xl bg-[${t.surfaceBackground}] border border-[${t.borderColor}]`}
        >
          <View className="flex-row items-start gap-3 mb-4">
            <View
              className={`p-2 rounded-xl ${theme === "light" ? "bg-blue-100" : "bg-blue-900/30"}`}
            >
              <Ionicons name="document-text" size={24} color={t.blueHeadText} />
            </View>
            <View className="flex-1">
              <Text className={`text-xl font-bold text-[${t.text}]`}>
                {draft.task.title}
              </Text>
            </View>
          </View>

          {!!draft.task.description && (
            <View className="mb-4">
              <Text
                className={`text-base text-[${t.taskSecondText}] leading-6`}
              >
                {draft.task.description}
              </Text>
            </View>
          )}

          {/* Details */}
          <View className="gap-3">
            {!!draft.task.assignedName && (
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${theme === "light" ? "bg-purple-100" : "bg-purple-900/30"}`}
                >
                  <Ionicons name="person" size={20} color="#9333EA" />
                </View>
                <View className="flex-1">
                  <Text className={`text-xs text-[${t.taskSecondText}] mb-0.5`}>
                    {i18n.t("assignedTo")}
                  </Text>
                  <Text className={`text-base font-semibold text-[${t.text}]`}>
                    {draft.task.assignedName}
                  </Text>
                </View>
              </View>
            )}

            {!!draft.task.dateErrand && (
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${theme === "light" ? "bg-blue-100" : "bg-blue-900/30"}`}
                >
                  <Ionicons name="calendar" size={20} color={t.blueHeadText} />
                </View>
                <View className="flex-1">
                  <Text className={`text-xs text-[${t.taskSecondText}] mb-0.5`}>
                    {i18n.t("date")}
                  </Text>
                  <Text className={`text-base font-semibold text-[${t.text}]`}>
                    {draft.task.dateErrand}
                    {!!draft.task.timeErrand &&
                      ` ${i18n.t("at")} ${draft.task.timeErrand}`}
                  </Text>
                </View>
              </View>
            )}

            {!!draft.task.priority && draft.task.priority !== "none" && (
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    draft.task.priority === "high"
                      ? theme === "light"
                        ? "bg-red-100"
                        : "bg-red-900/30"
                      : draft.task.priority === "medium"
                        ? theme === "light"
                          ? "bg-orange-100"
                          : "bg-orange-900/30"
                        : theme === "light"
                          ? "bg-gray-100"
                          : "bg-gray-800"
                  }`}
                >
                  <Ionicons
                    name="flag"
                    size={20}
                    color={
                      draft.task.priority === "high"
                        ? "#DC2626"
                        : draft.task.priority === "medium"
                          ? "#F97316"
                          : t.taskSecondText
                    }
                  />
                </View>
                <View className="flex-1">
                  <Text className={`text-xs text-[${t.taskSecondText}] mb-0.5`}>
                    {i18n.t("priority")}
                  </Text>
                  <Text className={`text-base font-semibold text-[${t.text}]`}>
                    {i18n.t(draft.task.priority)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Create Button */}
        <View className="mt-6">
          <Pressable onPress={() => console.log("Create task from draft")}>
            <View
              className={`p-4 rounded-2xl flex-row items-center justify-center gap-3 ${theme === "light" ? "bg-blue-500" : "bg-blue-600"}`}
            >
              <Ionicons name="add-circle" size={22} color="#FFFFFF" />
              <Text className="text-white text-lg font-semibold">
                {i18n.t("createTask")}
              </Text>
            </View>
          </Pressable>

          {!!error && (
            <Text
              className={`mt-3 text-sm ${theme === "light" ? "text-red-700" : "text-red-400"}`}
            >
              {error}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
