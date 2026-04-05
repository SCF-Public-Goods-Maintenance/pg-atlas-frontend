import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import Home from "../pages/Home/Home";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
