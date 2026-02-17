import { useNavigation } from "expo-router";
import { useEffect } from "react";

import { themeAtom } from "../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import { useAiDraftGenerator } from "../../hooks/useAiDraftGenerator";
import AiPreviewScreen from "./AiPreviewScreen/AiPreviewScreen";
import AiPromptScreen from "./AiPromptScreen/AiPromptScreen";
import { themes } from "../../constants/themes";

export default function AiComp() {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);

  const t = themes[theme];

  const { step } = useAiDraftGenerator();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: "",
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: t?.background,
      },
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
  return <AiPreviewScreen />;
}
