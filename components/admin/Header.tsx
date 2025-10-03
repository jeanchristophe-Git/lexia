'use client'

import { useRouter } from 'next/navigation'
import { Shield, LogOut, Activity } from 'lucide-react'

export default function AdminHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/sys-internal/auth')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">LexIA Admin</h1>
            <p className="text-xs text-gray-500">Dashboard système</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">Système actif</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  )
}
