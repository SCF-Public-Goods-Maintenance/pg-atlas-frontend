import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";
import Contributor from "../../pages/Contributor/Contributor";

export const contributorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contributors/$id",
  component: Contributor,
});
