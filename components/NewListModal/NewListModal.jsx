import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableHighlight,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";

import { useAtom } from "jotai";
import { listsAtom, themeAtom, userAtom } from "../../constants/storeAtoms";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";

import { themes } from "../../constants/themes";
import IconGrid from "./IconGrid/IconGrid";
import ColorGrid from "./ColorGrid/ColorGrid";

const NewListModal = () => {
  const navigation = useNavigation();

  const [user] = useAtom(userAtom);

  const [theme] = useAtom(themeAtom);
  const [, setLists] = useAtom(listsAtom);

  const [assignedColor, setAssignedColor] = useState("red");
  const [assignedIcon, setAssignedIcon] = useState("list");

  const [showPalleteColor, setShowPalleteColor] = useState(false);
  const [showIconGrid, setShowIconGrid] = useState(false);

  const setListToFS = (data) => {
    const newList = {
      // function to FS
      ...data,
      id: new Date().toISOString(), // Generate a unique ID
    };
    return newList; // Return the complete list object
  };

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      id: "",
      ownerId: user.id,
      title: "",
      icon: "",
      color: "",
    },
  });

  const watchedTitle = watch("title");

  useEffect(() => {
    navigation.setOptions({
      title: "Nueva lista",
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
    setValue("icon", assignedIcon);
    setValue("color", assignedColor);
  }, [assignedColor, assignedIcon, setValue]);

  // Function to handle dismiss modal
  useEffect(() => {
    const dismissModal = navigation.addListener("beforeRemove", (e) => {
      // Codigo
    });
    return dismissModal;
  }, [navigation]);

  // Function to handle cancel alert
  const handleCancelAlert = useCallback(() => {
    if (watch("title").length > 0) {
      Alert.alert("Se descartará la nueva lista", "", [
        {
          text: "Descartar",
          onPress: () => {
            navigation.goBack();
          },
          style: "destructive",
        },
        {
          text: "Cancelar",
        },
      ]);
    } else {
      navigation.goBack();
    }
  }, [navigation, watch]);

  // Function to handle add new errand
  const handleAdd = handleSubmit((data) => {
    console.log(data); // Set to FIRESTORE

    // Add errand to DB
    const newListWithId = setListToFS(data);
    setLists((prevLists) => [...prevLists, newListWithId]);
    // Reset form values
    navigation.goBack();
  });

  return (
    <View
      className={`flex-1 p-6 bg-[${themes[theme].background}] items-center`}
    >
      <View
        className={`p-4 justify-center items-center bg-[${themes[theme].buttonMenuBackground}] mb-4 rounded-xl shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"}`}
      >
        <Ionicons
          name={assignedIcon}
          size={58}
          color={assignedColor}
        ></Ionicons>
      </View>
      <View
        className={`${showIconGrid && "flex-1"} bg-[${themes[theme].buttonMenuBackground}] mb-4 rounded-xl shadow ${theme === "light" ? "shadow-gray-300" : "shadow-neutral-950"} w-full`}
      >
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              autoFocus
              className={`p-4 pl-4 text-2xl border-b-hairline ${theme === "light" ? "border-gray-300" : "border-neutral-950"} align-top leading-tight text-[${themes[theme].text}]`}
              value={value}
              onChangeText={onChange}
              placeholder="Título de la lista"
              placeholderTextColor={
                theme === "dark" && themes[theme].taskSecondText
              }
            />
          )}
        />
        {/* Color */}
        <TouchableHighlight
          onPress={() => setShowPalleteColor((prev) => !prev)}
        >
          <View
            className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}]  pt-2 pb-2 px-4`}
          >
            <View className="flex-row gap-4 items-center">
              <MaterialIcons
                className="p-1 bg-slate-400 rounded-lg"
                name="color-lens"
                size={23}
                color={themes["light"].background}
              />
              <View>
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  Color
                </Text>
              </View>
            </View>
            <View className="flex-row gap-3 items-center">
              <FontAwesome6
                name="arrows-up-down"
                size={22}
                color={themes["light"].taskSecondText}
              />
              <View
                className={`flex-row items-center py-4 px-8 rounded-2xl`}
                style={{ backgroundColor: assignedColor }}
              />
            </View>
          </View>
        </TouchableHighlight>

        {/* Color palette */}
        {showPalleteColor && (
          <ColorGrid
            assignedColor={assignedColor}
            setAssignedColor={setAssignedColor}
          />
        )}

        {/* Icon */}
        <TouchableHighlight
          className={`${showIconGrid ? "" : "rounded-b-xl"}`}
          onPress={() => setShowIconGrid((prev) => !prev)}
        >
          <View
            className={`flex-row justify-between bg-[${themes[theme].buttonMenuBackground}] pt-2 pb-2 px-4 ${showIconGrid ? "" : "rounded-b-xl"}`}
          >
            <View className="flex-row gap-4 items-center">
              <Ionicons
                className="p-1 bg-slate-400 rounded-lg"
                name="apps-outline"
                size={23}
                color={themes["light"].background}
              />
              <View>
                <Text className={`text-[${themes[theme].text}] text-base`}>
                  Icono
                </Text>
              </View>
            </View>
            <View className="flex-row gap-3 items-center mr-1">
              <FontAwesome6
                name="arrows-up-down"
                size={22}
                color={themes["light"].taskSecondText}
              />
              <Ionicons name={assignedIcon} size={26} color={assignedColor} />
            </View>
          </View>
        </TouchableHighlight>

        {/* Icon Grid */}
        {showIconGrid && (
          <IconGrid
            assignedColor={assignedColor}
            assignedIcon={assignedIcon}
            setAssignedIcon={setAssignedIcon}
          />
        )}
      </View>
    </View>
  );
};
export default NewListModal;
