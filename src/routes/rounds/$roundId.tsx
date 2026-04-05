import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";
import Round from "../../pages/Round/Round";

export const roundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rounds/$roundId",
  component: Round,
});
