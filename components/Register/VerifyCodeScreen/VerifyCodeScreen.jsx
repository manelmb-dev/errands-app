// components/RegisterScreen.jsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
  Animated,
  Easing,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import { useNavigation, useRouter } from "expo-router";

import { themeAtom } from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

import {
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";

export default function VerifyCodeScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const inputRefs = useRef([]);

  const { callingCode, phone } = useLocalSearchParams();

  const [theme] = useAtom(themeAtom);

  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sendFirebaseCode = async () => {
      const fullPhone = `+${callingCode}${phone}`;
      try {
        const confirmation = await signInWithPhoneNumber(getAuth(), fullPhone);

        console.log("confirmation: ", confirmation);
        setConfirmationResult(confirmation);
      } catch (error) {
        Alert.alert("Error sending code", error.message);
        console.log("error sending code: ", error.message);
      }
    };

    sendFirebaseCode();
  }, [callingCode, phone]);

  useEffect(() => {
    const keyboardShow =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const keyboardHide =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(keyboardShow, () => {
      Animated.timing(translateY, {
        toValue: -100, // ajusta este valor según tu diseño
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(keyboardHide, () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [translateY]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const focusNext = (index) => {
    if (index < 5) inputRefs.current[index + 1]?.focus();
  };

  const focusPrev = (index) => {
    if (index > 0) inputRefs.current[index - 1]?.focus();
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  // 1. send SMS
  const sendSMS = async (phoneNumber) => {
    const confirmation = await signInWithPhoneNumber(getAuth(), phoneNumber);
    setConfirmationResult(confirmation);
  };

  const handleResendSMS = async () => {
    try {
      const fullPhone = `+${callingCode}${phone}`;
      const confirmation = await signInWithPhoneNumber(getAuth(), fullPhone);
      setConfirmationResult(confirmation);
      Alert.alert(i18n.t("codeResent"));
    } catch (error) {
      Alert.alert("Error resending code", error.message);
    }
  };

  const handleCodeVerification = async () => {
    try {
      const code = codeDigits.join("");

      if (!confirmationResult) {
        return Alert.alert("Error", "Código no enviado");
      }

      // ✅ VERIFICA OTP
      const userCredential = await confirmationResult.confirm(code);
      console.log("user credential: ", userCredential)

      const phoneFull = userCredential.user.phoneNumber;
      console.log("user credential full phone: ", phoneFull);

      await AsyncStorage.setItem("userPhoneNumber", phoneFull);

      // 🔁 Consulta backend
      const response = await fetch("http://127.0.0.1:5000/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneFull }),
      });

      const data = await response.json();

      if (data.exists) {
        router.replace("/chooseAccountOption");
      } else {
        router.replace("/completeAccount");
      }
    } catch (error) {
      Alert.alert(i18n.t("invalidCode: ", error));
    }
  };

  const isCodeComplete = codeDigits.every((d) => d !== "");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View
        style={[
          {
            transform: [{ translateY }],
            flex: 1,
            paddingHorizontal: 40,
            justifyContent: "center",
            backgroundColor: themes[theme].background,
            gap: 20,
          },
        ]}
      >
        <View className="items-center gap-6">
          <Image
            source={require("../../../assets/icon.png")}
            style={{ width: 125, height: 125, borderRadius: 25 }}
          />
          <Text
            className={`text-5xl font-bold text-[${themes[theme].text}] self-center`}
          >
            Errands
          </Text>
        </View>
        <View className="w-full gap-4">
          <Text className={`p-1 text-xl text-[${themes[theme].text}]`}>
            {i18n.t("enterVerificationCode") +
              (callingCode && phone ? `: +${callingCode} ${phone}` : ".")}
          </Text>
          <View>
            <View className="w-full flex-row gap-2">
              {codeDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  className={`flex-1 h-14 text-center text-2xl rounded-2xl leading-tight border bg-[${themes[theme].surfaceBackground}] border-[${themes[theme].borderColor}] text-[${themes[theme].text}]`}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onFocus={() => {
                    const firstEmptyIndex = codeDigits.findIndex(
                      (d) => d === ""
                    );
                    if (codeDigits[index] !== "") {
                      inputRefs.current[index]?.focus();
                      return;
                    } else if (
                      firstEmptyIndex !== -1 &&
                      index > firstEmptyIndex
                    ) {
                      inputRefs.current[firstEmptyIndex]?.focus();
                    }
                  }}
                  onChangeText={(text) => {
                    if (/^\d$/.test(text)) {
                      const updatedDigits = [...codeDigits];
                      updatedDigits[index] = text;
                      setCodeDigits(updatedDigits);
                      focusNext(index);
                      if (
                        updatedDigits.every((d) => d !== "") &&
                        updatedDigits.length === 6
                      ) {
                        Keyboard.dismiss();
                      }
                    } else if (text === "") {
                      const updatedDigits = [...codeDigits];
                      updatedDigits[index] = "";
                      setCodeDigits(updatedDigits);
                    }
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace" && !codeDigits[index]) {
                      focusPrev(index);
                    }
                  }}
                />
              ))}
            </View>
            <TouchableOpacity
              className={`p-1 items-end justify-center bg-[${themes[theme].background}]`}
              activeOpacity={0.6}
              onPress={handleResendSMS}
            >
              <Text className={`text-lg text-[${themes[theme].text}]`}>
                {i18n.t("resendCode")}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className={`p-3 rounded-3xl items-center justify-center bg-[${themes[theme].blueHeadText}] ${!isCodeComplete ? "opacity-50" : ""}`}
            activeOpacity={0.6}
            disabled={!isCodeComplete}
            onPress={handleCodeVerification}
          >
            <Text
              className={`p-2 text-2xl font-semibold text-[${themes[theme === "dark" ? "light" : "dark"].text}]`}
            >
              {i18n.t("next")}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
