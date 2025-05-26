import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAtom } from "jotai";
import {
  errandsAtom,
  listsAtom,
  themeAtom,
  userAtom,
} from "../../constants/storeAtoms";

import Octicons from "react-native-vector-icons/Octicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import SettingsMainModal from "./SettingsMainModal/SettingsMainModal";
import SwipeableFullErrand from "../../Utils/SwipeableFullErrand";
import { useErrandActions } from "../../hooks/useErrandActions";
import CompletedErrand from "../../Utils/CompletedErrand";
import { themes } from "../../constants/themes";
import UndoCompleteErrandButton from "../../Utils/UndoCompleteErrandButton";
import RenderRightActionsCompletedErrand from "../../Utils/RenderRightActionsCompletedErrand";

function Main() {
  const navigation = useNavigation();
  const router = useRouter();

  const [user] = useAtom(userAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [errands, setErrands] = useAtom(errandsAtom);
  const [lists] = useAtom(listsAtom);

  const openSwipeableRef = useRef(null);
  const swipeableRefs = useRef({});

  const [possibleUndoErrand, setPossibleUndoErrand] = useState(null);

  const { onCompleteWithUndo, undoCompleteErrand } = useErrandActions({
    setErrands,
    setPossibleUndoErrand,
  });

  const [errandsNotCompleted, setErrandsNotCompleted] = useState(0);
  const [errandsToday, setErrandsToday] = useState(0);
  const [errandsPersonal, setErrandsPersonal] = useState(0);
  const [errandsReceived, setErrandsReceived] = useState(0);
  const [errandsSent, setErrandsSent] = useState(0);
  const [errandsMarked, setErrandsMarked] = useState(0);

  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);
  const [taskSearchInput, settaskSearchInput] = useState("");
  const [filteredErrands, setFilteredErrands] = useState(errands);

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerSearchBarOptions: {
        placeholder: "Buscar",
        obscureBackground: taskSearchInput.length > 0 ? false : true,
        onChangeText: (event) => {
          settaskSearchInput(event.nativeEvent.text);
        },
      },
      headerRight: () => (
        <Ionicons
          name="options"
          color={themes[theme].blueHeadText}
          size={24}
          onPress={() => setModalSettingsVisible(true)}
        />
      ),
    });
  }, [navigation, theme, taskSearchInput]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  {
    /* Filter errands*/
  }
  useEffect(() => {
    setFilteredErrands(
      errands.filter((errand) =>
        errand.title.toLowerCase().includes(taskSearchInput.toLowerCase())
      )
    );
  }, [taskSearchInput, errands]);

  {
    /* Prepare errands for FlatList */
  }
  const flatListData = useMemo(() => {
    const items = lists
      .map((list) => ({
        ...list,
        errands: filteredErrands.filter((errand) => errand.listId === list.id),
      }))
      .filter((list) => list.errands.length > 0);

    const unlistedErrands = filteredErrands.filter((e) => e.listId === "");
    if (unlistedErrands.length > 0) {
      items.push({
        id: "",
        title: "Sin lista",
        icon: "list",
        color: "gray",
        errands: unlistedErrands,
      });
    }

    return items;
  }, [filteredErrands, lists]);

  useEffect(() => {
    const notCompleted = errands.filter((errand) => !errand.completed);

    const todayDate = new Date().toISOString().split("T")[0];
    const today = errands.filter((errand) => {
      if (errand.dateErrand === "") return false;
      const errandDate = new Date(errand.dateErrand)
        .toISOString()
        .split("T")[0];
      return errandDate <= todayDate && !errand.completed;
    });

    const personal = errands.filter(
      (errand) =>
        user.id === errand.ownerId &&
        user.id === errand.assignedId &&
        !errand.completed
    );

    const received = errands.filter(
      (errand) =>
        user.id !== errand.ownerId &&
        user.id === errand.assignedId &&
        !errand.completed
    );

    const send = errands.filter(
      (errand) =>
        user.id === errand.ownerId &&
        user.id !== errand.assignedId &&
        !errand.completed
    );

    const marked = errands.filter(
      (errand) => errand.marked && !errand.completed
    );

    setErrandsNotCompleted(notCompleted.length);
    setErrandsToday(today.length);
    setErrandsPersonal(personal.length);
    setErrandsReceived(received.length);
    setErrandsSent(send.length);
    setErrandsMarked(marked.length);
  }, [errands, user]);

  return (
    <View
      className={`flex-1 pt-40 bg-[${themes[theme].background}] items-center`}
    >
      {/* Modal */}
      <SettingsMainModal
        modalSettingsVisible={modalSettingsVisible}
        setModalSettingsVisible={setModalSettingsVisible}
        toggleTheme={toggleTheme}
      />

      {taskSearchInput ? (
        <View
          className={`h-full w-full bg-[${themes[theme].background}]`}
          onStartShouldSetResponder={() => {
            if (openSwipeableRef.current) {
              openSwipeableRef.current.close();
              openSwipeableRef.current = null;
              return true;
            }
            return false;
          }}
        >
          <Animated.FlatList
            itemLayoutAnimation={LinearTransition}
            data={flatListData}
            contentContainerStyle={{ paddingBottom: 30 }}
            keyExtractor={(item) => item.id || "no-list"}
            renderItem={({ item: list }) => (
              <View key={list.id}>
                {/* Header */}
                <View className="flex-row justify-center items-center gap-1 mt-3 mb-2">
                  <Ionicons name={list.icon} size={21} color={list.color} />
                  <Text
                    className={`text-[${themes[theme].listTitle}] text-2xl font-bold`}
                  >
                    {list.title}
                  </Text>
                </View>

                {/* Uncompleted */}
                {list.errands
                  .filter((errand) => !errand.completed)
                  .sort((a, b) => {
                    const dateA = new Date(
                      `${a.dateErrand}T${a.timeErrand || "20:00"}`
                    );
                    const dateB = new Date(
                      `${b.dateErrand}T${b.timeErrand || "20:00"}`
                    );
                    return dateA - dateB;
                  })
                  .map((errand) => (
                    <SwipeableFullErrand
                      key={errand.id}
                      errand={errand}
                      setErrands={setErrands}
                      openSwipeableRef={openSwipeableRef}
                      swipeableRefs={swipeableRefs}
                      onCompleteWithUndo={onCompleteWithUndo}
                    />
                  ))}

                {/* Completed */}
                {list.errands
                  .filter((errand) => errand.completed)
                  .sort((a, b) => {
                    const dateA = new Date(
                      `${a.dateErrand}T${a.timeErrand || "20:00"}`
                    );
                    const dateB = new Date(
                      `${b.dateErrand}T${b.timeErrand || "20:00"}`
                    );
                    return dateB - dateA;
                  })
                  .map((errand) => (
                    <Swipeable
                      ref={(ref) => (swipeableRefs.current[errand.id] = ref)}
                      renderRightActions={() => (
                        <RenderRightActionsCompletedErrand
                          errand={errand}
                          setErrands={setErrands}
                        />
                      )}
                      onSwipeableWillOpen={() => {
                        if (
                          openSwipeableRef.current &&
                          openSwipeableRef.current !==
                            swipeableRefs.current[errand.id]
                        ) {
                          openSwipeableRef.current.close();
                        }
                        openSwipeableRef.current =
                          swipeableRefs.current[errand.id];
                      }}
                    >
                      <CompletedErrand errand={errand} />
                    </Swipeable>
                  ))}
              </View>
            )}
            ListEmptyComponent={
              <Text
                className={`text-[${themes[theme].listTitle}] text-lg font-bold text-center mt-40`}
              >
                No existen recordatorios con este título
              </Text>
            }
          />
        </View>
      ) : (
        <>
          <View className="flex-1">
            <ScrollView>
              <Pressable className="flex-row flex-wrap px-4 pb-0.5 justify-between">
                <TouchableHighlight
                  className={`my-1.5 rounded-xl w-[47.5%] h-20 shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
                  onPress={() => router.push("/allTasks")}
                >
                  <View
                    className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl w-full h-full`}
                  >
                    <View>
                      <Ionicons
                        className="pb-2"
                        name="file-tray-full"
                        size={31}
                        color="#black"
                      />
                      <Text
                        className={`text-base font-bold text-[${themes[theme].listTitle}]`}
                      >
                        Todo
                      </Text>
                    </View>
                    <View className="pr-2">
                      <Text
                        className={`text-3xl font-bold text-[${themes[theme].text}]`}
                      >
                        {errandsNotCompleted}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  className={`my-1.5 rounded-xl w-[47.5%] h-20 shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
                  onPress={() => router.push("/todayTasks")}
                >
                  <View
                    className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl w-full h-full`}
                  >
                    <View>
                      <MaterialIcons
                        className="pb-2"
                        name="today"
                        size={30}
                        color={themes[theme].blueHeadText}
                      />
                      <Text
                        className={`text-base font-bold text-[${themes[theme].listTitle}]`}
                      >
                        Hoy
                      </Text>
                    </View>
                    <View className="pr-2">
                      <Text
                        className={`text-3xl font-bold text-[${themes[theme].text}]`}
                      >
                        {errandsToday}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>

                {/* <TouchableHighlight
                  className={`my-1.5 rounded-xl w-[47.5%] h-20 shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
                  onPress={() => router.push("/ownTasks")}
                >
                  <View
                    className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl w-full h-full`}
                  >
                    <View>
                      <Ionicons
                        className="pb-2"
                        name="person"
                        size={30}
                        color="#62AAA6"
                      />
                      <Text
                        className={`text-base font-bold text-[${themes[theme].listTitle}]`}
                      >
                        Mios
                      </Text>
                    </View>
                    <View className="pr-2">
                      <Text
                        className={`text-3xl font-bold text-[${themes[theme].text}]`}
                      >
                        {errandsPersonal}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight> */}

                {/* <TouchableHighlight
                  className={`my-1.5 rounded-xl w-[47.5%] h-20 shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
                  onPress={() => router.push("/receivedTasks")}
                >
                  <View
                    className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl w-full h-full`}
                  >
                    <View>
                      <MaterialCommunityIcons
                        className="pb-1"
                        name="account-group"
                        size={33}
                        color="#CE4639"
                      />
                      <Text
                        className={`text-base font-bold text-[${themes[theme].listTitle}]`}
                      >
                        Recibidos
                      </Text>
                    </View>
                    <View className="pr-2">
                      <Text
                        className={`text-3xl font-bold text-[${themes[theme].text}]`}
                      >
                        {errandsReceived}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  className={`my-1.5 rounded-xl w-[47.5%] h-20 shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
                  onPress={() => router.push("/submittedTasks")}
                >
                  <View
                    className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl w-full h-full`}
                  >
                    <View>
                      <Ionicons
                        className="pb-2"
                        name="send"
                        size={29}
                        color="#3F3F3F"
                      />
                      <Text
                        className={`text-base font-bold text-[${themes[theme].listTitle}]`}
                      >
                        Enviados
                      </Text>
                    </View>
                    <View className="pr-2">
                      <Text
                        className={`text-3xl font-bold text-[${themes[theme].text}]`}
                      >
                        {errandsSent}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight> */}

                <TouchableHighlight
                  className={`my-1.5 rounded-xl w-[47.5%] h-20 shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
                  onPress={() => router.push("/markedTasks")}
                >
                  <View
                    className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl w-full h-full`}
                  >
                    <View>
                      <Ionicons
                        className="pb-3"
                        name="flag-sharp"
                        size={29}
                        color="#EF8B4A"
                      />
                      <Text
                        className={`text-base font-bold text-[${themes[theme].listTitle}]`}
                      >
                        Marcados
                      </Text>
                    </View>
                    <View className="pr-2">
                      <Text
                        className={`text-3xl font-bold text-[${themes[theme].text}]`}
                      >
                        {errandsMarked}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  className={`my-1.5 rounded-xl w-[47.5%] h-20 shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
                  onPress={() => router.push("/calendarTasks")}
                >
                  <View
                    className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl w-full h-full`}
                  >
                    <View>
                      <MaterialIcons
                        className="pb-2"
                        name="calendar-month"
                        size={30}
                        color="#F6C467"
                      />
                      <Text
                        className={`text-base font-bold text-[${themes[theme].listTitle}]`}
                      >
                        Calendario
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  className={`my-1.5 rounded-xl w-[47.5%] h-20 shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
                  onPress={() => router.push("/completedTasks")}
                >
                  <View
                    className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl w-full h-full`}
                  >
                    <View>
                      <Octicons
                        className="pb-2"
                        name="check-circle-fill"
                        size={30}
                        color="green"
                      />
                      <Text
                        className={`text-base font-bold text-[${themes[theme].listTitle}]`}
                      >
                        Completados
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>

                <View className="w-full flex-row justify-between mt-4 mb-1">
                  <Text
                    className={`text-xl font-bold ml-3 text-[${themes[theme].text}]`}
                  >
                    Mis listas
                  </Text>
                  <Pressable
                    className="flex-row justify-center items-center gap-1"
                    onPress={() => {
                      router.push("/Modals/newListModal");
                    }}
                  >
                    <Ionicons
                      className="pb-1"
                      name="add-sharp"
                      size={19}
                      color={themes[theme].text}
                    />
                    <Text
                      className={`text-lg text-[${themes[theme].text}] pb-1`}
                    >
                      Añadir lista
                    </Text>
                  </Pressable>
                </View>
                <View
                  className={`w-full bg-[${themes[theme].buttonMenuBackground}] rounded-t-xl rounded-b-xl shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
                >
                  {lists.map((list, index) => (
                    <View
                      className={`${index === 0 && "rounded-t-xl"} bg-[${themes[theme].buttonMenuBackground}]`}
                      key={list.id}
                    >
                      <TouchableHighlight
                        className={`${index === 0 && "rounded-t-xl"}`}
                        onPress={() => {
                          router.push({
                            pathname: "/listTasks",
                            params: {
                              list: JSON.stringify(list),
                            },
                          });
                        }}
                      >
                        <View
                          className={`w-full flex-row justify-between items-center bg-[${themes[theme].buttonMenuBackground}] ${index === 0 && "rounded-t-xl"} p-4 py-3`}
                        >
                          <View className="flex-row items-center gap-3">
                            <Ionicons
                              name={list.icon}
                              size={23}
                              color={list.color}
                            />
                            <Text
                              className={`text-lg text-[${themes[theme].listTitle}]`}
                            >
                              {list.title}
                            </Text>
                          </View>
                          <Text
                            className={`mr-2 text-lg font-bold text-[${themes[theme].listTitle}]`}
                          >
                            {
                              errands
                                .filter((errand) => errand.listId === list.id)
                                .filter((errand) => !errand.completed).length
                            }
                          </Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  ))}

                  {/* Errands without list */}
                  <View
                    className={`w-full bg-[${themes[theme].buttonMenuBackground}]`}
                  >
                    <TouchableHighlight
                      className={`bg-[${themes[theme].buttonMenuBackground}] w-full`}
                      onPress={() => {
                        router.push({
                          pathname: "/listTasks",
                          params: {
                            list: JSON.stringify({
                              id: "",
                              title: "Sin lista",
                              icon: "list",
                              color: "gray",
                            }),
                          },
                        });
                      }}
                    >
                      <View
                        className={`w-full flex-row justify-between items-center bg-[${themes[theme].buttonMenuBackground}] p-4 py-3`}
                      >
                        <View className="flex-row items-center gap-3">
                          <Ionicons name="list" size={23} color="steal" />
                          <Text
                            className={`text-lg text-[${themes[theme].listTitle}]`}
                          >
                            Sin lista
                          </Text>
                        </View>
                        <Text
                          className={`mr-2 text-lg font-bold text-[${themes[theme].listTitle}]`}
                        >
                          {
                            errands
                              .filter((errand) => errand.listId === "")
                              .filter((errand) => !errand.completed).length
                          }
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>

                  {/* Errands deleted */}
                  <View
                    className={`w-full rounded-b-xl bg-[${themes[theme].buttonMenuBackground}]`}
                  >
                    <TouchableHighlight
                      className={`bg-[${themes[theme].buttonMenuBackground}] w-full rounded-b-xl`}
                      onPress={() => {
                        router.push("/deletedTasks");
                      }}
                    >
                      <View
                        className={`w-full flex-row justify-between items-center rounded-b-xl bg-[${themes[theme].buttonMenuBackground}] p-4 py-3`}
                      >
                        <View className="flex-row items-center gap-3">
                          <Ionicons name="trash" size={23} color="gray" />
                          <Text
                            className={`text-lg text-[${themes[theme].listTitle}]`}
                          >
                            Papelera
                          </Text>
                        </View>
                        <Text
                          className={`m-2 text-lg font-bold text-[${themes[theme].listTitle}]`}
                        >
                          0
                          {/* errands.filter((errand) => errand.deleted === true).length */}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              </Pressable>
            </ScrollView>
          </View>

          <TouchableHighlight
            className="rounded-t-2xl"
            onPress={() =>
              router.push({
                pathname: "/Modals/newTaskModal",
              })
            }
          >
            <View
              className={`flex-row pt-4 pb-5 px-6 gap-1 bg-[${themes[theme].background}] rounded-t-2xl`}
            >
              <Ionicons
                className="pb-2"
                name="add-circle"
                size={24}
                color={themes[theme].blueHeadText}
              />
              <Text
                className={`text-lg text-[${themes[theme].blueHeadText}] text font-bold`}
              >
                Nuevo recordatorio
              </Text>
            </View>
          </TouchableHighlight>
        </>
      )}

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
}

export default Main;
