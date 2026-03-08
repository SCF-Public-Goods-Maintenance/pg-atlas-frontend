import { useState } from 'react'
import { Link, Outlet, useRouter } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Settings,
  Info,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'About', href: '/about', icon: Info },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = router.state.location.pathname

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const currentNav = navigation.find((item) => isActive(item.href)) ?? navigation[0]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600/75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold text-gray-900 no-underline hover:text-primary-600 transition-colors"
            >
              <span className="text-xl tracking-tight">PGAtlas</span>
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 shrink-0 ${
                    isActive(item.href) ? 'text-primary-600' : 'text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User / Sign out area */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors"
              >
                <User className="h-5 w-5 mr-3 text-gray-500 shrink-0" />
                <span className="truncate">Account</span>
                <ChevronDown className="h-4 w-4 ml-auto shrink-0" />
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    aria-hidden
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute bottom-full left-0 right-0 mb-1 py-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <button
                      type="button"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between h-14 px-4 lg:px-6">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 truncate">
              {currentNav.name}
            </h1>
            <div className="w-10 lg:w-0" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
