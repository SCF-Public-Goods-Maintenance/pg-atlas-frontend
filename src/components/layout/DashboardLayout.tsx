import React, { useEffect, useState } from 'react'
import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Info,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Rounds', href: '/rounds', icon: Info },
  { name: 'Contributors', href: '/contributors', icon: Info },
  { name: 'Graph', href: '/graph', icon: Info },
  { name: 'About', href: '/about', icon: Info },
]

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'pg-atlas-theme'
const DARK_CLASS = 'dark'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  })

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const currentNav = navigation.find((item) => isActive(item.href)) ?? navigation[0]
  const isDark = theme === 'dark'

  // Sidebar "active" styling driven directly from React state.
  // This avoids relying on Tailwind `dark:` variants for the active tab look.
  const activeLinkClass = isDark
    ? 'bg-white/8 text-white border-l-4 border-white/30'
    : 'bg-primary-50 text-[#0f0f21] border-l-4 border-primary-500'

  const inactiveLinkClass = isDark
    ? 'text-white/70 hover:bg-white/5 border-l-4 border-transparent'
    : 'text-[#0f0f21]/70 hover:bg-gray-50 hover:text-[#0f0f21] border-l-4 border-transparent'

  const activeIconClass = isDark ? 'text-white' : 'text-[#0f0f21]'
  const inactiveIconClass = isDark ? 'text-white/70' : 'text-[#0f0f21]/70'

  useEffect(() => {
    document.documentElement.classList.toggle(DARK_CLASS, isDark)
    document.body.classList.toggle(DARK_CLASS, isDark)
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [isDark, theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark'
      const isNextDark = nextTheme === 'dark'

      // Apply immediately for deterministic UX.
      // Guard against environments where DOM/localStorage writes can throw.
      try {
        document.documentElement.classList.toggle(DARK_CLASS, isNextDark)
        document.body.classList.toggle(DARK_CLASS, isNextDark)
        document.documentElement.dataset.theme = nextTheme
        document.documentElement.style.colorScheme = nextTheme
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
      } catch {
        // Ignore - React state update below is the source of truth.
      }

      return nextTheme
    })
  }

  useEffect(() => {
    document.title = 'pg-atlas'
  }, [])

  return (
    <div className={`${isDark ? 'dark bg-[#0f0f21] text-white' : 'bg-white text-[#0f0f21]'} min-h-screen flex`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[100] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-[#0f0f21]"
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
          isDark ? 'bg-[#0f0f21] border-white/20' : 'bg-white border-gray-200'
        } ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className={`flex items-center justify-between h-16 px-5 border-b bg-gradient-to-r ${
              isDark ? 'border-white/20 from-[#0f0f21] to-[#0f0f21]' : 'border-gray-100 from-white to-gray-50'
            }`}
          >
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold text-[#0f0f21] no-underline hover:text-primary-600 transition-colors dark:text-white"
            >
              <span className="text-xl tracking-tight">
                <span className={isDark ? 'text-white' : 'text-[#914cff]'}>PG</span>
                <span className={isDark ? 'text-[#914cff]' : 'text-[#0f0f21]'}>Atlas</span>
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
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto" aria-label="Primary navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                data-active={isActive(item.href)}
                className={`pgx-nav-link group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  isActive(item.href) ? activeLinkClass : inactiveLinkClass
                } after:absolute after:left-4 after:right-4 after:-bottom-[1px] after:h-[2px] after:rounded after:bg-[#914cff] after:opacity-0 after:transition-opacity after:duration-200 after:shadow-none ${
                  isActive(item.href)
                    ? 'after:opacity-100 after:shadow-[0_10px_20px_rgba(145,76,255,0.35)]'
                    : 'group-hover:after:opacity-100 group-hover:after:shadow-[0_10px_20px_rgba(145,76,255,0.35)]'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={`pgx-nav-icon h-5 w-5 mr-3 shrink-0 ${
                    isActive(item.href) ? activeIconClass : inactiveIconClass
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50 dark:border-white/20 dark:bg-[#0f0f21]">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-[#0f0f21]/80 hover:bg-gray-100 hover:text-[#0f0f21] rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-white/90 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {isDark ? (
                <Sun className="h-5 w-5 mr-3 text-amber-400 shrink-0" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5 mr-3 text-gray-500 shrink-0" aria-hidden="true" />
              )}
              <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-100 shrink-0 dark:bg-[#0f0f21] dark:border-white/20">
          <div className="flex items-center justify-between h-14 px-4 lg:px-6">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-white/80 dark:hover:bg-white/10"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-[#0f0f21] truncate dark:text-white">
              {currentNav.name}
            </h1>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch theme (currently ${isDark ? 'dark' : 'light'})`}
              className="text-xs font-medium text-[#0f0f21]/70 dark:text-white/70 hover:text-[#914cff] dark:hover:text-[#914cff] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#914cff] rounded-lg px-2 py-1"
            >
              {isDark ? 'Dark' : 'Light'}
            </button>
          </div>
        </header>

        <main id="main-content" className={`flex-1 overflow-y-auto ${isDark ? 'bg-[#0f0f21]' : 'bg-white'}`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
