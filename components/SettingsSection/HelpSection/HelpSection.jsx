import { ScrollView, View } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

import { useAtom } from "jotai";
import { themeAtom } from "../../../constants/storeUiAtoms";

import HelpAccordionItem from "./HelpAccordition/HelpAccordiotionItem";
import { themes } from "../../../constants/themes";
import i18n from "../../../constants/i18n";

const HelpSection = () => {
  const navigation = useNavigation();

  const [theme] = useAtom(themeAtom);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: i18n.t("help"),
      headerTitleStyle: {
        color: themes[theme].text,
      },
      headerStyle: {
        backgroundColor: themes[theme].background,
      },
      headerShadowVisible: true,
      headerSearchBarOptions: null,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, theme]);

  return (
    <ScrollView className="px-6 py-4">
      <View className="gap-4">
        <HelpAccordionItem
          title={i18n.t("helpWhatIsErrands")}
          description={i18n.t("helpWhatIsErrandsText")}
          faqs={[
            {
              question: i18n.t("helpFaqIsErrandsReminder"),
              answer: i18n.t("helpFaqIsErrandsReminderText"),
            },
            {
              question: i18n.t("helpFaqUseAlone"),
              answer: i18n.t("helpFaqUseAloneText"),
            },
          ]}
        />

        <HelpAccordionItem
          title={i18n.t("helpHowErrandsWork")}
          description={i18n.t("helpHowErrandsWorkText")}
          faqs={[
            {
              question: i18n.t("helpFaqMultipleAssignees"),
              answer: i18n.t("helpFaqMultipleAssigneesText"),
            },
            {
              question: i18n.t("helpFaqWhenCompleted"),
              answer: i18n.t("helpFaqWhenCompletedText"),
            },
          ]}
        />

        <HelpAccordionItem
          title={i18n.t("helpListsSharing")}
          description={i18n.t("helpListsSharingText")}
        />

        <HelpAccordionItem
          title={i18n.t("helpContacts")}
          description={i18n.t("helpContactsText")}
        />

        <HelpAccordionItem
          title={i18n.t("helpNotifications")}
          description={i18n.t("helpNotificationsText")}
          faqs={[
            {
              question: i18n.t("helpFaqNoNotifications"),
              answer: i18n.t("helpFaqNoNotificationsText"),
            },
            {
              question: i18n.t("helpFaqMuteDifference"),
              answer: i18n.t("helpFaqMuteDifferenceText"),
            },
          ]}
        />

        <HelpAccordionItem
          title={i18n.t("helpProblems")}
          description={i18n.t("helpProblemsText")}
        />

        <HelpAccordionItem
          title={i18n.t("helpAccount")}
          description={i18n.t("helpAccountText")}
        />

        <HelpAccordionItem
          title={i18n.t("helpSupport")}
          description={i18n.t("helpSupportText")}
        />
      </View>
    </ScrollView>
  );
};

export default HelpSection;
