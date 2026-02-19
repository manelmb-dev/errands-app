import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";

import { errandsAtom } from "../../../../../constants/storeAtoms";
import { themeAtom } from "../../../../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import RenderRightActionsCompletedErrand from "../../../../../Utils/RenderRightActionsCompletedErrand";
import UndoDeleteErrandButton from "../../../../../Utils/UndoDeleteErrandButton";
import { useErrandActions } from "../../../../../hooks/useErrandActions";
import CompletedErrand from "../../../../../Utils/CompletedErrand";
import { themes } from "../../../../../constants/themes";
import i18n from "../../../../../constants/i18n";

const ContactSharedCompletedTasks = () => {
  const navigation = useNavigation();

  const [errands, setErrands] = useAtom(errandsAtom);
  const [theme] = useAtom(themeAtom);

  const { contact } = useLocalSearchParams();
  const currentContact = useMemo(() => JSON.parse(contact), [contact]);

  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [filterTab, setFilterTab] = useState("all"); // all | outgoing | incoming

  const [possibleUndoCompleteErrand, setPossibleUndoCompleteErrand] =
    useState(null);
  const [possibleUndoDeleteErrand, setPossibleUndoDeleteErrand] =
    useState(null);

  const { onDeleteWithUndo, undoDeleteErrand } = useErrandActions({
    setErrands,
    setPossibleUndoCompleteErrand,
    setPossibleUndoDeleteErrand,
    possibleUndoCompleteErrand,
    possibleUndoDeleteErrand,
  });

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("completedErrands"),
      headerBackTitle: i18n.t("back"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  const filterTabOptions = [
    { label: i18n.t("all"), value: "all" },
    { label: i18n.t("outgoing"), value: "outgoing" },
    { label: i18n.t("incoming"), value: "incoming" },
  ];

  const contactSharedCompletedErrands = useMemo(() => {
    return errands
      .filter(
        (errand) =>
          !errand.deleted && errand.completed && errand.listId === "unassigned",
      )
      .filter(
        (errand) =>
          errand.ownerUid === currentContact.uid ||
          errand.assignedUid === currentContact.uid,
      );
  }, [errands, currentContact]);

  const filteredCompletedErrands = useMemo(() => {
    const baseList = contactSharedCompletedErrands.filter((errand) => {
      const incomingTask = errand.ownerUid === currentContact.uid;
      const outgoingTask = errand.assignedUid === currentContact.uid;

      if (filterTab === "incoming" && !incomingTask) return false;
      if (filterTab === "outgoing" && !outgoingTask) return false;

      return true;
    });

    const getErrandDateTime = (e) =>
      new Date(`${e.dateErrand}T${e.timeErrand || "20:00"}`);

    return baseList.sort((a, b) => {
      const dateA = getErrandDateTime(a);
      const dateB = getErrandDateTime(b);
      return dateB - dateA;
    });
  }, [contactSharedCompletedErrands, currentContact, filterTab]);

  return (
    <View className={`h-full bg-[${themes[theme].background}]`}>
      {/* Tabs */}
      <View
        className={`flex-row items-center rounded-full self-center shadow-sm ${theme === "light" ? "shadow-gray-200" : "shadow-neutral-950"}`}
      >
        {filterTabOptions.map((filter, index) => (
          <Pressable
            key={filter.value}
            onPress={() => setFilterTab(filter.value)}
            className={`px-5 items-center justify-center py-3 ${
              filterTab === filter.value
                ? `${theme === "light" ? "bg-gray-300" : "bg-gray-700"}`
                : `bg-[${themes[theme].surfaceBackground}]`
            } ${index === 0 ? "rounded-l-full" : ""} ${
              index === filterTabOptions.length - 1 ? "rounded-r-full" : ""
            }`}
          >
            <Text
              className={`text-lg text-[${themes[theme].text}] font-medium`}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <Animated.FlatList
        className={`mt-10`}
        itemLayoutAnimation={LinearTransition}
        data={filteredCompletedErrands}
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
        ListEmptyComponent={() => (
          <View className="flex-1 mt-16  items-center justify-center">
            <Text
              className={`text-lg font-semibold text-[${themes[theme].text}]`}
            >
              {i18n.t("thereAreNoCompletedErrands")}
            </Text>
          </View>
        )}
      />

      {possibleUndoDeleteErrand && (
        <UndoDeleteErrandButton
          possibleUndoDeleteErrand={possibleUndoDeleteErrand}
          undoDeleteErrand={undoDeleteErrand}
          openSwipeableRef={openSwipeableRef}
          setPossibleUndoDeleteErrand={setPossibleUndoDeleteErrand}
        />
      )}
    </View>
  );
};
export default ContactSharedCompletedTasks;
