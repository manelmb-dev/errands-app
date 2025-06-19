import Animated, { LinearTransition } from "react-native-reanimated";
import { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "expo-router";

import Ionicons from "react-native-vector-icons/Ionicons";

import { errandsAtom, themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";
import SwipeableDeletedErrand from "./SwipeableDeletedErrand/SwipeableDeletedErrand";

function DeletedTasksComp() {
  const navigation = useNavigation();
  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const [showEmpty, setShowEmpty] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("deletedErrands"),
      headerBackTitle: i18n.t("back"),
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

  const flatListData = errands
    .filter((errand) => errand.deleted)
    .sort((a, b) => new Date(a.dateDeleted) - new Date(b.dateDeleted));

  useEffect(() => {
    if (flatListData.length === 0) {
      // Espera la duración del FadeOut (~300ms suele ir bien)
      const timer = setTimeout(() => setShowEmpty(true), 300);
      return () => clearTimeout(timer);
    } else {
      // Si vuelve a haber tareas, oculta el empty inmediatamente
      setShowEmpty(false);
    }
  }, [flatListData.length]);

  return (
    <View className={`flex-1 bg-[${themes[theme].background}]`}>
      <Text className={`m-4 text-lg text-[${themes[theme].taskSecondText}]`}>
        {i18n.t("deletedErrandsCompText")}
      </Text>
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={flatListData}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() =>
          showEmpty && (
            <Text
              className={`my-8 text-xl text-center text-[${themes[theme].text}]`}
            >
              {i18n.t("noDeletedErrands")}
            </Text>
          )
        }
        renderItem={({ item }) => (
          <SwipeableDeletedErrand
            errand={item}
            setErrands={setErrands}
            openSwipeableRef={openSwipeableRef}
            swipeableRefs={swipeableRefs}
          />
        )}
      />
    </View>
  );
}
export default DeletedTasksComp;
