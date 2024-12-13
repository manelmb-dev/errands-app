import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";

import Octicons from "react-native-vector-icons/Octicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { themeAtom } from "../../constants/storeAtoms";
import { themes } from "../../constants/themes";
import errandsData from "../../errands";
import FullErrand from "../../constants/fullErrand";
import CompletedErrand from "../../constants/CompletedErrand";

let initialListas = [
  { id: "1239dsf87", title: "Personal", icon: "person", color: "blue" },
  { id: "1212439ñl", title: "Supermercado", icon: "restaurant", color: "red" },
  { id: "1239dsmnb", title: "Trabajo", icon: "business", color: "steal" },
  { id: "p979dsf87", title: "Cumpleaños", icon: "balloon", color: "orange" },
  { id: "4239dwe32", title: "Universidad", icon: "book", color: "green" },
  { id: "kds39dwe3", title: "Sin lista", icon: "list", color: "steal" },
];
const userId = "user123";

function Main() {
  const [theme, setTheme] = useAtom(themeAtom);

  const [listas, setListas] = useState(initialListas);
  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);
  const [taskSearchedInput, setTaskSearchedInput] = useState("");
  const [filteredErrands, setFilteredErrands] = useState([]);
  const [modalNewTaskVisible, setModalNewTaskVisible] = useState(false);

  const router = useRouter();

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const [errands, setErrands] = useState(errandsData);
  const [errandsNotCompleted, setErrandsNotCompleted] = useState(0);
  const [errandsToday, setErrandsToday] = useState(0);
  const [errandsPersonal, setErrandsPersonal] = useState(0);
  const [errandsReceived, setErrandsReceived] = useState(0);
  const [errandsSent, setErrandsSent] = useState(0);
  const [errandsMarked, setErrandsMarked] = useState(0);

  useEffect(() => {
    setFilteredErrands(
      errands.filter((errand) =>
        errand.title.toLowerCase().includes(taskSearchedInput.toLowerCase())
      )
    );
  }, [taskSearchedInput, errands]);

  useEffect(() => {
    const notCompleted = errands.filter((errand) => !errand.completed);

    const todayDate = new Date().toISOString().split("T")[0];
    const today = errands.filter((errand) => {
      const errandDate = new Date(errand.dateErrand)
        .toISOString()
        .split("T")[0];
      return errandDate <= todayDate && !errand.completed;
    });

    const personal = errands.filter(
      (errand) =>
        userId === errand.creatorId &&
        userId === errand.assignedId &&
        !errand.completed
    );

    const received = errands.filter(
      (errand) =>
        userId !== errand.creatorId &&
        userId === errand.assignedId &&
        !errand.completed
    );

    const send = errands.filter(
      (errand) =>
        userId === errand.creatorId &&
        userId !== errand.assignedId &&
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
  }, [errands]);

  return (
    <View
      className={`h-full flex-1 bg-[${themes[theme].background}] items-center`}
    >
      <View className="w-full flex-row items-center justify-between mb-3">
        <View
          className={`flex-row flex-1 bg-[${themes[theme].buttonMenuBackground}] rounded-xl p-2 pl-4 ml-5`}
        >
          <Ionicons
            className="mr-2"
            name="search"
            size={16}
            color={themes[theme].listTitle}
          />
          <TextInput
            className={`flex-1 text-[${themes[theme].text}]`}
            placeholder="Buscar"
            placeholderTextColor={themes[theme].listTitle}
            onChangeText={(text) => {
              setTaskSearchedInput(text);
            }}
          >
            {taskSearchedInput}
          </TextInput>
        </View>
        {taskSearchedInput ? (
          <Pressable onPress={() => setTaskSearchedInput("")}>
            <Text
              className={`text-[${themes[theme].blueHeadText}] text-lg px-3 mr-1`}
            >
              Cancelar
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => setModalSettingsVisible(true)}>
            <Ionicons
              className="px-3 mr-1"
              name="options"
              size={26}
              color={themes[theme].blueHeadText}
            />
          </Pressable>
        )}
      </View>

      {/* Modal */}
      {modalSettingsVisible && (
        <Pressable
          onPress={() => setModalSettingsVisible(false)}
          className="w-full h-full z-10 absolute flex items-end"
        >
          <View
            className={`bg-[${themes[theme].buttonMenuBackground}] rounded-2xl w-[70%] top-9 right-2 mx-2 shadow-2xl`}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal options */}
            <Pressable
              onPress={() => {
                setModalSettingsVisible(false);
                router.push("/contacts");
              }}
            >
              <Text
                className={`text-lg text-[${themes[theme].text}] py-2 pl-4`}
              >
                Contactos
              </Text>
            </Pressable>
            <View
              className={`h-[0.5px] bg-[${themes[theme].listsSeparator}]`}
            />
            <Pressable
              onPress={() => {
                setModalSettingsVisible(false);
              }}
            >
              <Text
                className={`text-lg text-[${themes[theme].text}] py-2 pl-4`}
              >
                Configuración
              </Text>
            </Pressable>
            <View
              className={`h-[0.5px] bg-[${themes[theme].listsSeparator}]`}
            />
            <Pressable
              onPress={() => {
                setModalSettingsVisible(false);
              }}
            >
              <Text
                className={`text-lg text-[${themes[theme].text}] py-2 pl-4`}
              >
                Mi cuenta
              </Text>
            </Pressable>
            <View
              className={`h-[0.5px] bg-[${themes[theme].listsSeparator}]`}
            />
            <Pressable
              onPress={() => {
                toggleTheme();
              }}
            >
              <Text
                className={`text-lg text-[${themes[theme].text}] py-2 pl-4`}
              >
                Light/Dark
              </Text>
            </Pressable>
          </View>
        </Pressable>
      )}
      {taskSearchedInput ? (
        filteredErrands.length > 0 ? (
          <View className="w-full flex-row items-center justify-between mb-2">
            <ScrollView>
              {listas.map((list) => {
                const filteredErrandsList = filteredErrands.filter(
                  (errand) => errand.list === list.title,
                );

                if (filteredErrandsList.length === 0) {
                  return null;
                }

                return (
                  <>
                    <View key={list.id}>
                      {/* Header list */}
                      <View className="flex-row justify-center items-center gap-1 mt-3 mb-2">
                        <Ionicons
                          name={list.icon}
                          size={21}
                          color={list.color}
                        />
                        <Text
                          className={`text-[${themes[theme].listTitle}] text-2xl font-bold`}
                        >
                          {list.title}
                        </Text>
                      </View>
                      {/* List tasks */}
                      {filteredErrandsList
                        .filter((errand) => !errand.completed)
                        .filter((errand) => errand.list === list.title)
                        .sort((a, b) => {
                          const dateA = new Date(
                            `${a.dateErrand}T${a.timeErrand || "20:00"}`
                          );
                          const dateB = new Date(
                            `${b.dateErrand}T${b.timeErrand || "20:00"}`
                          );
                          return dateA - dateB;
                        })
                        .map((errand, index) => (
                          <FullErrand key={errand.id} errand={errand} />
                        ))}
                    </View>
                    {/* Completed Tasks */}
                    {filteredErrandsList
                      .filter((errand) => errand.completed)
                      .filter((errand) => errand.list === list.title)
                      .sort((a, b) => {
                        const dateA = new Date(
                          `${a.dateErrand}T${a.timeErrand || "20:00"}`
                        );
                        const dateB = new Date(
                          `${b.dateErrand}T${b.timeErrand || "20:00"}`
                        );
                        return dateB - dateA;
                      })
                      .map((errand, index) => (
                        <CompletedErrand key={errand.id} errand={errand} />
                      ))}
                  </>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View className="flex-1 mt-4 items-center justify-between">
            <Text
              className={`text-[${themes[theme].listTitle}] text-lg font-bold `}
            >
              No existen recordatorios con este título
            </Text>
            <View className="flex-row gap-6 mt-4">
              <Pressable
                className="flex-row gap-1"
                onPress={() => setModalNewTaskVisible(true)}
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
              </Pressable>
              <Pressable className="flex-row gap-2">
                <Ionicons
                  className="pb-2"
                  name="send"
                  size={22}
                  color="#3F3F3F"
                />
                <Text
                  className={`text-lg text-[${themes[theme].sendTaskButtonText}] text font-bold`}
                >
                  Enviar recordatorio
                </Text>
              </Pressable>
            </View>
          </View>
        )
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 16,
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <Pressable
              className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
              onPress={() => router.push("/allTasks")}
            >
              <View>
                <Octicons
                  className="pb-3"
                  name="inbox"
                  size={28}
                  color="#black"
                />
                <Text
                  className={`text-md font-bold text-[${themes[theme].listTitle}]`}
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
            </Pressable>
            <Pressable
              className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
              onPress={() => router.push("/todayTasks")}
            >
              <View>
                <MaterialIcons
                  className="pb-2"
                  name="today"
                  size={30}
                  color={themes[theme].blueHeadText}
                />
                <Text
                  className={`text-md font-bold text-[${themes[theme].listTitle}]`}
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
            </Pressable>
            <Pressable
              className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
              onPress={() => router.push("/ownTasks")}
            >
              <View>
                <Ionicons
                  className="pb-2"
                  name="person"
                  size={30}
                  color="#62AAA6"
                />
                <Text
                  className={`text-md font-bold text-[${themes[theme].listTitle}]`}
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
            </Pressable>
            <Pressable
              className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
              onPress={() => router.push("/calendarTasks")}
            >
              <View>
                <MaterialIcons
                  className="pb-2"
                  name="calendar-month"
                  size={30}
                  color="#F6C467"
                />
                <Text
                  className={`text-md font-bold text-[${themes[theme].listTitle}]`}
                >
                  Calendario
                </Text>
              </View>
              <View className="pr-2">
                <Text
                  className={`text-3xl font-bold text-[${themes[theme].text}]`}
                >
                  {errandsNotCompleted}
                </Text>
              </View>
            </Pressable>
            <Pressable
              className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
              onPress={() => router.push("/receivedTasks")}
            >
              <View>
                <MaterialCommunityIcons
                  className="pb-1"
                  name="account-group"
                  size={33}
                  color="#CE4639"
                />
                <Text
                  className={`text-md font-bold text-[${themes[theme].listTitle}]`}
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
            </Pressable>
            <Pressable
              className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
              onPress={() => router.push("/sentTasks")}
            >
              <View>
                <Ionicons
                  className="pb-2"
                  name="send"
                  size={29}
                  color="#3F3F3F"
                />
                <Text
                  className={`text-md font-bold text-[${themes[theme].listTitle}]`}
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
            </Pressable>
            <Pressable
              className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
              onPress={() => router.push("/markedTasks")}
            >
              <View>
                <Ionicons
                  className="pb-3"
                  name="flag-sharp"
                  size={30}
                  color="#EF8B4A"
                />
                <Text
                  className={`text-md font-bold text-[${themes[theme].listTitle}]`}
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
            </Pressable>
            <Pressable
              className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
              onPress={() => router.push("/completedTasks")}
            >
              <View>
                <Octicons
                  className="pb-2"
                  name="check-circle-fill"
                  size={30}
                  color="green"
                />
                <Text
                  className={`text-md font-bold text-[${themes[theme].listTitle}]`}
                >
                  Completados
                </Text>
              </View>
            </Pressable>
            <View className="w-full flex-row justify-between mt-2 mb-1">
              <Text
                className={`text-xl font-bold ml-3 text-[${themes[theme].text}]`}
              >
                Mis listas
              </Text>
              <Pressable
                className="flex-row justify-center items-center gap-1"
                onPress={() =>
                  setListas([
                    ...listas,
                    { title: "Nueva lista", icon: "list", color: "black" },
                  ])
                }
              >
                <Ionicons
                  className="pb-1"
                  name="add-sharp"
                  size={19}
                  color={themes[theme].text}
                />
                <Text className={`text-lg text-[${themes[theme].text}] pb-1`}>
                  Añadir lista
                </Text>
              </Pressable>
            </View>
            <View
              className={`w-full bg-[${themes[theme].buttonMenuBackground}] rounded-xl p-1`}
            >
              {listas.map((lista, index) => (
                <View key={lista.title}>
                  <Pressable
                    className={`w-full flex-row justify-between items-center bg-[${themes[theme].buttonMenuBackground}] p-2 py-3`}
                    onPress={() =>
                      router.push({
                        pathname: "/listTasks",
                        params: { lista: lista },
                      })
                    }
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons
                        name={lista.icon}
                        size={23}
                        color={lista.color}
                      />
                      <Text
                        className={`text-lg text-[${themes[theme].listTitle}]`}
                      >
                        {lista.title}
                      </Text>
                    </View>
                    <Text
                      className={`text-md font-bold text-[${themes[theme].listTitle}]`}
                    >
                      {
                        errands.filter((errand) => errand.list === lista.title)
                          .length
                      }
                    </Text>
                  </Pressable>
                  {index < listas.length && (
                    <View
                      className={`h-[0.5px] bg-[${themes[theme].listsSeparator}] ml-10`}
                    />
                  )}
                </View>
              ))}
              <View>
                <Pressable
                  className={`flex-row justify-between items-center bg-[${themes[theme].buttonMenuBackground}] w-full p-2`}
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
                    className={`text-md font-bold text-[${themes[theme].listTitle}]`}
                  >
                    0
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
          <View className="flex-row gap-6 mt-4">
            <Pressable
              className="flex-row gap-1"
              onPress={() => setModalNewTaskVisible(true)}
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
            </Pressable>
            <Pressable className="flex-row gap-2">
              <Ionicons
                className="pb-2"
                name="send"
                size={22}
                color="#3F3F3F"
              />
              <Text
                className={`text-lg text-[${themes[theme].sendTaskButtonText}] text font-bold`}
              >
                Enviar recordatorio
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

export default Main;
