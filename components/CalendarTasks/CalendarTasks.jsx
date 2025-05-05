import Animated, { LinearTransition } from "react-native-reanimated";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CalendarList, LocaleConfig } from "react-native-calendars";
import { View, Text, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "expo-router";

import { errandsAtom, listsAtom, themeAtom } from "../../constants/storeAtoms";
import { useAtom } from "jotai";

import UndoCompleteErrandButton from "../../Utils/UndoCompleteErrandButton";
import SwipeableFullErrand from "../../Utils/SwipeableFullErrand";
import { useErrandActions } from "../../hooks/useErrandActions";
import { themes } from "../../constants/themes";

import Ionicons from "react-native-vector-icons/Ionicons";

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene.",
    "Feb.",
    "Mar.",
    "Abr.",
    "May.",
    "Jun.",
    "Jul.",
    "Ago.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dic.",
  ],
  dayNames: [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ],
  dayNamesShort: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  today: "Hoy",
};
LocaleConfig.defaultLocale = "es";

function CalendarTasks() {
  const today = new Date().toISOString().split("T")[0];
  const navigation = useNavigation();
  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [theme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);

  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [possibleUndoErrand, setPossibleUndoErrand] = useState(null);

  const { onCompleteWithUndo, undoCompleteErrand } = useErrandActions({
    setErrands,
    setPossibleUndoErrand,
  });

  useEffect(() => {
    navigation.setOptions({
      title: "Agenda",
      headerBackTitle: "Listas",
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

  const customCalendarHeader = (props) => {
    return (
      <View className="flex-row gap-3">
        <TouchableOpacity
          className="p-2 left-8"
          onPress={() => setIsDatePickerVisible(true)}
        >
          <Text className={`text-2xl font-bold text-[${themes[theme].text}]`}>
            {new Date(props)
              .toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
              })
              .replace(" de", " ")}
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
            Hoy
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

  const markedDates = errands.reduce((acc, errand) => {
    if (!errand.completed) {
      if (!acc[errand.dateErrand]) {
        acc[errand.dateErrand] = { dots: [{ color: "orange" }] };
      }
    }
    return acc;
  }, {});

  // Marcar el día seleccionado
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
        hideExtraDays={false} // Muestra días de otros meses
        disableMonthChange={false} // Permite navegar entre meses
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
        {new Date(selectedDate).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </Text>

      {/* {errands
        .filter((errand) => errand.dateErrand === selectedDate)
        .sort((a, b) => {
          const dateA = new Date(`${a.dateErrand}T${a.timeErrand || "20:00"}`);
          const dateB = new Date(`${b.dateErrand}T${b.timeErrand || "20:00"}`);
          return dateA - dateB;
        })
        .map((errand, index) => (
          <FullErrand key={errand.id} errand={errand} />
        ))} */}

      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        data={
          errands
            .filter((errand) => errand.dateErrand === selectedDate)
            .filter((errand) => errand.completed === false)
            .sort((a, b) => {
              const dateA = new Date(
                `${a.dateErrand}T${a.timeErrand || "20:00"}`
              );
              const dateB = new Date(
                `${b.dateErrand}T${b.timeErrand || "20:00"}`
              );
              return dateA - dateB;
            }) || []
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableFullErrand
            errand={item}
            setErrands={setErrands}
            openSwipeableRef={openSwipeableRef}
            swipeableRefs={swipeableRefs}
            onCompleteWithUndo={onCompleteWithUndo}
          />
        )}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className={`text-[${themes[theme].taskSecondText}] text-lg`}>
              No hay recordatorios para este día
            </Text>
          </View>
        }
      />

      {possibleUndoErrand && (
        <UndoCompleteErrandButton
          possibleUndoErrand={possibleUndoErrand}
          undoCompleteErrand={undoCompleteErrand}
          openSwipeableRef={openSwipeableRef}
          setPossibleUndoErrand={setPossibleUndoErrand}
        />
      )}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        isDarkModeEnabled={theme === "dark"}
        mode="date"
        date={new Date(selectedDate)}
        onConfirm={handleDateConfirm}
        onCancel={() => setIsDatePickerVisible(false)}
        locale="es_ES"
        accentColor={themes[theme].blueHeadText}
        textColor={themes[theme].text}
      />
    </View>
  );
}
export default CalendarTasks;
