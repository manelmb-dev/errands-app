import Animated, { LinearTransition } from "react-native-reanimated";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CalendarList, LocaleConfig } from "react-native-calendars";
import { View, Text, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "expo-router";

import { errandsAtom, themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import { Ionicons } from "@expo/vector-icons";

import UndoCompleteErrandButton from "../../Utils/UndoCompleteErrandButton";
import SwipeableFullErrand from "../../Utils/SwipeableFullErrand";
import { useErrandActions } from "../../hooks/useErrandActions";
import { themes } from "../../constants/themes";

import UndoDeleteErrandButton from "../../Utils/UndoDeleteErrandButton";
import i18n from "../../constants/i18n";

LocaleConfig.locales[i18n.locale] = {
  monthNames: [
    i18n.t("january"),
    i18n.t("february"),
    i18n.t("march"),
    i18n.t("april"),
    i18n.t("may"),
    i18n.t("june"),
    i18n.t("july"),
    i18n.t("august"),
    i18n.t("september"),
    i18n.t("october"),
    i18n.t("november"),
    i18n.t("december"),
  ],
  monthNamesShort: [
    i18n.t("januaryShort"),
    i18n.t("februaryShort"),
    i18n.t("marchShort"),
    i18n.t("aprilShort"),
    i18n.t("mayShort"),
    i18n.t("juneShort"),
    i18n.t("julyShort"),
    i18n.t("augustShort"),
    i18n.t("septemberShort"),
    i18n.t("octoberShort"),
    i18n.t("novemberShort"),
    i18n.t("decemberShort"),
  ],
  dayNames: [
    i18n.t("sunday"),
    i18n.t("monday"),
    i18n.t("tuesday"),
    i18n.t("wednesday"),
    i18n.t("thursday"),
    i18n.t("friday"),
    i18n.t("saturday"),
  ],
  dayNamesShort: [
    i18n.t("sundayShort"),
    i18n.t("mondayShort"),
    i18n.t("tuesdayShort"),
    i18n.t("wednesdayShort"),
    i18n.t("thursdayShort"),
    i18n.t("fridayShort"),
    i18n.t("saturdayShort"),
  ],
  today: i18n.t("today"),
};

LocaleConfig.defaultLocale = i18n.locale;

const sortByDate = (a, b) => {
  const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
  const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
  return dateA - dateB;
};

function CalendarTasksComp() {
  const today = new Date().toISOString().split("T")[0];
  const navigation = useNavigation();

  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [errands, setErrands] = useAtom(errandsAtom);
  const [theme] = useAtom(themeAtom);

  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

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
      title: i18n.t("agenda"),
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

  const customCalendarHeader = (props) => {
    return (
      <View className="flex-row gap-3">
        <TouchableOpacity
          className="p-2 left-8"
          onPress={() => setIsDatePickerVisible(true)}
        >
          <Text className={`text-2xl font-bold text-[${themes[theme].text}]`}>
            {new Date(props)
              .toLocaleDateString(i18n.locale, {
                month: "long",
                year: "numeric",
              })
              .replace(i18n.locale.startsWith("ca") ? " del" : " de", " ")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-2 left-12"
          onPress={() => {
            setSelectedDate(today);
            setCurrentMonth(new Date());
          }}
        >
          <Text
            className={`text-2xl font-bold text-[${themes[theme].blueHeadText}]`}
          >
            {i18n.t("today")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleDateConfirm = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setSelectedDate(dateString);
    setCurrentMonth(date);
    setIsDatePickerVisible(false);
  };

  const markedDates = errands
    .filter((errand) => !errand.deleted)
    .reduce((acc, errand) => {
      if (!errand.completed) {
        if (!acc[errand.dateErrand]) {
          acc[errand.dateErrand] = { dots: [{ color: "orange" }] };
        }
      }
      return acc;
    }, {});

  // Mark the selected date
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: themes[theme].blueHeadText,
    };
  }

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

  return (
    <View
      className={`h-full bg-[${themes[theme].background}]`}
      onStartShouldSetResponder={() => {
        if (openSwipeableRef.current) {
          openSwipeableRef.current.close();
          openSwipeableRef.current = null;
          return true;
        }
        return false;
      }}
    >
      <CalendarList
        current={currentMonth.toISOString().split("T")[0]}
        renderHeader={customCalendarHeader}
        onPressArrowLeft={() => {
          setCurrentMonth((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
          });
        }}
        onPressArrowRight={() => {
          setCurrentMonth((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
          });
        }}
        horizontal={true}
        pagingEnabled={true}
        markingType={"multi-dot"}
        scrollEnabled={true}
        staticHeader={true}
        hideExtraDays={false} // Show other month days
        disableMonthChange={false} // Allows to scroll to other months
        theme={{
          backgroundColor: themes[theme].background,
          calendarBackground: themes[theme].background,
          textSectionTitleColor: themes[theme].text,
          selectedDayBackgroundColor: themes[theme].blueHeadText,
          selectedDayTextColor: "#ffffff",
          todayTextColor: themes[theme].blueHeadText,
          dayTextColor: themes[theme].text,
          textDisabledColor: "#AAAAAA",
          selectedDotColor: "#ffffff",
          arrowColor: themes[theme].blueHeadText,
          monthTextColor: themes[theme].text,
          indicatorColor: themes[theme].blueHeadText,
          "stylesheet.calendar.header": {
            week: {
              marginTop: 4,
              flexDirection: "row",
              justifyContent: "space-around",
              backgroundColor: themes[theme].background,
            },
          },
        }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={markedDates}
      />

      <Text
        className={`mt-3 ml-5 text-lg text-[${themes[theme].text}] font-bold`}
      >
        {new Date(selectedDate).toLocaleDateString(i18n.locale, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </Text>

      {/* {errands
        .filter((errand) => errand.dateErrand === selectedDate)
        .sort(sortByDate)
        .map((errand, index) => (
          <FullErrand key={errand.id} errand={errand} />
        ))} */}

      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={
          errands
            .filter(
              (errand) =>
                errand.dateErrand === selectedDate &&
                errand.completed === false &&
                !errand.deleted,
            )
            .sort(sortByDate) || []
        }
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <SwipeableFullErrand
            errand={item}
            setErrands={setErrands}
            openSwipeableRef={openSwipeableRef}
            swipeableRefs={swipeableRefs}
            onCompleteWithUndo={onCompleteWithUndo}
            onDeleteWithUndo={onDeleteWithUndo}
          />
        )}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className={`text-[${themes[theme].taskSecondText}] text-lg`}>
              {i18n.t("noErrandsThisDay")}
            </Text>
          </View>
        }
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

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        isDarkModeEnabled={theme === "dark"}
        themeVariant={theme === "light" ? "light" : "dark"}
        mode="date"
        date={new Date(selectedDate)}
        onConfirm={handleDateConfirm}
        onCancel={() => setIsDatePickerVisible(false)}
        locale={i18n.locale}
        accentColor={themes[theme].blueHeadText}
        textColor={themes[theme].text}
      />
    </View>
  );
}
export default CalendarTasksComp;
