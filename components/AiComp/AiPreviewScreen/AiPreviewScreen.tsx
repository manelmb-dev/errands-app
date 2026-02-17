// components/AiComp/AiPreviewScreen/AiPreviewScreen.tsx
import { View, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { themeAtom } from "../../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import AiListPreviewScreen from "./AiListPreviewScreen/AiListPreviewScreen";
import AiTaskPreviewScreen from "./AiTaskPreviewScreen/AiTaskPreviewScreen";
import { useAiDraftGenerator } from "../../../hooks/useAiDraftGenerator";
import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

export default function AiPreviewScreen() {
  const [theme] = useAtom(themeAtom);
  const t = themes[theme];

  const { draft, selectedIds, error, toggleTask, reset } =
    useAiDraftGenerator();

  if (!draft) {
    // fallback
    return (
      <View
        className={`flex-1 items-center justify-center bg-[${t.background}] px-5`}
      >
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={t.taskSecondText}
        />
        <Text className={`text-lg text-[${t.taskSecondText}] mt-4 text-center`}>
          {i18n.t("noDraftAvailable")}
        </Text>

        {!!error && (
          <Text
            className={`mt-2 text-sm ${theme === "light" ? "text-red-700" : "text-red-400"}`}
          >
            {error}
          </Text>
        )}
      </View>
    );
  }

  if (draft.type === "list") {
    return (
      <AiListPreviewScreen
        draft={draft}
        selectedIds={selectedIds}
        toggleTask={toggleTask}
        reset={reset}
        error={error}
      />
    );
  }

  // type === "task"
  return <AiTaskPreviewScreen draft={draft} reset={reset} error={error} />;
}
