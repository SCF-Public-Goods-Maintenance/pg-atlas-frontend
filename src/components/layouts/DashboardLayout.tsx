import { useEffect, useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Trophy,
  Users,
  Share2,
  BookOpen,
  Menu,
  X,
  Moon,
  Sun,
  Github,
} from "lucide-react";
import type { NavItem, NavSection, Theme } from "../../types";

const navSections: NavSection[] = [
  {
    items: [{ name: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Explore",
    items: [
      { name: "Rounds", href: "/rounds", icon: Trophy },
      { name: "Contributors", href: "/contributors", icon: Users },
      { name: "Graph", href: "/graph", icon: Share2 },
    ],
  },
  {
    label: "System",
    items: [{ name: "About", href: "/about", icon: BookOpen }],
  },
];

const navigation: NavItem[] = navSections.flatMap((s) => s.items);

const THEME_STORAGE_KEY = "pg-atlas-theme";
const DARK_CLASS = "dark";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const currentNav =
    navigation.find((item) => isActive(item.href)) ?? navigation[0];
  const isDark = theme === "dark";

  const activeLinkClass = isDark
    ? "bg-white/8 text-white border-l-4 border-white/30"
    : "bg-primary-50 text-surface-dark border-l-4 border-primary-500";

  const inactiveLinkClass = isDark
    ? "text-white/70 hover:bg-white/5 border-l-4 border-transparent"
    : "text-surface-dark/70 hover:bg-gray-50 hover:text-surface-dark border-l-4 border-transparent";

  const activeIconClass = isDark ? "text-white" : "text-surface-dark";
  const inactiveIconClass = isDark ? "text-white/70" : "text-surface-dark/70";

  useEffect(() => {
    document.documentElement.classList.toggle(DARK_CLASS, isDark);
    document.body.classList.toggle(DARK_CLASS, isDark);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [isDark, theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";
      const isNextDark = nextTheme === "dark";

      try {
        document.documentElement.classList.toggle(DARK_CLASS, isNextDark);
        document.body.classList.toggle(DARK_CLASS, isNextDark);
        document.documentElement.dataset.theme = nextTheme;
        document.documentElement.style.colorScheme = nextTheme;
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch {
        // Ignore - React state update below is the source of truth.
      }

      return nextTheme;
    });
  };

  useEffect(() => {
    document.title = "pg-atlas";
  }, []);

  return (
    <div
      className={`${isDark ? "dark bg-surface-dark text-white" : "bg-surface-light text-surface-dark"} min-h-screen flex`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[100] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-surface-dark"
      >
        Skip to main content
      </a>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600/75 dark:bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative ${
          isDark
            ? "bg-surface-dark border-white/20"
            : "bg-surface-light border-gray-200"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className={`flex items-center justify-between h-16 px-5 border-b bg-gradient-to-r ${
              isDark
                ? "border-white/20 from-surface-dark to-surface-dark"
                : "border-gray-100 from-white to-gray-50"
            }`}
          >
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold text-surface-dark no-underline hover:text-primary-600 transition-colors dark:text-white"
            >
              <span className="text-xl tracking-tight">
                <span className={isDark ? "text-white" : "text-primary-500"}>
                  PG
                </span>
                <span
                  className={isDark ? "text-primary-500" : "text-surface-dark"}
                >
                  Atlas
                </span>
              </span>
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav */}
          <nav
            className="flex-1 px-3 py-4 overflow-y-auto"
            aria-label="Primary navigation"
          >
            {navSections.map((section, sIdx) => (
              <div
                key={section.label ?? sIdx}
                className={sIdx > 0 ? "mt-4" : ""}
              >
                {section.label && (
                  <div className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-surface-dark/30 dark:text-white/25">
                    {section.label}
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      data-active={isActive(item.href)}
                      className={`pgx-nav-link group relative flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                        isActive(item.href)
                          ? activeLinkClass
                          : inactiveLinkClass
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`pgx-nav-icon h-5 w-5 mr-3 shrink-0 ${
                          isActive(item.href)
                            ? activeIconClass
                            : inactiveIconClass
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-gray-100 dark:border-white/20">
            <div className="p-3">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-surface-dark/80 hover:bg-gray-100 hover:text-surface-dark rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {isDark ? (
                  <Sun
                    className="h-4 w-4 mr-3 text-amber-400 shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <Moon
                    className="h-4 w-4 mr-3 text-gray-500 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span className="text-xs">
                  {isDark ? "Light mode" : "Dark mode"}
                </span>
              </button>
            </div>
            <div className="px-6 pb-4 flex items-center justify-between text-[10px] text-surface-dark/30 dark:text-white/20">
              <span>v0.0.0 · MPL-2.0</span>
              <a
                href="https://github.com/SCF-Public-Goods-Maintenance/pg-atlas-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-surface-dark/50 dark:hover:text-white/40 transition-colors"
                aria-label="GitHub repository"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-surface-light border-b border-gray-100 shrink-0 h-16 dark:bg-surface-dark dark:border-white/20">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-white/80 dark:hover:bg-white/10"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-surface-dark truncate dark:text-white">
              {currentNav.name}
            </h1>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="p-2 rounded-lg text-surface-dark/70 dark:text-white/70 hover:text-primary-500 dark:hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        <main
          id="main-content"
          className={`flex-1 overflow-y-auto ${isDark ? "bg-surface-dark" : "bg-surface-light"}`}
        >
          <div className="h-full px-4 pt-3 pb-4 lg:px-6 lg:pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
