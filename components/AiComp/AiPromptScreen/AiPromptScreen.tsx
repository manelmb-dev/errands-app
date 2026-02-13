import { useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
  Animated,
  Easing,
  Keyboard,
} from "react-native";

import { useAtom } from "jotai";
import { themeAtom } from "../../../constants/storeAtoms";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import i18n from "../../../constants/i18n";
import { themes } from "../../../constants/themes";

import { useAiDraftGenerator } from "../../../hooks/useAiDraftGenerator";

export default function AiPromptScreen() {
  const [theme] = useAtom(themeAtom as any);

  const t = themes[theme as keyof typeof themes];

  const { prompt, setPrompt, loading, error, generate } = useAiDraftGenerator();

  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const inputTranslateY = useRef(new Animated.Value(0)).current;
  const OFFSET_IOS = 78;

  useEffect(() => {
    if (Platform.OS !== "ios") return;

    const showSub = Keyboard.addListener("keyboardWillShow", (e) => {
      const keyboardH = e.endCoordinates.height;
      const move = Math.min(0, -(keyboardH - OFFSET_IOS));

      Animated.parallel([
        Animated.timing(headerTranslateY, {
          toValue: move * 0.55, // header se mueve menos
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(inputTranslateY, {
          toValue: move,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });

    const hideSub = Keyboard.addListener("keyboardWillHide", (e) => {
      Animated.parallel([
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(inputTranslateY, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Pressable className="flex-1 w-full" onPress={Keyboard.dismiss}>
      <View className={`flex-1 w-full pt-24 px-4 bg-[${t.background}]`}>
        <View className={`flex-1 w-full pb-3`}>
          <View className="flex-1 w-full justify-between">
            {/* Header Section */}
            <Animated.View
              className="flex-1 items-center justify-center"
              style={{ transform: [{ translateY: headerTranslateY }] }}
            >
              <View
                className={`mb-3 p-3 rounded-2xl ${theme === "light" ? "bg-blue-100" : "bg-blue-900"}`}
              >
                <MaterialCommunityIcons
                  name="robot-outline"
                  size={40}
                  color={t.blueHeadText}
                />
              </View>
              <Text className={`text-3xl font-bold text-[${t.text}]`}>
                {i18n.t("aiAssistant")}
              </Text>
              <Text className={`text-lg text-[${t.taskSecondText}] mt-1`}>
                {i18n.t("aiPoweredTaskCreation")}
              </Text>
            </Animated.View>

            {/* Input Section */}
            <Animated.View
              className="gap-2"
              style={{ transform: [{ translateY: inputTranslateY }] }}
            >
              <View
                className={`rounded-2xl ${theme === "light" ? "bg-gray-200" : `bg-[${t.surfaceBackground}]`} overflow-hidden`}
              >
                <TextInput
                  value={prompt}
                  onChangeText={setPrompt}
                  placeholder={i18n.t("aiInputPlaceholder")}
                  placeholderTextColor={t.taskSecondText}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  className={`p-3 text-xl text-[${t.text}] min-h-[80px]`}
                />
              </View>

              {/* Generate Button */}
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  generate();
                }}
                disabled={loading || !prompt.trim()}
                className={`rounded-2xl overflow-hidden ${
                  loading || !prompt.trim() ? "opacity-50" : ""
                }`}
              >
                <View
                  className={`p-4 flex-row items-center justify-center gap-3 ${
                    theme === "light" ? "bg-blue-500" : "bg-blue-600"
                  }`}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator color="#FFFFFF" />
                      <Text className="text-white text-lg font-semibold">
                        {i18n.t("generating")}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="sparkles" size={22} color="#FFFFFF" />
                      <Text className="text-white text-lg font-semibold">
                        {i18n.t("generateWithAi")}
                      </Text>
                    </>
                  )}
                </View>
              </Pressable>

              {/* Error Message */}
              {error && (
                <View
                  className={` p-4 rounded-2xl ${theme === "light" ? "bg-red-50" : "bg-red-900/20"} border ${theme === "light" ? "border-red-200" : "border-red-800"}`}
                >
                  <View className="flex-row items-center gap-3">
                    <Ionicons
                      name="alert-circle"
                      size={20}
                      color={theme === "light" ? "#DC2626" : "#EF4444"}
                    />
                    <Text
                      className={`flex-1 text-base ${theme === "light" ? "text-red-700" : "text-red-400"}`}
                    >
                      {error}
                    </Text>
                  </View>
                </View>
              )}
            </Animated.View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
