import { View, Text, TouchableHighlight } from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
  errandsAtom,
  themeAtom,
  userAtom,
} from "../../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../constants/themes";
import { getSharedSlides } from "./slides";

export default function SharedSection() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const [containerWidth, setContainerWidth] = useState(0);

  const [user] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [errands] = useAtom(errandsAtom);

  const slides = getSharedSlides(errands, user);

  return (
    <View
      className={`w-full mt-3 pt-5 bg-[${themes[theme].buttonMenuBackground}] rounded-t-3xl rounded-b-3xl border border-[${themes[theme].listsSeparator}] shadow-sm ${theme === "light" ? "shadow-gray-100" : "shadow-neutral-950"}`}
    >
      <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
        <ScrollView
          className="pb-5"
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            const index = Math.round(x / containerWidth);
            setActiveIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {slides.map((slide) => {
            const Icon = slide.icon.lib;
            return (
              <View
                key={slide.title}
                className="px-4"
                style={{ width: containerWidth }}
              >
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: slide.route,
                      params: {
                        tabParams: JSON.stringify(slide.params),
                      },
                    })
                  }
                >
                  <View className={`flex-row rounded-t-3xl gap-3`}>
                    <Icon
                      className={`bg-[${themes[theme].iconColor}] p-2 rounded-xl`}
                      name={slide.icon.name}
                      size={slide.icon.size}
                      color={`${theme === "light" ? `${themes["dark"].text}` : `${themes["light"].text}`}`}
                    />
                    <View>
                      <Text
                        className={`text-lg font-semibold text-[${themes[theme].text}]`}
                      >
                        {slide.title}
                      </Text>
                      <Text
                        className={`text-sm font-medium text-[${themes[theme].taskSecondText}]`}
                      >
                        {slide.secondTitle}
                      </Text>
                    </View>
                  </View>
                </Pressable>

                {/* Social buttons */}
                <View className="flex-row pt-4 gap-3">
                  {slide.data.map((card) => (
                    <TouchableHighlight
                      key={card.label}
                      className="flex-1 rounded-2xl"
                      onPress={() => {
                        router.push({
                          pathname: card.route,
                          params: {
                            tabParams: JSON.stringify(card.params),
                          },
                        });
                      }}
                    >
                      <View
                        className={`py-3 items-center bg-[${themes[theme].background}] rounded-2xl`}
                      >
                        <Text
                          className={`text-base text-[${themes[theme].text}]`}
                        >
                          {card.label}
                        </Text>
                        <Text
                          className={`text-3xl text-[${themes[theme].taskSecondText}]`}
                        >
                          {card.value}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View className="flex-row justify-center mb-4">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`w-[6px] h-[6px] rounded-full mx-1 ${
                activeIndex === index
                  ? `${theme === "light" ? "bg-gray-600" : "bg-gray-300"}`
                  : `${theme === "light" ? "bg-gray-500" : "bg-gray-400"} opacity-50`
              }`}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
