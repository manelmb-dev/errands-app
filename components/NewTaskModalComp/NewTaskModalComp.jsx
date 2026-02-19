import { useCallback, useEffect, useState, useMemo } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Switch,
  TouchableHighlight,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { useAtom } from "jotai";
import {
  userAssignedAtom,
  listAssignedAtom,
  errandsAtom,
  listsAtom,
  userAtom,
} from "../../constants/storeAtoms";
import { themeAtom } from "../../constants/storeUiAtoms";

import { Ionicons, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";

import i18n from "../../constants/i18n";
import { themes } from "../../constants/themes";
import formatDay from "../../constants/formatDay";
import {
  priorityOptions,
  repeatOptions,
} from "../../constants/repeatPriorityOptions";

const NewTaskModal = () => {
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();
  const router = useRouter();

  const { contact, list } = useLocalSearchParams();
  const contactStr = Array.isArray(contact) ? contact[0] : contact;
  const currentContact = useMemo(
    () => (contactStr ? JSON.parse(contactStr) : null),
    [contactStr],
  );
  const currentList = useMemo(() => list && JSON.parse(list), [list]);

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [, setErrands] = useAtom(errandsAtom);
  const [lists] = useAtom(listsAtom);

  const today = new Date().toISOString().split("T")[0];

  const [userAssigned, setUserAssigned] = useAtom(userAssignedAtom);
  const [listAssigned, setListAssigned] = useAtom(listAssignedAtom);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isHourPickerVisible, setIsHourPickerVisible] = useState(false);
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
      completedDateErrand: "",
      completedTimeErrand: "",
      deleted: false,
      seen: false,
    },
  });

  const watchedTitle = watch("title");

  const hasDate = !!watch("dateErrand");
  const hasTime = !!watch("timeErrand");
  const hasNotice = !!watch("dateNotice");

  useEffect(() => {
    const sharedList = {
      id: "unassigned",
      ownerId: user.id,
      title: i18n.t("shared"),
      icon: "people",
      color: "slate",
      usersShared: [user.id],
    };

    // 1) If you came from a list -> fixed list and assigned "unassigned"
    if (currentList) {
      setListAssigned(currentList);
      setUserAssigned({ id: "unassigned", displayName: i18n.t("unassigned") });
      setValue("assignedId", "unassigned");
      return;
    }

    // 2) If you came from a contact -> fixed contact and "shared" list
    if (currentContact) {
      setUserAssigned(currentContact);
      setListAssigned(sharedList);
      return;
    }

    // 3) Default case -> assign to myself and use the default list (if available)
    setUserAssigned(user);
    setListAssigned(lists?.[0] ?? sharedList);
  }, [
    currentList,
    currentContact,
    lists,
    user,
    setListAssigned,
    setUserAssigned,
    setValue,
  ]);

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t("newErrand"),
      presentation: "modal",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: null,
      headerLeft: () => (
        <Pressable onPress={handleCancelAlert}>
          <Text className={`text-2xl text-[${themes[theme].blueHeadText}]`}>
            {i18n.t("cancel")}
          </Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleAdd} disabled={!watchedTitle.trim()}>
          <Text
            className={`text-2xl font-semibold ${watchedTitle.trim() ? `text-[${themes[theme].blueHeadText}]` : `text-[${themes[theme].taskSecondText}]`}`}
          >
            {i18n.t("add")}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, theme, handleAdd, watchedTitle, handleCancelAlert]);

  useEffect(() => {
    setValue("assignedId", userAssigned.id);
    if (listAssigned) setValue("listId", listAssigned.id);
  }, [userAssigned, listAssigned, setValue]);

  // Function to handle date toggle
  const toggleDateSwitch = () => {
    if (hasDate) {
      setValue("dateErrand", "");
      setValue("timeErrand", "");
      setValue("dateNotice", "");
      setValue("timeNotice", "");
    } else {
      setIsDatePickerVisible(true);
    }
  };

  // Function to handle date selection Modal
  const handleDateConfirm = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setValue("dateErrand", dateString);
    setIsDatePickerVisible(false);
  };

  // Function to handle hour toggle
  const toggleHourSwitch = () => {
    if (hasTime) setValue("timeErrand", "");
    else setIsHourPickerVisible(true);
  };

  // Function to handle hour selection Modal
  const handleHourConfirm = (time) => {
    if (!watch("dateErrand")) setValue("dateErrand", today);

    setValue(
      "timeErrand",
      time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );

    setIsHourPickerVisible(false);
  };

  // Function to handle hour toggle
  const toggleNoticeSwitch = () => {
    if (hasNotice) {
      setValue("dateNotice", "");
      setValue("timeNotice", "");
    } else {
      setIsNoticePickerVisible(true);
    }
  };

  // Function to handle hour selection Modal
  const handleNoticeConfirm = (datetime) => {
    setValue("dateNotice", datetime.toISOString().split("T")[0]);
    setValue(
      "timeNotice",
      datetime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
    setIsNoticePickerVisible(false);
  };

  // Function to handle header cancel button
  const handleCancel = useCallback(() => {
    setUserAssigned(user);
    setListAssigned(null);
    navigation.goBack();
  }, [navigation, setUserAssigned, user, setListAssigned]);

  // Function to handle dismiss modal
  useEffect(() => {
    const dismissModal = navigation.addListener("beforeRemove", (e) => {
      setUserAssigned(user);
      setListAssigned(null);
    });
    return dismissModal;
  }, [navigation, setUserAssigned, user, setListAssigned]);

  // Function to handle cancel alert
  const handleCancelAlert = useCallback(() => {
    if (watch("title").length > 0) {
      Alert.alert(i18n.t("errandWillBeDiscarded"), "", [
        {
          text: i18n.t("discard"),
          onPress: handleCancel,
          style: "destructive",
        },
        {
          text: i18n.t("cancel"),
        },
      ]);
    } else {
      handleCancel();
    }
  }, [watch, handleCancel]);

  // Function to handle add new errand
  const handleAdd = handleSubmit(async (data) => {
    console.log(data); // Set to FIRESTOREEE

    // Add errand to DB backend
    const newErrandWithId = await setErrandToFS(data);
    // Add errand to DB locally
    setErrands((prevErrands) => [...prevErrands, newErrandWithId]);

    setUserAssigned(user);
    setListAssigned(null);
    navigation.goBack();
  });

  const showRepeatActionSheet = () => {
    const options = [...repeatOptions.map((o) => o.label), i18n.t("cancel")];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        title: i18n.t("repeat"),
        userInterfaceStyle: theme,
      },
      (index) => {
        if (index === options.length - 1) return;
        setValue("repeat", repeatOptions[index].value);
      },
    );
  };

  const showPriorityActionSheet = () => {
    const options = [...priorityOptions.map((o) => o.label), i18n.t("cancel")];
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        title: i18n.t("priority"),
        userInterfaceStyle: theme,
      },
      (index) => {
        if (index === options.length - 1) return;
        setValue("priority", priorityOptions[index].value);
      },
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className={`p-6 gap-4 bg-[${themes[theme].background}] h-full`}>
        <View
          className={`bg-[${themes[theme].surfaceBackground}] rounded-xl border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
        >
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`p-4 pl-4 text-lg border-b 
                  border-[${themes[theme].borderColor}] align-top
                  leading-tight text-[${themes[theme].text}]`}
                value={value}
                onChangeText={onChange}
                placeholder={i18n.t("title")}
                placeholderTextColor={themes[theme].taskSecondText}
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
                placeholder={i18n.t("description")}
                placeholderTextColor={themes[theme].taskSecondText}
                multiline={true}
              />
            )}
          />
        </View>

        <View
          className={`bg-[${themes[theme].surfaceBackground}] rounded-xl border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
        >
          {/* Assign errand */}
          <TouchableHighlight
            className={`rounded-t-xl`}
            underlayColor={themes[theme].background}
            onPress={() => {
              Keyboard.dismiss();
              router.push({
                pathname: "/Modals/assignContactModal",
              });
            }}
          >
            <View className={`flex-row items-center rounded-t-xl`}>
              <Ionicons
                className="mx-4 p-1 bg-blue-500 rounded-lg"
                name="person"
                size={22}
                color={themes["light"].background}
              />
              <View
                className={`min-h-[58px] flex-1 flex-row justify-between items-center border-b border-[${themes[theme].borderColor}]`}
              >
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  {i18n.t("inCharge")}
                </Text>
                <View
                  className={`mr-4 py-1 px-2 flex-shrink rounded-2xl flex-row items-center ${theme === "light" ? "bg-blue-100" : "bg-blue-600"}`}
                >
                  <Text
                    className={`text-lg flex-shrink text-[${themes[theme].text}]`}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {userAssigned.id === user.id
                      ? `${userAssigned.name} (${i18n.t("me")})`
                      : `${userAssigned.displayName}`}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={themes["light"].text}
                  />
                </View>
              </View>
            </View>
          </TouchableHighlight>

          {/* List errand */}
          <TouchableHighlight
            className={`rounded-b-xl`}
            underlayColor={themes[theme].background}
            onPress={() => {
              Keyboard.dismiss();
              router.push({
                pathname: "/Modals/assignListModal",
              });
            }}
          >
            <View className={`flex-row items-center rounded-b-xl`}>
              <Ionicons
                className="mx-4 p-1 bg-slate-500 rounded-lg "
                name="list"
                size={22}
                color={themes["light"].background}
              />
              <View className="min-h-[58px] flex-1 flex-row justify-between items-center">
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  {i18n.t("list")}
                </Text>
                <View
                  className={`mr-4 px-2 py-1 gap-1 flex-row items-center ${theme === "light" ? "bg-slate-300" : "bg-slate-600"} rounded-2xl`}
                >
                  <Text className={`text-lg text-[${themes[theme].text}]`}>
                    {listAssigned ? `${listAssigned.title}` : i18n.t("shared")}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={themes["light"].text}
                  />
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>

        <View
          className={`bg-[${themes[theme].surfaceBackground}] rounded-xl border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
        >
          {/* Date */}
          <TouchableHighlight
            className={`rounded-t-xl`}
            underlayColor={themes[theme].background}
            onPress={() => {
              Keyboard.dismiss();
              setIsDatePickerVisible(true);
            }}
          >
            <View className={`flex-row items-center rounded-t-xl`}>
              <Ionicons
                className="mx-4 p-1 bg-red-500 rounded-lg "
                name="calendar-outline"
                size={22}
                color={themes["light"].background}
              />
              <View
                className={`min-h-[58px] flex-1 flex-row justify-between items-center border-b border-[${themes[theme].borderColor}]`}
              >
                <View>
                  <Text className={`text-[${themes[theme].text}] text-base`}>
                    {i18n.t("date")}
                  </Text>
                  {watch("dateErrand") && (
                    <Text
                      className={`text-[${themes[theme].blueHeadText}] text-base`}
                    >
                      {formatDay(watch("dateErrand"))}
                    </Text>
                  )}
                </View>
                <View className="mr-4">
                  <Switch value={hasDate} onValueChange={toggleDateSwitch} />
                </View>
              </View>
            </View>
          </TouchableHighlight>

          {/* Time */}
          <TouchableHighlight
            className={`${!watch("dateErrand") && "rounded-b-xl"}`}
            underlayColor={themes[theme].background}
            onPress={() => {
              Keyboard.dismiss();
              setIsHourPickerVisible(true);
            }}
          >
            <View
              className={`flex-row items-center ${!watch("dateErrand") && "rounded-b-xl"}`}
            >
              <Ionicons
                className="mx-4 p-1 bg-yellow-500 rounded-lg"
                name="time-outline"
                size={23}
                color={themes["light"].background}
              />
              <View
                className={`min-h-[58px] flex-1 flex-row justify-between items-center ${watch("dateErrand") && `border-b border-[${themes[theme].borderColor}]`} `}
              >
                <View>
                  <Text className={`text-[${themes[theme].text}] text-base`}>
                    {i18n.t("time")}
                  </Text>
                  {watch("timeErrand") && (
                    <Text
                      className={`text-[${themes[theme].blueHeadText}] text-base`}
                    >
                      {watch("timeErrand")}
                    </Text>
                  )}
                </View>
                <View className="mr-4">
                  <Switch value={hasTime} onValueChange={toggleHourSwitch} />
                </View>
              </View>
            </View>
          </TouchableHighlight>

          {/* Notice */}
          {watch("dateErrand") && (
            <TouchableHighlight
              underlayColor={themes[theme].background}
              onPress={() => {
                Keyboard.dismiss();
                setIsNoticePickerVisible(true);
              }}
            >
              <View className={`flex-row items-center`}>
                <FontAwesome6
                  className="mx-4 p-1 px-1.5 bg-emerald-500 rounded-lg "
                  name="bell"
                  size={22}
                  color={themes["light"].background}
                />
                <View
                  className={`min-h-[58px] flex-1 flex-row justify-between items-center ${watch("dateErrand") && `border-b border-[${themes[theme].borderColor}]`}`}
                >
                  <View>
                    <Text className={`text-[${themes[theme].text}] text-base`}>
                      {i18n.t("notice")}
                    </Text>
                    {watch("dateNotice") && (
                      <Text
                        className={`text-[${themes[theme].blueHeadText}] text-base`}
                      >
                        {formatDay(watch("dateNotice"))}, {watch("timeNotice")}
                      </Text>
                    )}
                  </View>
                  <View className="mr-4">
                    <Switch
                      value={hasNotice}
                      onValueChange={toggleNoticeSwitch}
                    />
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          )}

          {/* Repeat */}
          {watch("dateErrand") && (
            <TouchableHighlight
              className={"rounded-b-xl"}
              underlayColor={themes[theme].background}
              onPress={showRepeatActionSheet}
            >
              <View className={`flex-row items-center rounded-b-xl`}>
                <Ionicons
                  className="mx-4 p-1 bg-violet-500 rounded-lg "
                  name="repeat"
                  size={23}
                  color={themes["light"].background}
                />
                <View className="min-h-[58px] flex-1 flex-row justify-between items-center">
                  <Text className={`text-[${themes[theme].text}] text-base`}>
                    {i18n.t("repeat")}
                  </Text>
                </View>
                <View
                  className={`mr-4 px-2 py-1 gap-1 flex-row items-center ${watch("repeat") === "never" ? `bg-[${themes[theme].surfaceBackground}]` : `${theme === "light" ? "bg-violet-300" : "bg-violet-500"}`} rounded-2xl`}
                >
                  <Text className={`text-lg text-[${themes[theme].text}]`}>
                    {
                      repeatOptions.find(
                        (option) => option.value === watch("repeat"),
                      )?.label
                    }
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={themes["light"].text}
                  />
                </View>
              </View>
            </TouchableHighlight>
          )}
        </View>

        <View
          className={`bg-[${themes[theme].surfaceBackground}] rounded-xl border border-[${themes[theme].borderColor}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
        >
          {/* Marked */}
          <TouchableHighlight
            className={`rounded-t-xl`}
            underlayColor={themes[theme].background}
            onPress={() => {
              Keyboard.dismiss();
              setValue("marked", !watch("marked"));
            }}
          >
            <View className={`flex-row items-center rounded-t-xl`}>
              <Ionicons
                className="mx-4 p-1 bg-orange-500 rounded-lg "
                name="flag-sharp"
                size={22}
                color={themes["light"].background}
              />
              <View
                className={`min-h-[58px] flex-1 flex-row justify-between items-center border-b border-[${themes[theme].borderColor}]`}
              >
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  {i18n.t("markedSingular")}
                </Text>
                <View className="mr-4">
                  <Switch
                    value={watch("marked")}
                    onChange={() => setValue("marked", !watch("marked"))}
                  />
                </View>
              </View>
            </View>
          </TouchableHighlight>

          {/* Priority */}
          <TouchableHighlight
            className={"rounded-b-xl"}
            underlayColor={themes[theme].background}
            onPress={showPriorityActionSheet}
          >
            <View className={`flex-row items-center rounded-b-xl`}>
              <MaterialIcons
                className="mx-4 p-1 bg-rose-500 rounded-lg "
                name="priority-high"
                size={22}
                color={themes["light"].background}
              />
              <View className="min-h-[58px] flex-1 flex-row justify-between items-center">
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  {i18n.t("priority")}
                </Text>
              </View>
              <View
                className={`mr-4 px-2 py-1 gap-1 flex-row items-center ${watch("priority") === "none" ? `bg-[${themes[theme].surfaceBackground}]` : `${theme === "light" ? "bg-rose-300" : "bg-rose-500"}`} rounded-2xl`}
              >
                <Text className={`text-lg text-[${themes[theme].text}]`}>
                  {
                    priorityOptions.find(
                      (option) => option.value === watch("priority"),
                    )?.label
                  }
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={themes["light"].text}
                />
              </View>
            </View>
          </TouchableHighlight>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          isDarkModeEnabled={theme === "dark"}
          themeVariant={theme === "light" ? "light" : "dark"}
          mode="date"
          display="inline"
          date={
            watch("dateErrand")
              ? new Date(watch("dateErrand"))
              : new Date(today)
          }
          onConfirm={handleDateConfirm}
          onCancel={() => setIsDatePickerVisible(false)}
          locale={i18n.locale}
          accentColor={themes[theme].blueHeadText}
          textColor={themes[theme].text}
          confirmTextIOS={i18n.t("confirm")}
          cancelTextIOS={i18n.t("cancel")}
        />

        <DateTimePickerModal
          isVisible={isHourPickerVisible}
          isDarkModeEnabled={theme === "dark"}
          themeVariant={theme === "light" ? "light" : "dark"}
          mode="time"
          date={
            watch("timeErrand")
              ? new Date(`2000-01-01T${watch("timeErrand")}`)
              : new Date()
          }
          onConfirm={handleHourConfirm}
          onCancel={() => setIsHourPickerVisible(false)}
          locale={i18n.locale}
          accentColor={themes[theme].blueHeadText}
          textColor={themes[theme].text}
          confirmTextIOS={i18n.t("confirm")}
          cancelTextIOS={i18n.t("cancel")}
          minuteInterval={5}
        />

        <DateTimePickerModal
          isVisible={isNoticePickerVisible}
          isDarkModeEnabled={theme === "dark"}
          themeVariant={theme === "light" ? "light" : "dark"}
          mode="datetime"
          display="inline"
          date={
            watch("timeErrand")
              ? new Date(`${watch("dateErrand")}T${watch("timeErrand")}`)
              : new Date(`${watch("dateErrand")}T08:00`)
          }
          onConfirm={handleNoticeConfirm}
          onCancel={() => setIsNoticePickerVisible(false)}
          locale={i18n.locale}
          accentColor={themes[theme].blueHeadText}
          textColor={themes[theme].text}
          confirmTextIOS={i18n.t("confirm")}
          cancelTextIOS={i18n.t("cancel")}
          minuteInterval={5}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
export default NewTaskModal;
