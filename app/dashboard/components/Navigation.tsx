'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Folder,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react'

interface NavigationProps {
  userName: string
  userRole: string
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Cases', href: '/cases', icon: Folder },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Interventions', href: '/interventions', icon: BookOpen },
  { name: 'Meetings', href: '/meetings', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Navigation({ userName, userRole }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full">
              <span className="text-xl">⭐</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Maia</h1>
              <p className="text-xs text-gray-500">SSS Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-[#0066CC] font-medium'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {userName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
          </div>
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full">
              <span className="text-xl">⭐</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Maia</h1>
              <p className="text-xs text-gray-500">SSS Platform</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-[#0066CC] font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {userName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">{userRole}</p>
                </div>
              </div>
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
