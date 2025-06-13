import { useEffect, useMemo } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { View, Text, Pressable, TextInput, Switch } from "react-native";
import { useForm, Controller } from "react-hook-form";

import { useAtom } from "jotai";
import { contactsAtom, themeAtom, userAtom } from "../../constants/storeAtoms";

import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { themes } from "../../constants/themes";
import formatDay from "../../constants/formatDay";
import {
  priorityOptions,
  repeatOptions,
} from "../../constants/repeatPriorityOptions";

const ViewIncomingTaskModal = () => {
  const navigation = useNavigation();

  const { errand } = useLocalSearchParams();
  const currentErrand = useMemo(() => JSON.parse(errand), [errand]);

  const { control, watch } = useForm({
    defaultValues: { ...currentErrand },
  });

  const [user] = useAtom(userAtom);
  const [contacts] = useAtom(contactsAtom);

  const [theme] = useAtom(themeAtom);

  const watchedTitle = watch("title");

  useEffect(() => {
    navigation.setOptions({
      title: "Detalles",
      presentation: "modal",
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: false,
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Text className={`text-2xl text-[${themes[theme].blueHeadText}]`}>
            Cancelar
          </Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          disabled={!watchedTitle.trim()}
        >
          <Text
            className={`text-2xl font-bold ${watchedTitle.trim() ? `text-[${themes[theme].blueHeadText}]` : `text-[${themes[theme].taskSecondText}]`}`}
          >
            Ok
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, theme, watchedTitle]);

  const ownerCurrentErrand = contacts.find(
    (contact) => contact.id === currentErrand.ownerId
  );

  return (
    <View className={`p-6 gap-4 bg-[${themes[theme].background}] h-full`}>
      <View
        className={`bg-[${themes[theme].buttonMenuBackground}] rounded-xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
      >
        <Controller
          control={control}
          name="title"
          render={({ field: { value } }) => (
            <TextInput
              editable={false}
              className={`p-4 pl-4 text-lg ${
                errand.description
                  ? `border-b 
                  border-[${themes[theme].listsSeparator}]`
                  : ``
              }   align-top
                  leading-tight text-[${themes[theme].text}]`}
              value={value}
            />
          )}
        />
        {/* Description */}
        {errand.description && (
          <Controller
            control={control}
            name="description"
            render={({ field: { value } }) => (
              <TextInput
                editable={false}
                className={`p-4 pl-4 text-lg max-h-48 align-top leading-tight  text-[${themes[theme].text}]`}
                value={value}
                multiline={true}
              />
            )}
          />
        )}
      </View>

      <View
        className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] rounded-xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
      >
        <View className="flex-row items-center">
          <View className="mx-4 p-1.5 bg-neutral-600 rounded-lg">
            <Ionicons
              name="send"
              size={18}
              color={themes["light"].background}
              style={{ transform: [{ rotateY: "180deg" }] }}
            />
          </View>
          <Pressable
            className="py-3 pr-6"
            onPress={() => {
              console.log("Open contact info");
              // Fix this (open contact info)
            }}
          >
            <Text
              className={`text-lg font-semibold text-[${themes[theme].text}]`}
            >
              {ownerCurrentErrand.name + " " + ownerCurrentErrand.surname}
            </Text>
          </Pressable>
        </View>
        <Pressable
          className="px-4 py-3"
          onPress={() => {
            console.log("Info");
            // Fix this (modal to show info that user can only see this task but not edit it)
          }}
        >
          <Ionicons
            name="help-circle-outline"
            size={27}
            color={themes[theme].text}
          />
        </Pressable>
      </View>

      {/* <View
        className={`bg-[${themes[theme].buttonMenuBackground}] rounded-xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
      >
        <View className={`rounded-t-xl`}>
          <View className={`flex-row items-center rounded-t-xl`}>
            <Ionicons
              className="mx-4 p-1 bg-blue-500 rounded-lg"
              name="person"
              size={22}
              color={themes["light"].background}
            />
            <View
              className={`py-3 flex-1 gap-4 flex-row justify-between items-center border-b border-[${themes[theme].listsSeparator}]`}
            >
              <Text className={`text-[${themes[theme].text}] text-lg`}>
                Encargado
              </Text>
              <View
                className={`mr-4 px-3 py-1 rounded-2xl gap-1 flex-row items-center ${theme === "light" ? "bg-blue-100" : "bg-blue-600"}`}
              >
                <Text className={`text-lg text-[${themes[theme].text}]`}>
                  {`${user.name} ${user.surname} (Tú)`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className={`flex-row items-center rounded-b-xl`}>
          <Ionicons
            className="mx-4 p-1 bg-slate-500 rounded-lg "
            name="list"
            size={22}
            color={themes["light"].background}
          />
          <View className="py-3 gap-4 flex-1 flex-row justify-between items-center">
            <Text className={`text-[${themes[theme].text}] text-lg`}>
              Lista
            </Text>
            <View
              className={`mr-4 px-3 py-1 gap-1 flex-row items-center ${listAssigned.id === "" || listAssigned === false ? `bg-[${themes[theme].buttonMenuBackground}]` : `${theme === "light" ? "bg-slate-300" : "bg-slate-600"}`} rounded-2xl`}
            >
              <Text className={`text-lg text-[${themes[theme].text}]`}>
                Compartidos
              </Text>
            </View>
          </View>
        </View>
      </View> */}

      <View
        className={`bg-[${themes[theme].buttonMenuBackground}] rounded-xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
      >
        {/* Date */}
        <View className={`flex-row items-center rounded-t-xl`}>
          <Ionicons
            className="mx-4 p-1 bg-red-500 rounded-lg "
            name="calendar-outline"
            size={22}
            color={themes["light"].background}
          />
          <View
            className={`py-3 pr-5 flex-1 flex-row justify-between gap-4 items-center border-b border-[${themes[theme].listsSeparator}]`}
          >
            <Text className={`text-[${themes[theme].text}] text-lg`}>
              Fecha
            </Text>
            {watch("dateErrand") ? (
              <Text className={`ml-auto text-[${themes[theme].text}] text-lg`}>
                {formatDay(watch("dateErrand"))}
              </Text>
            ) : (
              <Text className={`ml-auto text-[${themes[theme].text}] text-lg`}>
                Sin fecha
              </Text>
            )}
          </View>
        </View>

        {/* Time */}
        <View
          className={`flex-row items-center ${watch("dateNotice") || watch("repeat") ? "" : "rounded-b-xl"}`}
        >
          <Ionicons
            className="mx-4 p-1 bg-yellow-500 rounded-lg"
            name="time-outline"
            size={23}
            color={themes["light"].background}
          />

          <View
            className={`py-3 pr-5 flex-1 flex-row justify-between gap-4 items-center ${watch("dateNotice") || watch("repeat") ? `border-b border-[${themes[theme].listsSeparator}]` : ""}`}
          >
            <Text className={`text-[${themes[theme].text}] text-lg`}>Hora</Text>
            {watch("timeErrand") ? (
              <Text className={`ml-auto text-[${themes[theme].text}] text-lg`}>
                {watch("timeErrand")}
              </Text>
            ) : (
              <Text className={`ml-auto text-[${themes[theme].text}] text-lg`}>
                Sin hora
              </Text>
            )}
          </View>
        </View>

        {/* Notice */}
        {watch("dateNotice") && (
          <View
            className={`flex-row items-center ${watch("repeat") || watch("repeat") ? "" : "rounded-b-xl"}`}
          >
            <FontAwesome6
              className="mx-4 p-1 px-1.5 bg-emerald-500 rounded-lg "
              name="bell"
              size={22}
              color={themes["light"].background}
            />

            <View
              className={`py-3 pr-5 flex-1 flex-row justify-between gap-4 items-center ${watch("repeat") ? `border-b border-[${themes[theme].listsSeparator}]` : ""}`}
            >
              <Text className={`text-[${themes[theme].text}] text-lg`}>
                Aviso
              </Text>
              {watch("dateNotice") && (
                <Text className={`text-[${themes[theme].text}] text-lg`}>
                  {formatDay(watch("dateNotice"))}, {watch("timeNotice")}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Repeat */}
        {watch("repeat") && (
          <View className={`flex-row items-center rounded-b-xl`}>
            <Ionicons
              className="mx-4 p-1 bg-violet-500 rounded-lg "
              name="repeat"
              size={23}
              color={themes["light"].background}
            />
            <View
              className={`py-3 pr-5 flex-1 flex-row justify-between gap-4 items-centerborder-b border-[${themes[theme].listsSeparator}]`}
            >
              <Text className={`text-[${themes[theme].text}] text-lg`}>
                Repetir
              </Text>
              <Text className={`text-lg text-[${themes[theme].text}]`}>
                {
                  repeatOptions.find(
                    (option) => option.value === watch("repeat")
                  )?.label
                }
              </Text>
            </View>
          </View>
        )}
      </View>

      <View
        className={`bg-[${themes[theme].buttonMenuBackground}] rounded-xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
      >
        {/* Marked */}
        <View className={`flex-row items-center rounded-t-xl`}>
          <Ionicons
            className="mx-4 p-1 bg-orange-500 rounded-lg "
            name="flag-sharp"
            size={22}
            color={themes["light"].background}
          />
          <View
            className={`py-3 flex-1 flex-row justify-between gap-4 items-center border-b border-[${themes[theme].listsSeparator}]`}
          >
            <Text className={`text-[${themes[theme].text}] text-lg`}>
              Marcador
            </Text>
            <Switch className="mr-4" value={watch("marked")} disabled />
          </View>
        </View>

        {/* Priority */}

        <View className={`flex-row items-center rounded-b-xl`}>
          <MaterialIcons
            className="mx-4 p-1 bg-rose-500 rounded-lg "
            name="priority-high"
            size={22}
            color={themes["light"].background}
          />
          <View className="py-4 gap-4 flex-1 flex-row justify-between items-center">
            <Text className={`text-[${themes[theme].text}] text-lg`}>
              Prioridad
            </Text>
            <Text className={`mr-5 text-lg text-[${themes[theme].text}]`}>
              {
                priorityOptions.find(
                  (option) => option.value === watch("priority")
                )?.label
              }
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default ViewIncomingTaskModal;
