import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import About from "../pages/About/About";

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});
