import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";

import { errandsAtom, themeAtom, userAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import Ionicons from "react-native-vector-icons/Ionicons";

import UndoCompleteErrandButton from "../../Utils/UndoCompleteErrandButton";
import SwipeableFullErrand from "../../Utils/SwipeableFullErrand";
import { useErrandActions } from "../../hooks/useErrandActions";
import { themes } from "../../constants/themes";
import CompletedErrand from "../../Utils/CompletedErrand";
import RenderRightActionsCompletedErrand from "../../Utils/RenderRightActionsCompletedErrand";

const tabOptions = [
  { label: "Todos", value: "all" },
  { label: "Enviados", value: "outgoing" },
  { label: "Recibidos", value: "incoming" },
];

const subFilterOptions = [
  { label: "Pendientes", value: "pending" },
  { label: "Completados", value: "completed" },
];

const SharedTasks = () => {
  const navigation = useNavigation();

  const { tabParams } = useLocalSearchParams();
  const tabParamsObj = JSON.parse(tabParams);

  const [theme] = useAtom(themeAtom);
  const [user] = useAtom(userAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [mainTab, setMainTab] = useState(tabParamsObj.type); // all | outgoing | incoming
  const [subFilter, setSubFilter] = useState(tabParamsObj.status); // pending | overdue | completed

  const [possibleUndoErrand, setPossibleUndoErrand] = useState(null);

  const { onCompleteWithUndo, undoCompleteErrand } = useErrandActions({
    setErrands,
    setPossibleUndoErrand,
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Compartidos",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerBackTitle: "Atrás",
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => null,
      headerRight: () => (
        <Ionicons name="options" color={themes[theme].blueHeadText} size={24} />
      ),
    });
  }, [navigation, theme]);

  const filteredErrands = useMemo(() => {
    let baseList = errands.filter(
      (e) => !e.deleted && e.ownerId !== e.assignedId,
    );

    if (mainTab === "outgoing") {
      baseList = baseList.filter(
        (e) => !e.deleted && e.ownerId === user.id && e.assignedId !== user.id,
      );
    } else if (mainTab === "incoming") {
      baseList = baseList.filter(
        (e) => !e.deleted && e.ownerId !== user.id && e.assignedId === user.id,
      );
    }

    const getErrandDateTime = (e) =>
      new Date(`${e.dateErrand}T${e.timeErrand || "20:00"}`);

    if (subFilter === "pending") {
      baseList = baseList.filter((e) => !e.deleted && !e.completed);
    } else if (subFilter === "completed") {
      baseList = baseList.filter((e) => !e.deleted && e.completed);
    }

    return baseList.sort((a, b) => {
      const dateA = getErrandDateTime(a);
      const dateB = getErrandDateTime(b);
      return subFilter === "completed" ? dateB - dateA : dateA - dateB;
    });
  }, [errands, mainTab, subFilter, user]);

  const sectionedErrands = useMemo(() => {
    const sections = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diasSemana = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];

    filteredErrands.forEach((errand) => {
      const errandDate = new Date(errand.dateErrand);
      errandDate.setHours(0, 0, 0, 0);

      const diffTime = errandDate.getTime() - today.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let dateKey = "";
      if (subFilter === "pending") {
        if (diffDays <= 0) {
          dateKey = "Hoy";
        } else if (diffDays === 1) {
          dateKey = "Mañana";
        } else if (diffDays <= 6) {
          dateKey = diasSemana[errandDate.getDay()];
        } else {
          const diaNombre = diasSemana[errandDate.getDay()];
          const fechaTexto = errandDate.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
          });
          dateKey = `${diaNombre}, ${fechaTexto}`;
        }
      } else {
        dateKey = errandDate.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }

      if (!sections[dateKey]) sections[dateKey] = [];
      sections[dateKey].push(errand);
    });

    return Object.entries(sections).map(([title, data]) => ({ title, data }));
  }, [filteredErrands, subFilter]);

  return (
    <View className={`h-full w-full bg-[${themes[theme].background}]`}>
      {/* Tabs */}
      <View className="flex-row justify-center gap-2 px-2 py-2">
        <View className="flex-1 flex-row rounded-full overflow-hidden">
          {tabOptions.map((tab, index) => (
            <Pressable
              key={tab.value}
              onPress={() => setMainTab(tab.value)}
              className={`flex-1 items-center justify-center py-3 ${mainTab === tab.value ? `${theme === "light" ? "bg-gray-300" : "bg-gray-700"}` : `bg-[${themes[theme].buttonMenuBackground}]`} ${index === 0 ? "rounded-l-full" : ""} ${index === tabOptions.length - 1 ? "rounded-r-full" : ""}`}
            >
              <Text className={`text-[${themes[theme].text}] font-semibold`}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="flex-1 flex-row rounded-full overflow-hidden">
          {subFilterOptions.map((filter, index) => (
            <Pressable
              key={filter.value}
              onPress={() => setSubFilter(filter.value)}
              className={`flex-1 items-center justify-center py-2 ${subFilter === filter.value ? `${theme === "light" ? "bg-gray-300" : "bg-gray-700"}` : `bg-[${themes[theme].buttonMenuBackground}]`} ${index === 0 ? "rounded-l-full" : ""} ${index === subFilterOptions.length - 1 ? "rounded-r-full" : ""}`}
            >
              <Text className={`text-[${themes[theme].text}] font-medium`}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* List */}
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={sectionedErrands}
        keyExtractor={(item, index) => item.title + index}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item: section }) => (
          <View key={section.title}>
            {subFilter !== "completed" && (
              <Text
                className={`text-xl font-bold text-center text-[${themes[theme].listTitle}] mt-3 mb-2`}
              >
                {section.title}
              </Text>
            )}
            {section.data.map((item) =>
              subFilter === "completed" ? (
                <Swipeable
                  key={item.id}
                  ref={(ref) => (swipeableRefs.current[item.id] = ref)}
                  renderRightActions={() => (
                    <RenderRightActionsCompletedErrand
                      errand={item}
                      setErrands={setErrands}
                    />
                  )}
                  onSwipeableWillOpen={() => {
                    if (
                      openSwipeableRef.current &&
                      openSwipeableRef.current !==
                        swipeableRefs.current[item.id]
                    ) {
                      openSwipeableRef.current.close();
                    }
                    openSwipeableRef.current = swipeableRefs.current[item.id];
                  }}
                >
                  <CompletedErrand errand={item} />
                </Swipeable>
              ) : (
                <SwipeableFullErrand
                  key={item.id}
                  errand={item}
                  setErrands={setErrands}
                  openSwipeableRef={openSwipeableRef}
                  swipeableRefs={swipeableRefs}
                  onCompleteWithUndo={onCompleteWithUndo}
                />
              )
            )}
          </View>
        )}
      />

      {possibleUndoErrand && (
        <UndoCompleteErrandButton
          possibleUndoErrand={possibleUndoErrand}
          undoCompleteErrand={undoCompleteErrand}
          openSwipeableRef={openSwipeableRef}
          setPossibleUndoErrand={setPossibleUndoErrand}
        />
      )}
    </View>
  );
};

export default SharedTasks;
