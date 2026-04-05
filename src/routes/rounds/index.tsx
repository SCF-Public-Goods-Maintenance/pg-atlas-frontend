import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";
import Rounds from "../../pages/Rounds/Rounds";

export const roundsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rounds",
  component: Rounds,
});
