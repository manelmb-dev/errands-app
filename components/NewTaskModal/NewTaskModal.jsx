import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigation, useRouter } from "expo-router";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Switch,
  TouchableHighlight,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ActionSheet from "react-native-actionsheet";

import { useAtom } from "jotai";
import {
  errandsAtom,
  listAssignedAtom,
  listsAtom,
  themeAtom,
  userAssignedAtom,
  userAtom,
} from "../../constants/storeAtoms";

import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { themes } from "../../constants/themes";
import formatDay from "../../constants/formatDay";
import {
  priorityOptions,
  repeatOptions,
} from "../../constants/repeatPriorityOptions";

const NewTaskModal = () => {
  const navigation = useNavigation();
  const repeatSheetRef = useRef();
  const prioritySheetRef = useRef();
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];

  const [user] = useAtom(userAtom);
  const [userAssigned, setUserAssigned] = useAtom(userAssignedAtom);
  const [listAssigned, setListAssigned] = useAtom(listAssignedAtom);

  const [theme] = useAtom(themeAtom);
  const [, setErrands] = useAtom(errandsAtom);
  const [lists] = useAtom(listsAtom);

  const [dateSwitchEnabled, SetDateSwitchEnabled] = useState(false);
  const [hourSwitchEnabled, SetHourSwitchEnabled] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isHourPickerVisible, setIsHourPickerVisible] = useState(false);
  const [noticeSwitchEnabled, SetNoticeSwitchEnabled] = useState(false);
  const [isNoticePickerVisible, setIsNoticePickerVisible] = useState(false);

  const setErrandToFS = (data) => {
    const newErrand = {
      // function to FS
      ...data,
      id: new Date().toISOString(), // Generate a unique ID
    };
    console.log("new errand", newErrand); // Log the complete errand object
    return newErrand; // Return the complete errand object
  };

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      id: "",
      ownerId: user.id,
      assignedId: user.id,
      title: "",
      description: "",
      dateErrand: "",
      timeErrand: "",
      completed: false,
      dateNotice: "",
      timeNotice: "",
      repeat: "never",
      marked: false,
      location: "",
      priority: "none",
      listId: "",
      subtasks: {},
      completedDateErrand: "",
      completedtimeErrand: "",
    },
  });

  const watchedTitle = watch("title");

  useEffect(() => {
    if (!listAssigned) {
      const noList = {
        title: "Sin lista",
        id: "",
        icon: "list",
        color: "slate",
      };
      setListAssigned(noList);
    }
  }, [listAssigned, setListAssigned]);

  useEffect(() => {
    navigation.setOptions({
      title: "Nuevo recordatorio",
      presentation: "modal",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerLeft: () => (
        <Pressable onPress={handleCancelAlert}>
          <Text className={`text-2xl text-[${themes[theme].blueHeadText}]`}>
            Cancelar
          </Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleAdd} disabled={!watchedTitle.trim()}>
          <Text
            className={`text-2xl font-bold ${watchedTitle.trim() ? `text-[${themes[theme].blueHeadText}]` : `text-[${themes[theme].taskSecondText}]`}`}
          >
            Añadir
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, theme, handleAdd, watchedTitle, handleCancelAlert]);

  useEffect(() => {
    setValue("assignedId", userAssigned.id);
    setValue("listId", listAssigned.id);
  }, [userAssigned, listAssigned, setValue, setUserAssigned, setListAssigned]);

  // Function to handle date toggle
  const toggleDateSwitch = () => {
    if (dateSwitchEnabled) {
      setValue("dateErrand", "");
      setValue("timeErrand", "");
      setValue("dateNotice", "");
      setValue("timeNotice", "");
    } else {
      setIsDatePickerVisible(true);
    }
    SetDateSwitchEnabled((previousState) => !previousState);
    SetHourSwitchEnabled(false);
  };

  // Function to handle date selection Modal
  const handleDateConfirm = (date) => {
    SetDateSwitchEnabled(true);
    const dateString = date.toISOString().split("T")[0];
    setValue("dateErrand", dateString);
    setIsDatePickerVisible(false);
  };

  // Function to handle hour toggle
  const toggleHourSwitch = () => {
    if (hourSwitchEnabled) {
      setValue("timeErrand", "");
      SetHourSwitchEnabled(false);
    } else {
      setIsHourPickerVisible(true);
    }
  };

  // Function to handle hour selection Modal
  const handleHourConfirm = (time) => {
    !watch("dateErrand") && setValue("dateErrand", today);
    setValue(
      "timeErrand",
      time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    SetHourSwitchEnabled(true);
    SetDateSwitchEnabled(true);
    setIsHourPickerVisible(false);
  };

  // Function to handle hour toggle
  const toggleNoticeSwitch = () => {
    if (noticeSwitchEnabled) {
      setValue("dateNotice", "");
      setValue("timeNotice", "");
      SetNoticeSwitchEnabled(false);
    } else {
      setIsNoticePickerVisible(true);
    }
  };

  // Function to handle hour selection Modal
  const handleNoticeConfirm = (datetime) => {
    const dateString = datetime.toISOString().split("T")[0];
    setValue("dateNotice", dateString);
    const hourString = datetime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setValue("timeNotice", hourString);
    SetNoticeSwitchEnabled(true);
    setIsNoticePickerVisible(false);
  };

  const showRepeatActionSheet = () => {
    repeatSheetRef.current?.show();
  };

  const showPriorityActionSheet = () => {
    prioritySheetRef.current.show();
  };

  // Function to handle header cancel button
  const handleCancel = useCallback(() => {
    setUserAssigned(user);
    setListAssigned(false);
    navigation.goBack();
  }, [navigation, setUserAssigned, user, setListAssigned]);

  // Function to handle dismiss modal
  useEffect(() => {
    const dismissModal = navigation.addListener("beforeRemove", (e) => {
      setUserAssigned(user);
      setListAssigned(false);
    });
    return dismissModal;
  }, [navigation, setUserAssigned, user, setListAssigned]);

  // Function to handle cancel alert
  const handleCancelAlert = useCallback(() => {
    if (watch("title").length > 0) {
      Alert.alert("Se descartará el recordatorio", "", [
        { text: "Descartar", onPress: handleCancel, style: "destructive" },
        {
          text: "Cancelar",
        },
      ]);
    } else {
      handleCancel();
    }
  }, [watch, handleCancel]);

  // Function to handle add new errand
  const handleAdd = handleSubmit(async (data) => {
    console.log(data); // Set to FIRESTOREEE

    // Add errand to DB
    const newErrandWithId = await setErrandToFS(data);
    setErrands((prevErrands) => [...prevErrands, newErrandWithId]);

    setUserAssigned(user);
    setListAssigned(false);
    navigation.goBack();
  });

  return (
    <View className={`p-6 bg-[${themes[theme].background}] h-full`}>
      <View
        className={`bg-[${themes[theme].buttonMenuBackground}] mb-4 rounded-xl shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"} flex`}
      >
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`p-4 pl-4 text-lg border-b-hairline 
                  ${theme === "light" ? "border-gray-300" : "border-neutral-950"} align-top
                  leading-tight text-[${themes[theme].text}]`}
              value={value}
              onChangeText={onChange}
              placeholder="Título"
              placeholderTextColor={
                theme === "dark" && themes[theme].taskSecondText
              }
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`p-4 pl-4 text-lg max-h-48 align-top leading-tight  text-[${themes[theme].text}]`}
              value={value}
              onChangeText={onChange}
              placeholder="Descripción"
              placeholderTextColor={
                theme === "dark" && themes[theme].taskSecondText
              }
              multiline={true}
            />
          )}
        />
      </View>

      <View
        className={`bg-[${themes[theme].buttonMenuBackground}] mb-4 rounded-xl shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
      >
        {/* Assign errand */}
        <TouchableHighlight
          className={`rounded-t-xl`}
          onPress={() =>
            router.push({
              pathname: "/Modals/assignContactModal",
            })
          }
        >
          <View
            className={`pt-2 pb-2 px-4 flex-row justify-between items-center bg-[${themes[theme].buttonMenuBackground}] rounded-t-xl`}
          >
            <View className="flex-row gap-4 items-center">
              <Ionicons
                className="p-1 bg-blue-600 rounded-lg "
                name="person"
                size={22}
                color={themes["light"].background}
              />
              <View>
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  Encargado
                </Text>
              </View>
            </View>
            <View
              className={`flex-row items-center ${theme === "light" ? "bg-blue-200" : "bg-blue-600"} px-3 py-1 rounded-2xl gap-1`}
            >
              <FontAwesome6
                name="arrows-up-down"
                size={12}
                color={themes["light"].text}
              />
              <Text className={`text-lg text-[${themes[theme].text}]`}>
                {userAssigned.name} {userAssigned.surname}{" "}
                {userAssigned.id === user.id && "(Tú)"}
              </Text>
            </View>
          </View>
        </TouchableHighlight>

        {/* List errand */}
        <TouchableHighlight
          className={`rounded-b-xl ${theme === "light" ? "border-gray-300" : "border-neutral-950"}`}
          onPress={() =>
            router.push({
              pathname: "/Modals/assignListModal",
            })
          }
        >
          <View
            className={`flex-row justify-between items-center bg-[${themes[theme].buttonMenuBackground}] pt-2 pb-2 px-4 rounded-b-xl`}
          >
            <View className="flex-row gap-4 items-center">
              <Ionicons
                className="p-1 bg-slate-500 rounded-lg "
                name="list"
                size={22}
                color={themes["light"].background}
              />
              <View>
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  Lista
                </Text>
              </View>
            </View>
            <View
              className={`flex-row items-center ${listAssigned.id === "" || listAssigned === false ? `bg-[${themes[theme].buttonMenuBackground}]` : `${theme === "light" ? "bg-slate-300" : "bg-slate-600"}`} px-3 py-1 rounded-2xl gap-1`}
            >
              <FontAwesome6
                name="arrows-up-down"
                size={12}
                color={themes["light"].text}
              />
              <Text className={`text-lg text-[${themes[theme].text}]`}>
                {listAssigned ? `${listAssigned.title}` : "Sin lista"}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>

      <View
        className={`bg-[${themes[theme].buttonMenuBackground}] mb-4 rounded-xl shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
      >
        {/* Date */}
        <TouchableHighlight
          className={`rounded-t-xl`}
          onPress={() => setIsDatePickerVisible(true)}
        >
          <View
            className={`flex-row justify-between items-center bg-[${themes[theme].buttonMenuBackground}] pt-2 pb-2 px-4 rounded-t-xl`}
          >
            <View className="flex-row gap-4 items-center">
              <Ionicons
                className="p-1 bg-red-500 rounded-lg "
                name="calendar-outline"
                size={22}
                color={themes["light"].background}
              />
              <View>
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  Fecha
                </Text>
                {watch("dateErrand") && (
                  <Text
                    className={`text-[${themes[theme].blueHeadText}] text-base`}
                  >
                    {formatDay(watch("dateErrand"))}
                  </Text>
                )}
              </View>
            </View>
            <Switch
              value={watch("dateErrand") ? true : false}
              onValueChange={toggleDateSwitch}
            />
          </View>
        </TouchableHighlight>

        {/* Time */}
        <TouchableHighlight
          className={`${!watch("dateErrand") && "rounded-b-xl"}`}
          onPress={() => setIsHourPickerVisible(true)}
        >
          <View
            className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] ${!watch("dateErrand") && "rounded-b-xl"} pt-2 pb-2 px-4`}
          >
            <View className="flex-row gap-4 items-center">
              <Ionicons
                className="my-1 p-1 bg-yellow-500 rounded-lg "
                name="time-outline"
                size={22}
                color={themes["light"].background}
              />
              <View>
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  Hora
                </Text>
                {watch("timeErrand") && (
                  <Text
                    className={`text-[${themes[theme].blueHeadText}] text-lg`}
                  >
                    {watch("timeErrand")}
                  </Text>
                )}
              </View>
            </View>
            <Switch
              value={watch("timeErrand") ? true : false}
              onValueChange={toggleHourSwitch}
            />
          </View>
        </TouchableHighlight>

        {/* Notice */}
        {watch("dateErrand") && (
          <TouchableHighlight onPress={() => setIsNoticePickerVisible(true)}>
            <View
              className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] pt-2 pb-2 px-4`}
            >
              <View className="flex-row gap-4 items-center">
                <FontAwesome6
                  className="p-1 px-1.5 bg-emerald-500 rounded-lg "
                  name="bell"
                  size={21}
                  color={themes["light"].background}
                />
                <View>
                  <Text className={`text-[${themes[theme].text}] text-base`}>
                    Aviso
                  </Text>
                  {watch("dateNotice") && (
                    <Text
                      className={`text-[${themes[theme].blueHeadText}] text-base`}
                    >
                      {formatDay(watch("dateNotice"))}, {watch("timeNotice")}
                    </Text>
                  )}
                </View>
              </View>
              <Switch
                value={noticeSwitchEnabled}
                onValueChange={toggleNoticeSwitch}
              />
            </View>
          </TouchableHighlight>
        )}

        {/* Repeat */}
        {watch("dateErrand") && (
          <TouchableHighlight
            className={"rounded-b-xl"}
            onPress={showRepeatActionSheet}
          >
            <View
              className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] pt-2 pb-2 px-4 rounded-b-xl`}
            >
              <View className="flex-row gap-4 items-center">
                <Ionicons
                  className="p-1 bg-violet-500 rounded-lg "
                  name="repeat"
                  size={22}
                  color={themes["light"].background}
                />
                <View>
                  <Text className={`text-[${themes[theme].text}] text-base`}>
                    Repetir
                  </Text>
                </View>
              </View>
              <View
                className={`flex-row items-center ${watch("repeat") === "never" ? `bg-[${themes[theme].buttonMenuBackground}]` : `${theme === "light" ? "bg-violet-300" : "bg-violet-500"}`}  px-3 py-1 rounded-2xl gap-1`}
              >
                <FontAwesome6
                  name="arrows-up-down"
                  size={12}
                  color={themes["light"].text}
                />
                <Text className={`text-lg text-[${themes[theme].text}]`}>
                  {
                    repeatOptions.find(
                      (option) => option.value === watch("repeat")
                    )?.label
                  }
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        )}
      </View>

      <View
        className={`bg-[${themes[theme].buttonMenuBackground}] mb-4 rounded-xl shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
      >
        {/* Marked */}
        <TouchableHighlight
          className={`rounded-t-xl`}
          onPress={() => setValue("marked", !watch("marked"))}
        >
          <View
            className={`flex-row justify-between items-center bg-[${themes[theme].buttonMenuBackground}] pt-2 pb-2 px-4 rounded-t-xl`}
          >
            <View className="flex-row gap-4 items-center">
              <Ionicons
                className="p-1 bg-orange-500 rounded-lg "
                name="flag-sharp"
                size={22}
                color={themes["light"].background}
              />
              <View>
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  Marcador
                </Text>
              </View>
            </View>
            <Switch
              value={watch("marked")}
              onChange={() => setValue("marked", !watch("marked"))}
            />
          </View>
        </TouchableHighlight>

        {/* Priority */}
        <TouchableHighlight
          className={"rounded-b-xl"}
          onPress={showPriorityActionSheet}
        >
          <View
            className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] pt-2 pb-2 px-4 rounded-b-xl`}
          >
            <View className="flex-row gap-4 items-center">
              <MaterialIcons
                className="p-1 bg-rose-500 rounded-lg "
                name="priority-high"
                size={22}
                color={themes["light"].background}
              />
              <View>
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  Prioridad
                </Text>
              </View>
            </View>
            <View
              className={`flex-row items-center ${watch("priority") === "none" ? `bg-[${themes[theme].buttonMenuBackground}]` : `${theme === "light" ? "bg-rose-300" : "bg-rose-500"}`} px-3 py-1 rounded-2xl gap-1`}
            >
              <FontAwesome6
                name="arrows-up-down"
                size={12}
                color={themes["light"].text}
              />
              <Text className={`text-lg text-[${themes[theme].text}]`}>
                {
                  priorityOptions.find(
                    (option) => option.value === watch("priority")
                  )?.label
                }
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        isDarkModeEnabled={theme === "dark"}
        mode="date"
        display="inline"
        date={
          watch("dateErrand") ? new Date(watch("dateErrand")) : new Date(today)
        }
        onConfirm={handleDateConfirm}
        onCancel={() => setIsDatePickerVisible(false)}
        locale="es_ES"
        accentColor={themes[theme].blueHeadText}
        textColor={themes[theme].text}
        confirmTextIOS="Confirmar"
        cancelTextIOS="Cancelar"
      />

      <DateTimePickerModal
        isVisible={isHourPickerVisible}
        isDarkModeEnabled={theme === "dark"}
        mode="time"
        date={
          watch("timeErrand")
            ? new Date(`2000-01-01T${watch("timeErrand")}`)
            : new Date()
        }
        onConfirm={handleHourConfirm}
        onCancel={() => setIsHourPickerVisible(false)}
        locale="es_ES"
        accentColor={themes[theme].blueHeadText}
        textColor={themes[theme].text}
        confirmTextIOS="Confirmar"
        cancelTextIOS="Cancelar"
        minuteInterval={5}
      />

      <DateTimePickerModal
        isVisible={isNoticePickerVisible}
        isDarkModeEnabled={theme === "dark"}
        mode="datetime"
        display="inline"
        date={
          watch("timeErrand")
            ? new Date(`${watch("dateErrand")}T${watch("timeErrand")}`)
            : new Date(`${watch("dateErrand")}T08:00`)
        }
        onConfirm={handleNoticeConfirm}
        onCancel={() => setIsNoticePickerVisible(false)}
        locale="es_ES"
        accentColor={themes[theme].blueHeadText}
        textColor={themes[theme].text}
        confirmTextIOS="Confirmar"
        cancelTextIOS="Cancelar"
        minuteInterval={5}
      />

      <ActionSheet
        ref={repeatSheetRef}
        title={"Repetir"}
        options={[...repeatOptions.map((option) => option.label), "Cancelar"]}
        cancelButtonIndex={repeatOptions.length}
        onPress={(index) => {
          if (index === repeatOptions.length) return;
          setValue("repeat", repeatOptions[index].value);
        }}
      />

      <ActionSheet
        ref={prioritySheetRef}
        title={"Prioridad"}
        options={[...priorityOptions.map((option) => option.label), "Cancelar"]}
        cancelButtonIndex={priorityOptions.length}
        onPress={(index) => {
          if (index === priorityOptions.length) return;
          setValue("priority", priorityOptions[index].value);
        }}
      />
    </View>
  );
};
export default NewTaskModal;
