import { createRootRoute } from "@tanstack/react-router";
import DashboardLayout from "../components/layouts/DashboardLayout";

export const rootRoute = createRootRoute({
  component: DashboardLayout,
});
