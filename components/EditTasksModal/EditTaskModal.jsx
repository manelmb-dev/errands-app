import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { themes } from "../../constants/themes";
import { themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";
import Ionicons from "react-native-vector-icons/Ionicons";

const EditTaskModal = () => {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);

  const { errand } = useLocalSearchParams();
  const currentErrand = JSON.parse(errand);

  useEffect(() => {
    navigation.setOptions({
      title: "Detalles",
      headerBackTitle: "Atrás",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerRight: () => (
        <Ionicons name="options" color={themes[theme].blueHeadText} size={24} />
      ),
    });
  }, [navigation, theme]);

  return (
    <View>
      <Text className="text-2xl">{currentErrand.title}</Text>
    </View>
  );
};
export default EditTaskModal;
