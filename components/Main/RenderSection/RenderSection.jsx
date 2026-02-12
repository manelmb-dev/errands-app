import NotificationsSection from "../../NotificationsSection/NotificationsSection";
import SettingsSection from "../../SettingsSection/SettingsSectionComp";
import FilterTasks from "../../FilterTasksComp/FilterTasksComp";
import AiComp from "../../AiComp/AiComp";
import Home from "../../Home/Home";

function RenderSection({ activeSection }) {
  switch (activeSection) {
    case "home":
      return <Home />;
    case "search":
      return <FilterTasks />;
    case "ai":
      return <AiComp />;
    case "notifications":
      return <NotificationsSection />;
    case "settings":
      return <SettingsSection />;
    default:
      return null;
  }
}

export default RenderSection;
