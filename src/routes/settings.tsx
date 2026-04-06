import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";

const Settings = lazy(() => import("../pages/Settings"));

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: Settings,
});
