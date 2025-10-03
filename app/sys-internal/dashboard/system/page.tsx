'use client'

import { useState, useEffect } from 'react'
import { Settings, Activity, Database, Zap, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'

interface ServiceStatus {
  name: string
  status: 'online' | 'offline' | 'warning'
  description: string
}

export default function SystemPage() {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkServices()
  }, [])

  const checkServices = async () => {
    try {
      // Appeler l'API pour vérifier les services
      const res = await fetch('/api/admin/system/status')
      const data = await res.json()

      const servicesCheck: ServiceStatus[] = [
        {
          name: 'Prisma DB',
          status: data.services?.database ? 'online' : 'offline',
          description: 'SQLite - Base de données'
        },
        {
          name: 'Groq API',
          status: data.services?.groqApi ? 'online' : 'offline',
          description: data.services?.groqApi ? 'API Key configurée' : 'Clé API manquante'
        },
        {
          name: 'ChromaDB',
          status: data.chromaDbOnline ? 'online' : 'warning',
          description: data.chromaDbOnline ? 'Serveur actif' : 'Serveur non démarré'
        }
      ]

      setServices(servicesCheck)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-50 border-green-200 text-green-700'
      case 'offline':
        return 'bg-red-50 border-red-200 text-red-700'
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-700'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'offline':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      default:
        return <Activity className="w-5 h-5 text-gray-600" />
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Gestion Système</h1>
        <p className="text-gray-600 mt-1">Monitoring et configuration</p>
      </div>

      {/* État des services */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          État des services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border-2 ${getStatusColor(service.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{service.name}</h4>
                {getStatusIcon(service.status)}
              </div>
              <p className="text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration système */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Node.js</span>
              <span className="text-sm text-gray-600">{process.version}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Next.js</span>
              <span className="text-sm text-gray-600">15.x</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Base de données</span>
              <span className="text-sm text-gray-600">Prisma + SQLite</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Environnement</span>
              <span className="text-sm text-gray-600">
                {process.env.NODE_ENV || 'development'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Actions rapides
          </h3>
          <div className="space-y-3">
            <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-3">
              <Database className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Vérifier Prisma</p>
                <p className="text-xs text-blue-700">Tester la connexion DB</p>
              </div>
            </button>

            <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-3">
              <Settings className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">Configurer ChromaDB</p>
                <p className="text-xs text-purple-700">Voir le guide CHROMADB_EXPLIQUE.md</p>
              </div>
            </button>

            <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Tester Groq API</p>
                <p className="text-xs text-green-700">Vérifier la clé API</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Variables d'environnement */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Variables d'environnement
        </h3>
        <div className="space-y-2 font-mono text-sm">
          <div className="p-3 bg-gray-50 rounded flex justify-between">
            <span className="text-gray-600">GROQ_API_KEY</span>
            <span className="text-gray-900">
              {process.env.GROQ_API_KEY ? '✓ Configuré' : '✗ Non configuré'}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded flex justify-between">
            <span className="text-gray-600">DATABASE_URL</span>
            <span className="text-gray-900">✓ Configuré</span>
          </div>
          <div className="p-3 bg-gray-50 rounded flex justify-between">
            <span className="text-gray-600">ADMIN_SECRET_KEY</span>
            <span className="text-gray-900">✓ Configuré</span>
          </div>
          <div className="p-3 bg-gray-50 rounded flex justify-between">
            <span className="text-gray-600">CHROMA_HOST</span>
            <span className="text-orange-600">✗ Non configuré</span>
          </div>
        </div>
      </div>

      {/* Guide de configuration */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Prochaines étapes
        </h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Configurer ChromaDB pour activer la recherche vectorielle</li>
          <li>• Lancer le scraper Python pour collecter les données juridiques</li>
          <li>• Consulter GUIDE_LEXIA.md pour le setup complet</li>
          <li>• Vérifier CHROMADB_EXPLIQUE.md pour ChromaDB</li>
        </ul>
      </div>
    </div>
  )
}
