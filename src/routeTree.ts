import {
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router'
import DashboardLayout from './components/layout/DashboardLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import SettingsPage from './pages/SettingsPage'

const rootRoute = createRootRoute({
  component: DashboardLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute, settingsRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
