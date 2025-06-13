import NotificationsSection from "../../NotificationsSection/NotificationsSection";
import SettingsSection from "../../SettingsSection/SettingsSection";
import FilterTasks from "../../FilterTasks/FilterTasks";
import Home from "../../Home/Home";

function RenderSection({ activeSection }) {
  switch (activeSection) {
    case "home":
      return <Home />;
    case "search":
      return <FilterTasks />;
    case "notifications":
      return <NotificationsSection />;
    case "settings":
      return <SettingsSection />;
    default:
      return null;
  }
}

export default RenderSection;
