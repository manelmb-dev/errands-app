import { ScrollView, Text, View, Pressable, Share } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { themeAtom } from "../../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

export default function FriendInviteSection() {
  const navigation = useNavigation();
  const [theme] = useAtom(themeAtom);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: i18n.t("inviteFriends"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerBackTitle: i18n.t("back"),
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  const handleInvite = async () => {
    try {
      await Share.share({
        message: i18n.t("inviteAppMessage"),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ScrollView
      className={`flex-1 px-6 pt-10 bg-[${themes[theme].background}]`}
    >
      <View className="mb-10">
        <Text
          className={`text-lg text-[${themes[theme].text}] leading-relaxed`}
        >
          {i18n.t("inviteDescription")}
        </Text>
      </View>

      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.95, { stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { stiffness: 200 });
        }}
        onPress={handleInvite}
      >
        <Animated.View
          className={`py-4 rounded-xl items-center bg-[${themes[theme].blueHeadText}]`}
          style={[
            {
              shadowColor: themes[theme].blueHeadText,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5, // Android
            },
            animatedStyle,
          ]}
        >
          <Text
            className={`text-lg font-semibold text-[${themes["dark"].text}]`}
          >
            {i18n.t("shareInvitation")}
          </Text>
        </Animated.View>
      </Pressable>
    </ScrollView>
  );
}
