'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BarChart3, Settings, HardDrive, FileText } from 'lucide-react'

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Vue d\'ensemble',
    href: '/sys-internal/dashboard',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    href: '/sys-internal/dashboard/analytics',
  },
  {
    icon: Settings,
    label: 'Système',
    href: '/sys-internal/dashboard/system',
  },
  {
    icon: HardDrive,
    label: 'Base de données',
    href: '/sys-internal/dashboard/database',
  },
  {
    icon: FileText,
    label: 'Logs',
    href: '/sys-internal/dashboard/logs',
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-orange-50 to-green-50 text-orange-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 mb-1">Route sécurisée</p>
        <code className="text-xs font-mono text-gray-700 block truncate">
          /sys-internal
        </code>
      </div>
    </aside>
  )
}
