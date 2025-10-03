'use client'

import { useState, useEffect } from 'react'
import { BarChart3, MessageSquare, TrendingUp, Users, Loader2 } from 'lucide-react'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/stats/analytics')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 mt-16">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8 mt-16">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Statistiques et tendances d'utilisation</p>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Conversations</p>
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalConversations || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Messages</p>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalMessages || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Questions Posées</p>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.userMessages || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Réponses IA</p>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.assistantMessages || 0}</p>
        </div>
      </div>

      {/* Graphique hebdo */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Activité de la semaine
        </h3>
        <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">{stats?.conversationsWeek || 0} conversations cette semaine</p>
          </div>
        </div>
      </div>

      {/* Top questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Questions récentes
          </h3>
          {stats?.topQuestions?.length > 0 ? (
            <div className="space-y-3">
              {stats.topQuestions.map((item: any, i: number) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 line-clamp-2">{item.question}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(item.date)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Aucune question pour le moment</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Répartition des messages</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Questions utilisateurs</span>
                <span className="text-gray-600">{stats?.userMessages || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-green-600 h-3 rounded-full"
                  style={{
                    width: `${
                      stats?.totalMessages
                        ? (stats.userMessages / stats.totalMessages) * 100
                        : 0
                    }%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Réponses IA</span>
                <span className="text-gray-600">{stats?.assistantMessages || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                  style={{
                    width: `${
                      stats?.totalMessages
                        ? (stats.assistantMessages / stats.totalMessages) * 100
                        : 0
                    }%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">
                Taux de réponse : {stats?.totalMessages && stats?.userMessages
                  ? ((stats.assistantMessages / stats.userMessages) * 100).toFixed(1)
                  : 0}%
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Métriques de performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Performances système</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Base de données</p>
            <p className="text-2xl font-bold text-green-700">Actif</p>
            <p className="text-xs text-gray-500 mt-1">Prisma + SQLite</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Groq API</p>
            <p className="text-2xl font-bold text-blue-700">Opérationnel</p>
            <p className="text-xs text-gray-500 mt-1">LLaMA 3.1 70B</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">ChromaDB</p>
            <p className="text-2xl font-bold text-orange-700">À configurer</p>
            <p className="text-xs text-gray-500 mt-1">Recherche vectorielle</p>
          </div>
        </div>
      </div>
    </div>
  )
}
