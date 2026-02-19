import Animated, { LinearTransition } from "react-native-reanimated";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";

import { errandsAtom } from "../../../../../constants/storeAtoms";
import { themeAtom } from "../../../../../constants/storeUiAtoms";
import { useAtom } from "jotai";

import UndoCompleteErrandButton from "../../../../../Utils/UndoCompleteErrandButton";
import UndoDeleteErrandButton from "../../../../../Utils/UndoDeleteErrandButton";
import SwipeableFullErrand from "../../../../../Utils/SwipeableFullErrand";
import { useErrandActions } from "../../../../../hooks/useErrandActions";
import { themes } from "../../../../../constants/themes";
import i18n from "../../../../../constants/i18n";

const days = [
  i18n.t("sunday"),
  i18n.t("monday"),
  i18n.t("tuesday"),
  i18n.t("wednesday"),
  i18n.t("thursday"),
  i18n.t("friday"),
  i18n.t("saturday"),
];

const ContactSharedPendingTasks = () => {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const { contact } = useLocalSearchParams();
  const currentContact = useMemo(() => JSON.parse(contact), [contact]);

  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [filterTab, setFilterTab] = useState("all"); // all | outgoing | incoming

  const [possibleUndoCompleteErrand, setPossibleUndoCompleteErrand] =
    useState(null);
  const [possibleUndoDeleteErrand, setPossibleUndoDeleteErrand] =
    useState(null);

  const {
    onCompleteWithUndo,
    undoCompleteErrand,
    onDeleteWithUndo,
    undoDeleteErrand,
  } = useErrandActions({
    setErrands,
    setPossibleUndoCompleteErrand,
    setPossibleUndoDeleteErrand,
    possibleUndoCompleteErrand,
    possibleUndoDeleteErrand,
  });

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("pendingTasks"),
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

  const contactSharedPendingErrands = useMemo(() => {
    return errands
      .filter(
        (errand) =>
          !errand.deleted &&
          !errand.completed &&
          errand.listId === "unassigned",
      )
      .filter(
        (errand) =>
          errand.ownerUid === currentContact.uid ||
          errand.assignedId === currentContact.uid,
      );
  }, [errands, currentContact]);

  const filteredErrands = useMemo(() => {
    const baseList = contactSharedPendingErrands.filter((errand) => {
      const incomingTask = errand.ownerUid === currentContact.uid;
      const outgoingTask = errand.assignedId === currentContact.uid;

      if (filterTab === "incoming" && !incomingTask) return false;
      if (filterTab === "outgoing" && !outgoingTask) return false;

      return true;
    });

    const getErrandDateTime = (e) =>
      new Date(`${e.dateErrand}T${e.timeErrand || "20:00"}`);

    return baseList.sort((a, b) => {
      const dateA = getErrandDateTime(a);
      const dateB = getErrandDateTime(b);
      return dateA - dateB;
    });
  }, [contactSharedPendingErrands, currentContact, filterTab]);

  const sectionedErrands = useMemo(() => {
    const sections = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filteredErrands.forEach((errand) => {
      const errandDate = new Date(errand.dateErrand);
      errandDate.setHours(0, 0, 0, 0);

      const diffTime = errandDate.getTime() - today.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let dateKey = "";

      if (diffDays <= 0) {
        dateKey = i18n.t("today");
      } else if (diffDays === 1) {
        dateKey = i18n.t("tomorrow");
      } else if (diffDays <= 6) {
        dateKey = days[errandDate.getDay()];
      } else {
        const diaNombre = days[errandDate.getDay()];
        const fechaTexto = errandDate.toLocaleDateString(i18n.locale, {
          day: "2-digit",
          month: "long",
        });
        dateKey = `${diaNombre}, ${fechaTexto}`;
      }

      if (!sections[dateKey]) sections[dateKey] = [];
      sections[dateKey].push(errand);
    });

    return Object.entries(sections).map(([title, data]) => ({ title, data }));
  }, [filteredErrands]);

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
        itemLayoutAnimation={LinearTransition}
        data={sectionedErrands}
        keyExtractor={(item) => item.title}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item: section }) => (
          <View key={section.title}>
            <Text
              className={`text-xl font-bold text-center text-[${themes[theme].listTitle}] mt-3 mb-2`}
            >
              {section.title}
            </Text>
            {section.data.map((errand) => (
              <SwipeableFullErrand
                key={errand.id}
                errand={errand}
                setErrands={setErrands}
                openSwipeableRef={openSwipeableRef}
                swipeableRefs={swipeableRefs}
                onCompleteWithUndo={onCompleteWithUndo}
                onDeleteWithUndo={onDeleteWithUndo}
              />
            ))}
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 mt-16  items-center justify-center">
            <Text
              className={`text-lg font-semibold text-[${themes[theme].text}]`}
            >
              {i18n.t("noErrandsInThisSection")}
            </Text>
          </View>
        )}
      />

      {possibleUndoCompleteErrand && (
        <UndoCompleteErrandButton
          possibleUndoCompleteErrand={possibleUndoCompleteErrand}
          undoCompleteErrand={undoCompleteErrand}
          openSwipeableRef={openSwipeableRef}
          setPossibleUndoCompleteErrand={setPossibleUndoCompleteErrand}
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
    </View>
  );
};
export default ContactSharedPendingTasks;
