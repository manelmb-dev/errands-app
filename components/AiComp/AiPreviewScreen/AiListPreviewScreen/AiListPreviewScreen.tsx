// components/AiComp/AiPreviewScreen/AiListPreviewScreen/AiListPreviewScreen.tsx
import { FlatList, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { themeAtom } from "../../../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import AiTaskInListPreview from "./AiTaskInListPreview/AiTaskInListPreview";
import { themes } from "../../../../constants/themes";
import { listColorBgClass } from "./colorMap";
import i18n from "../../../../constants/i18n";
import { toIoniconName } from "./iconMap";
import { AiDraft } from "../../types";

type DraftList = Extract<AiDraft, { type: "list" }>;
type DraftTask = DraftList["tasks"][number];

type Props = {
  draft: DraftList;
  selectedIds: string[];
  toggleTask: (id: string) => void;
  reset: () => void;
  error: string | null;
};

export default function AiListPreviewScreen({
  draft,
  selectedIds,
  toggleTask,
  reset,
  error,
}: Props) {
  const [theme] = useAtom(themeAtom);
  const t = themes[theme];

  return (
    <View className={`flex-1 w-full pt-24 px-4 bg-[${t.background}]`}>
      {/* Header */}
      <View className="flex-row items-center justify-center gap-5">
        <View
          className={`p-3 justify-center items-center ${listColorBgClass(draft.list.color, theme)} rounded-2xl shadow ${theme === "light" ? "shadow-gray-200" : "shadow-neutral-950"}`}
        >
          <Ionicons
            name={toIoniconName(draft.list.icon)}
            size={42}
            color={t.text}
          />
        </View>
        <View>
          <Text className={`text-xl font-bold text-[${t.text}]`}>
            {draft.list.title}
          </Text>
          <Text className={`text-lg text-[${t.taskSecondText}] mt-1`}>
            {selectedIds.length}{" "}
            {selectedIds.length === 1 ? i18n.t("task") : i18n.t("tasks")}
          </Text>
        </View>
      </View>

      <Pressable onPress={reset} hitSlop={8}>
        <View className="flex-row items-center gap-2 px-4 py-2 rounded-full">
          <Ionicons name="refresh" size={18} color={t.blueHeadText} />
          <Text className={`text-[${t.blueHeadText}] font-semibold`}>
            {i18n.t("retry")}
          </Text>
        </View>
      </Pressable>

      {/* Instructions */}
      <View className="px-5 py-4">
        <Text className={`text-base text-[${t.taskSecondText}]`}>
          {i18n.t("selectTasksToCreate")}
        </Text>
      </View>

      {/* Task List */}
      <FlatList
        data={draft.tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }: { item: DraftTask }) => (
          <AiTaskInListPreview
            item={item}
            checked={selectedIds.includes(item.id)}
            onToggle={() => toggleTask(item.id)}
            theme={theme}
            t={t}
          />
        )}
      />

      {/* Create Button */}
      <View
        className={`absolute bottom-0 left-0 right-0 p-5 bg-[${t.background}] border-t border-[${t.borderColor}]`}
      >
        <Pressable
          onPress={() => console.log("Create list from draft")}
          disabled={selectedIds.length === 0}
          className={`rounded-2xl overflow-hidden ${selectedIds.length === 0 ? "opacity-50" : ""}`}
        >
          <View
            className={`p-4 flex-row items-center justify-center gap-3 ${
              theme === "light" ? "bg-blue-500" : "bg-blue-600"
            }`}
          >
            <Ionicons name="add-circle" size={22} color="#FFFFFF" />
            <Text className="text-white text-lg font-semibold">
              {i18n.t("createList")} ({selectedIds.length})
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
    </View>
  );
}
