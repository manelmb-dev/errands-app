import { ScrollView, View } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

import { useAtom } from "jotai";
import { themeAtom } from "../../../constants/storeAtoms";

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
        />

        <HelpAccordionItem
          title={i18n.t("helpHowErrandsWork")}
          description={i18n.t("helpHowErrandsWorkText")}
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
