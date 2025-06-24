import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { LinearTransition } from "react-native-reanimated";
import { View, Text, Pressable, Alert } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import ActionSheet from "react-native-actionsheet";
import { useNavigation } from "expo-router";

import Ionicons from "react-native-vector-icons/Ionicons";

import { errandsAtom, themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import RenderRightActionsCompletedErrand from "../../Utils/RenderRightActionsCompletedErrand";
import CompletedErrand from "../../Utils/CompletedErrand";
import { themes } from "../../constants/themes";
import i18n from "../../constants/i18n";
import { useErrandActions } from "../../hooks/useErrandActions";
import UndoDeleteErrandButton from "../../Utils/UndoDeleteErrandButton";

function CompletedTasksComp() {
  const navigation = useNavigation();
  const deleteSheetRef = useRef();
  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const [possibleUndoDeleteErrand, setPossibleUndoDeleteErrand] =
    useState(null);

  const { onDeleteWithUndo, undoDeleteErrand } = useErrandActions({
    setErrands,
    setPossibleUndoDeleteErrand,
    possibleUndoDeleteErrand,
  });

  const completedErrands = useMemo(
    () =>
      errands
        .filter((errand) => errand.completed)
        .filter((errand) => !errand.deleted)
        .sort((a, b) => {
          const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
          const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
          return dateB - dateA;
        }),
    [errands]
  );

  const totalErrandsCompleted = completedErrands.length;

  const totalErrandsCompletedOverAMonth = errands
    .filter((errand) => !errand.deleted)
    .filter((errand) => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const errandCompletedDate = new Date(`${errand.completedDateErrand}`);
      return errandCompletedDate < oneMonthAgo && errand.completed;
    }).length;

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("completed"),
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

  const showDeleteActionSheet = () => {
    if (totalErrandsCompleted === 0) return;
    deleteSheetRef.current.show();
  };

  const handleDeleteAll = () => {
    // FIRESTONEEE UPDATE
    setErrands(errands.filter((errand) => !errand.completed));
  };

  const confirmDeleteAll = () => {
    Alert.alert(
      `${i18n.t("delete")} ${totalErrandsCompleted} ${totalErrandsCompleted > 1 ? `${i18n.t("errands").toLowerCase()}` : `${i18n.t("errand").toLowerCase()}`}`,
      "",
      [
        {
          text: i18n.t("delete"),
          onPress: handleDeleteAll,
          style: "destructive",
        },
        { text: i18n.t("cancel") },
      ]
    );
  };

  const handleDeleteOverAMonth = () => {
    // FIRESTONEEE UPDATE
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    setErrands(
      errands.filter((errand) => {
        const errandCompletedDate = new Date(`${errand.completedDateErrand}`);
        return errandCompletedDate > oneMonthAgo || !errand.completed;
      })
    );
  };
  // REVISARRRRRR lo de arriba

  const confirmDeleteOverAMonth = () => {
    Alert.alert(
      `${i18n.t("delete")} ${totalErrandsCompletedOverAMonth} ${totalErrandsCompletedOverAMonth > 1 ? `${i18n.t("errands").toLowerCase()}` : `${i18n.t("errand").toLowerCase()}`}`,
      "",
      [
        {
          text: i18n.t("delete"),
          onPress: handleDeleteOverAMonth,
          style: "destructive",
        },
        { text: i18n.t("cancel") },
      ]
    );
  };

  const deleteOptions = [
    {
      label: i18n.t("deleteAll"),
      value: "all",
      delete: confirmDeleteAll,
    },
    {
      label: i18n.t("moreThanAMonthAgo"),
      value: "overAMonth",
      delete: confirmDeleteOverAMonth,
    },
  ];

  return (
    <View
      className={`h-full bg-[${themes[theme].background}]`}
      style={{ flex: 1 }}
      onStartShouldSetResponder={() => {
        if (openSwipeableRef.current) {
          openSwipeableRef.current.close();
          openSwipeableRef.current = null;
          return true;
        }
        return false;
      }}
    >
      <View className="w-full flex-row items-center justify-center gap-2">
        <Text
          className={`text-lg text-[${themes[theme].listTitle}]`}
        >{`${totalErrandsCompleted} ${i18n.t("completed")}`}</Text>
        <Text
          className={`text-lg text-[${themes[theme].listTitle}] font-semibold`}
        >
          -
        </Text>
        <Pressable onPress={showDeleteActionSheet}>
          <Text
            className={`text-lg ${
              totalErrandsCompleted === 0
                ? `text-[${themes[theme].text}]`
                : `text-[${themes[theme].blueHeadText}] font-bold`
            }`}
          >
            {i18n.t("delete")}
          </Text>
        </Pressable>
      </View>
      {totalErrandsCompleted === 0 && (
        <View className="mb-64 flex-1 flex-row items-center justify-center">
          <Text className={`text-xl text-[${themes[theme].text}]`}>
            {i18n.t("thereAreNoCompletedErrands")}
          </Text>
        </View>
      )}
      {totalErrandsCompleted > 0 && (
        <Animated.FlatList
          itemLayoutAnimation={LinearTransition}
          data={completedErrands}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            return (
              <Swipeable
                ref={(ref) => (swipeableRefs.current[item.id] = ref)}
                renderRightActions={() => (
                  <RenderRightActionsCompletedErrand
                    errand={item}
                    setErrands={setErrands}
                    onDeleteWithUndo={onDeleteWithUndo}
                  />
                )}
                onSwipeableOpenStartDrag={() => {
                  if (
                    openSwipeableRef.current &&
                    openSwipeableRef.current !== swipeableRefs.current[item.id]
                  ) {
                    openSwipeableRef.current.close();
                  }
                  openSwipeableRef.current = swipeableRefs.current[item.id];
                }}
              >
                <CompletedErrand errand={item} />
              </Swipeable>
            );
          }}
        />
      )}

      {possibleUndoDeleteErrand && (
        <UndoDeleteErrandButton
          possibleUndoDeleteErrand={possibleUndoDeleteErrand}
          undoDeleteErrand={undoDeleteErrand}
          openSwipeableRef={openSwipeableRef}
          setPossibleUndoDeleteErrand={setPossibleUndoDeleteErrand}
        />
      )}

      <ActionSheet
        ref={deleteSheetRef}
        title={i18n.t("deleteCompletedErrands")}
        options={[
          ...deleteOptions.map((option) => option.label),
          i18n.t("cancel"),
        ]}
        cancelButtonIndex={deleteOptions.length}
        onPress={(index) => {
          if (index === deleteOptions.length) return;
          deleteOptions[index].delete();
        }}
      />
    </View>
  );
}
export default CompletedTasksComp;
