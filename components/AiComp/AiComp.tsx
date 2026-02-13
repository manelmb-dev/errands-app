import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { useEffect, useRef } from "react";
import { useNavigation } from "expo-router";

import { useAtom } from "jotai";
import { themeAtom } from "../../constants/storeAtoms";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import i18n from "../../constants/i18n";
import { themes } from "../../constants/themes";

import { useAiDraftGenerator } from "../../hooks/useAiDraftGenerator";
import AiPromptScreen from "./AiPromptScreen/AiPromptScreen";

export default function AiComp() {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom as any);

  const t = themes[theme as keyof typeof themes];

  const {
    step,
    draft,
    selectedIds,
    error,
    toggleTask,
    reset,
  } = useAiDraftGenerator();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: "",
      headerStyle: {
        backgroundColor: t?.background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation]);

  // --- UI: Prompt Screen ---
  if (step === "prompt") {
    return <AiPromptScreen />;
  }

  // --- UI: Preview Screen ---
  return (
    <View className={`flex-1 w-full pt-24 px-4 bg-[${t.background}]`}>
      {/* Header */}
      <View className={`pt-4 pb-3 border-b border-[${t.borderColor}]`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className={`text-xl font-bold text-[${t.text}]`}>
              {draft?.type === "list"
                ? draft.list.title
                : i18n.t("taskPreview")}
            </Text>
            <Text className={`text-sm text-[${t.taskSecondText}] mt-1`}>
              {draft?.type === "list"
                ? `${draft.tasks.length} ${draft.tasks.length === 1 ? i18n.t("task") : i18n.t("tasks")}`
                : i18n.t("singleTask")}
            </Text>
          </View>
          <Pressable
            onPress={reset}
            className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-[${t.background}]"
            hitSlop={8}
          >
            <Ionicons name="refresh" size={18} color={t.blueHeadText} />
            <Text className={`text-[${t.blueHeadText}] font-semibold`}>
              {i18n.t("retry")}
            </Text>
          </Pressable>
        </View>
      </View>

      {draft?.type === "list" ? (
        <View className="flex-1 w-full">
          {/* Instructions */}
          <View className="px-5 py-4">
            <Text className={`text-sm text-[${t.taskSecondText}]`}>
              {i18n.t("selectTasksToCreate")}
            </Text>
          </View>

          {/* Task List */}
          <FlatList
            data={draft.tasks}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            renderItem={({ item }) => {
              const checked = selectedIds.includes(item.id);
              return (
                <Pressable onPress={() => toggleTask(item.id)} className="mb-3">
                  <View
                    className={`p-4 rounded-2xl bg-[${t.surfaceBackground}] border ${
                      checked
                        ? `border-[${t.blueHeadText}]`
                        : `border-[${t.borderColor}]`
                    }`}
                  >
                    <View className="flex-row items-start gap-3">
                      <View className="pt-0.5">
                        <Ionicons
                          name={
                            checked ? "checkmark-circle" : "ellipse-outline"
                          }
                          size={24}
                          color={checked ? t.blueHeadText : t.taskSecondText}
                        />
                      </View>
                      <View className="flex-1">
                        <Text
                          className={`text-base font-semibold text-[${t.text}] mb-1`}
                        >
                          {item.title}
                        </Text>
                        {item.description && (
                          <Text
                            className={`text-sm text-[${t.taskSecondText}] mb-2`}
                          >
                            {item.description}
                          </Text>
                        )}
                        <View className="flex-row flex-wrap gap-2 mt-1">
                          {item.dateErrand && (
                            <View
                              className={`flex-row items-center gap-1 px-2 py-1 rounded-lg ${theme === "light" ? "bg-blue-50" : `bg-blue-900/30`}`}
                            >
                              <Ionicons
                                name="calendar-outline"
                                size={14}
                                color={t.blueHeadText}
                              />
                              <Text
                                className={`text-xs text-[${t.blueHeadText}]`}
                              >
                                {item.dateErrand}
                                {item.timeErrand && ` ${item.timeErrand}`}
                              </Text>
                            </View>
                          )}
                          {item.priority && item.priority !== "none" && (
                            <View
                              className={`flex-row items-center gap-1 px-2 py-1 rounded-lg ${
                                item.priority === "high"
                                  ? theme === "light"
                                    ? "bg-red-50"
                                    : "bg-red-900/30"
                                  : item.priority === "medium"
                                    ? theme === "light"
                                      ? "bg-orange-50"
                                      : "bg-orange-900/30"
                                    : theme === "light"
                                      ? "bg-gray-100"
                                      : "bg-gray-800"
                              }`}
                            >
                              <Ionicons
                                name="flag"
                                size={14}
                                color={
                                  item.priority === "high"
                                    ? "#DC2626"
                                    : item.priority === "medium"
                                      ? "#F97316"
                                      : t.taskSecondText
                                }
                              />
                              <Text
                                className={`text-xs ${
                                  item.priority === "high"
                                    ? "text-red-600"
                                    : item.priority === "medium"
                                      ? "text-orange-600"
                                      : `text-[${t.taskSecondText}]`
                                }`}
                              >
                                {i18n.t(item.priority)}
                              </Text>
                            </View>
                          )}
                          {item.assignedName && (
                            <View
                              className={`flex-row items-center gap-1 px-2 py-1 rounded-lg ${theme === "light" ? "bg-purple-50" : "bg-purple-900/30"}`}
                            >
                              <Ionicons
                                name="person-outline"
                                size={14}
                                color="#9333EA"
                              />
                              <Text className="text-xs text-purple-600">
                                {item.assignedName}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            }}
          />

          {/* Create Button */}
          <View
            className={`absolute bottom-0 left-0 right-0 p-5 bg-[${t.background}] border-t border-[${t.borderColor}]`}
          >
            <Pressable
              onPress={() => {
                console.log("Create list from draft");
              }}
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
          </View>
        </View>
      ) : draft?.type === "task" ? (
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
                <Ionicons
                  name="document-text"
                  size={24}
                  color={t.blueHeadText}
                />
              </View>
              <View className="flex-1">
                <Text className={`text-xl font-bold text-[${t.text}]`}>
                  {draft.task.title}
                </Text>
              </View>
            </View>

            {draft.task.description && (
              <View className="mb-4">
                <Text
                  className={`text-base text-[${t.taskSecondText}] leading-6`}
                >
                  {draft.task.description}
                </Text>
              </View>
            )}

            {/* Task Details */}
            <View className="gap-3">
              {draft.task.assignedName && (
                <View className="flex-row items-center gap-3">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${theme === "light" ? "bg-purple-100" : "bg-purple-900/30"}`}
                  >
                    <Ionicons name="person" size={20} color="#9333EA" />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-xs text-[${t.taskSecondText}] mb-0.5`}
                    >
                      {i18n.t("assignedTo")}
                    </Text>
                    <Text
                      className={`text-base font-semibold text-[${t.text}]`}
                    >
                      {draft.task.assignedName}
                    </Text>
                  </View>
                </View>
              )}

              {draft.task.dateErrand && (
                <View className="flex-row items-center gap-3">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${theme === "light" ? "bg-blue-100" : "bg-blue-900/30"}`}
                  >
                    <Ionicons
                      name="calendar"
                      size={20}
                      color={t.blueHeadText}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-xs text-[${t.taskSecondText}] mb-0.5`}
                    >
                      {i18n.t("date")}
                    </Text>
                    <Text
                      className={`text-base font-semibold text-[${t.text}]`}
                    >
                      {draft.task.dateErrand}
                      {draft.task.timeErrand &&
                        ` ${i18n.t("at")} ${draft.task.timeErrand}`}
                    </Text>
                  </View>
                </View>
              )}

              {draft.task.priority && draft.task.priority !== "none" && (
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
                    <Text
                      className={`text-xs text-[${t.taskSecondText}] mb-0.5`}
                    >
                      {i18n.t("priority")}
                    </Text>
                    <Text
                      className={`text-base font-semibold text-[${t.text}]`}
                    >
                      {i18n.t(draft.task.priority)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Create Button */}
          <View className="mt-6">
            <Pressable
              onPress={() => {
                console.log("Create task from draft");
              }}
              className={`rounded-2xl overflow-hidden`}
            >
              <View
                className={`p-4 flex-row items-center justify-center gap-3 ${
                  theme === "light" ? "bg-blue-500" : "bg-blue-600"
                }`}
              >
                <Ionicons name="add-circle" size={22} color="#FFFFFF" />
                <Text className="text-white text-lg font-semibold">
                  {i18n.t("createTask")}
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={t.taskSecondText}
          />
          <Text
            className={`text-lg text-[${t.taskSecondText}] mt-4 text-center`}
          >
            {i18n.t("noDraftAvailable")}
          </Text>
        </View>
      )}

      {error && (
        <View
          className={`mx-5 mb-5 p-4 rounded-2xl ${theme === "light" ? "bg-red-50" : `bg-red-900/20`} border ${theme === "light" ? "border-red-200" : "border-red-800"}`}
        >
          <View className="flex-row items-start gap-3">
            <Ionicons
              name="alert-circle"
              size={20}
              color={theme === "light" ? "#DC2626" : "#EF4444"}
            />
            <Text
              className={`flex-1 text-sm ${theme === "light" ? "text-red-700" : "text-red-400"}`}
            >
              {error}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
