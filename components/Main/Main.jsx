import { Pressable, ScrollView, Text, View } from "react-native";
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

let initialListas = [
  { title: "Personal", icon: "person", color: "blue" },
  { title: "Supermercado", icon: "restaurant", color: "red" },
  { title: "Trabajo", icon: "business", color: "steal" },
  { title: "Cumpleaños", icon: "balloon", color: "orange" },
  { title: "Universidad", icon: "book", color: "green" },
];
const userId = "user123";

function Main() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [listas, setListas] = useState(initialListas);

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
        !errand.completed,
    );

    const received = errands.filter(
      (errand) =>
        userId !== errand.creatorId &&
        userId === errand.assignedId &&
        !errand.completed,
    );

    const send = errands.filter(
      (errand) =>
        userId === errand.creatorId &&
        userId !== errand.assignedId &&
        !errand.completed,
    );

    const marked = errands.filter(
      (errand) => errand.marked && !errand.completed,
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
        <Text className="text-[#0033ff] text-xl ml-5">Buscador</Text>
        <Pressable onPress={toggleTheme}>
          <Ionicons
            className="px-3 ml-9"
            name="options"
            size={26}
            color="#0033ff"
          />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          paddingHorizontal: 16,
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Pressable
          className={`flex-row justify-between bg-[${themes[theme].buttonBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
          onPress={() => router.push("/allTasks")}
        >
          <View>
            <Octicons className="pb-3" name="inbox" size={28} color="#black" />
            <Text
              className={`text-md font-bold text-[${themes[theme].buttonText}]`}
            >
              Todo
            </Text>
          </View>
          <View className="pr-2">
            <Text
              className={`text-3xl font-bold text-[${themes[theme].buttonText}]`}
            >
              {errandsNotCompleted}
            </Text>
          </View>
        </Pressable>
        <Pressable
          className={`flex-row justify-between bg-[${themes[theme].buttonBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
          onPress={() => router.push("/todayTasks")}
        >
          <View>
            <MaterialIcons
              className="pb-2"
              name="today"
              size={30}
              color="#045BEB"
            />
            <Text
              className={`text-md font-bold text-[${themes[theme].buttonText}]`}
            >
              Hoy
            </Text>
          </View>
          <View className="pr-2">
            <Text
              className={`text-3xl font-bold text-[${themes[theme].buttonText}]`}
            >
              {errandsToday}
            </Text>
          </View>
        </Pressable>
        <Pressable
          className={`flex-row justify-between bg-[${themes[theme].buttonBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
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
              className={`text-md font-bold text-[${themes[theme].buttonText}]`}
            >
              Mios
            </Text>
          </View>
          <View className="pr-2">
            <Text
              className={`text-3xl font-bold text-[${themes[theme].buttonText}]`}
            >
              {errandsPersonal}
            </Text>
          </View>
        </Pressable>
        <Pressable
          className={`flex-row justify-between bg-[${themes[theme].buttonBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
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
              className={`text-md font-bold text-[${themes[theme].buttonText}]`}
            >
              Calendario
            </Text>
          </View>
          <View className="pr-2">
            <Text
              className={`text-3xl font-bold text-[${themes[theme].buttonText}]`}
            >
              {errandsNotCompleted}
            </Text>
          </View>
        </Pressable>
        <Pressable
          className={`flex-row justify-between bg-[${themes[theme].buttonBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
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
              className={`text-md font-bold text-[${themes[theme].buttonText}]`}
            >
              Recibidos
            </Text>
          </View>
          <View className="pr-2">
            <Text
              className={`text-3xl font-bold text-[${themes[theme].buttonText}]`}
            >
              {errandsReceived}
            </Text>
          </View>
        </Pressable>
        <Pressable
          className={`flex-row justify-between bg-[${themes[theme].buttonBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
          onPress={() => router.push("/sentTasks")}
        >
          <View>
            <Ionicons className="pb-2" name="send" size={29} color="#3F3F3F" />
            <Text
              className={`text-md font-bold text-[${themes[theme].buttonText}]`}
            >
              Enviados
            </Text>
          </View>
          <View className="pr-2">
            <Text
              className={`text-3xl font-bold text-[${themes[theme].buttonText}]`}
            >
              {errandsSent}
            </Text>
          </View>
        </Pressable>
        <Pressable
          className={`flex-row justify-between bg-[${themes[theme].buttonBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
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
              className={`text-md font-bold text-[${themes[theme].buttonText}]`}
            >
              Marcados
            </Text>
          </View>
          <View className="pr-2">
            <Text
              className={`text-3xl font-bold text-[${themes[theme].buttonText}]`}
            >
              {errandsMarked}
            </Text>
          </View>
        </Pressable>
        <Pressable
          className={`flex-row justify-between bg-[${themes[theme].buttonBackground}] p-3 rounded-xl mb-3 w-[47.5%]`}
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
              className={`text-md font-bold text-[${themes[theme].buttonText}]`}
            >
              Completados
            </Text>
          </View>
        </Pressable>
        <View className="w-full flex-row justify-between mt-2 mb-1">
          <Text
            className={`text-xl font-bold ml-3 text-[${themes[theme].buttonText}]`}
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
              color={themes[theme].buttonText}
            />
            <Text className={`text-lg text-[${themes[theme].buttonText}] pb-1`}>
              Añadir lista
            </Text>
          </Pressable>
        </View>
        <View
          className={`w-full bg-[${themes[theme].buttonBackground}] rounded-xl p-1`}
        >
          {listas.map((lista, index) => (
            <View key={lista.title}>
              <Pressable
                className={`w-full flex-row justify-between items-center bg-[${themes[theme].buttonBackground}] p-2 py-3`}
                onPress={() =>
                  router.push({
                    pathname: "/listTasks",
                    params: { lista: lista },
                  })
                }
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons name={lista.icon} size={23} color={lista.color} />
                  <Text
                    className={`text-lg text-[${themes[theme].buttonText}]`}
                  >
                    {lista.title}
                  </Text>
                </View>
                <Text
                  className={`text-md font-bold text-[${themes[theme].buttonText}]`}
                >
                  {
                    errands.filter((errand) => errand.list === lista.title)
                      .length
                  }
                </Text>
              </Pressable>
              {index < listas.length && (
                <View
                  className={`h-[1px] bg-[${themes[theme].listsSeparator}] ml-10`}
                />
              )}
            </View>
          ))}
          <View>
            <Pressable
              className={`flex-row justify-between items-center bg-[${themes[theme].buttonBackground}] w-full p-2`}
            >
              <View className="flex-row items-center gap-3">
                <Ionicons name="trash" size={23} color="gray" />
                <Text className={`text-lg text-[${themes[theme].buttonText}]`}>
                  Papelera
                </Text>
              </View>
              <Text
                className={`text-md font-bold text-[${themes[theme].buttonText}]`}
              >
                0
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View className="flex-row  gap-6 mt-4">
        <Pressable className="flex-row gap-1">
          <Ionicons
            className="pb-2"
            name="add-circle"
            size={24}
            color="#045BEB"
          />
          <Text className="text-lg text-[#045BEB] text font-bold">
            Nuevo recordatorio
          </Text>
        </Pressable>
        <Pressable className="flex-row gap-2">
          <Ionicons className="pb-2" name="send" size={22} color="#3F3F3F" />
          <Text className="text-lg text-[#3F3F3F] text font-bold">
            Enviar recordatorio
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Main;
