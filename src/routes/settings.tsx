import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import Settings from "../pages/Settings/Settings";

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: Settings,
});
