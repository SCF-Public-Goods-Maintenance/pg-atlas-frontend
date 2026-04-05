import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";
import Contributors from "../../pages/Contributors/Contributors";

export const contributorsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contributors",
  component: Contributors,
});
