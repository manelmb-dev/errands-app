import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import { themeAtom } from "../../../../constants/storeAtoms";
import { useAtom } from "jotai";

import { themes } from "../../../../constants/themes";

const HelpAccordionItem = ({ title, description, faqs = [] }) => {
  const [open, setOpen] = useState(false);

  const [theme] = useAtom(themeAtom);

  return (
    <View className={`border-b border-[${themes[theme].borderColor}]`}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="flex-row items-center justify-between p-4"
        activeOpacity={0.7}
      >
        <Text className={`text-lg font-medium text-[${themes[theme].text}]`}>
          {title}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={themes[theme].taskSecondText}
        />
      </TouchableOpacity>

      {open && (
        <View className="px-4 pb-4 gap-3">
          <Text className={`text-base text-[${themes[theme].taskSecondText}]`}>
            {description}
          </Text>
          {/* FAQs */}
          {faqs.length > 0 && (
            <View className="pl-4 gap-3">
              {faqs.map((faq, index) => (
                <View key={index} className="gap-1">
                  <Text
                    className={`text-base font-medium text-[${themes[theme].text}]`}
                  >
                    {faq.question}
                  </Text>
                  <Text
                    className={`text-base text-[${themes[theme].taskSecondText}]`}
                  >
                    {faq.answer}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default HelpAccordionItem;
