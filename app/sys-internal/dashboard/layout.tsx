import { ReactNode } from 'react'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'

export default async function DashboardLayout({
  children
}: {
  children: ReactNode
}) {
  const session = await getAdminSession()

  if (!session) {
    redirect('/sys-internal/auth')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
