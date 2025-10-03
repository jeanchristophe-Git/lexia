'use client'

import { useState, useEffect } from 'react'
import { Database, MessageSquare, Users, CheckCircle, TrendingUp, Activity, Loader2 } from 'lucide-react'

function StatCard({
  title,
  value,
  icon: Icon,
  loading
}: {
  title: string
  value: string | number
  icon: any
  loading?: boolean
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="text-gray-400">Chargement...</span>
        </div>
      ) : (
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats/overview')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (seconds < 60) return 'Il y a quelques secondes'
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`
    return `Il y a ${Math.floor(seconds / 86400)} jours`
  }

  return (
    <div className="space-y-8 mt-16">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
        <p className="text-gray-600 mt-1">Dashboard administrateur LexIA</p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Conversations"
          value={stats?.totalConversations || 0}
          icon={MessageSquare}
          loading={loading}
        />
        <StatCard
          title="Total Messages"
          value={stats?.totalMessages || 0}
          icon={Database}
          loading={loading}
        />
        <StatCard
          title="Conversations (24h)"
          value={stats?.conversationsToday || 0}
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="ChromaDB Docs"
          value="0"
          icon={CheckCircle}
          loading={loading}
        />
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activité récente
          </h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : stats?.recentActivity?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity: any, i: number) => (
                <div key={i} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-gray-700 line-clamp-2">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">Role: {activity.role}</p>
                  </div>
                  <p className="text-xs text-gray-500 whitespace-nowrap ml-4">{formatTimeAgo(activity.time)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Aucune activité récente</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Informations système</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Base de données</span>
              <span className="text-sm text-gray-600">Prisma + SQLite</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">ChromaDB</span>
              <span className="text-sm text-orange-600">Non configuré</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Groq API</span>
              <span className="text-sm text-green-600">Configuré</span>
            </div>
          </div>
        </div>
      </div>

      {/* État des services */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">État des services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-sm">Prisma DB</span>
            </div>
            <span className="text-xs text-green-700">En ligne</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="font-medium text-sm">ChromaDB</span>
            </div>
            <span className="text-xs text-orange-700">Non configuré</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-sm">Groq API</span>
            </div>
            <span className="text-xs text-green-700">En ligne</span>
          </div>
        </div>
      </div>
    </div>
  )
}
