import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

const Contributors = lazy(() => import("../../pages/Contributors"));

export const contributorsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contributors",
  component: Contributors,
});
