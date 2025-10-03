'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Shield, Database, BarChart3, Settings, Search, Loader2 } from 'lucide-react'

export default function AdminAuth() {
  const [accessKey, setAccessKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey })
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/sys-internal/dashboard')
      } else {
        setError(data.error || 'Authentification échouée')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Partie gauche - Formulaire */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 lg:px-16">
        <div className="w-full max-w-md">
          {/* Logo et titre */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">LexIA Admin</h1>
                <p className="text-sm text-gray-500">Côte d'Ivoire</p>
              </div>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-green-600 rounded-full"></div>
          </div>

          {/* Sous-titre */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Accès sécurisé
            </h2>
            <p className="text-gray-600">
              Entrez votre clé d'accès pour gérer le système
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Clé d'accès administrateur
              </label>
              <input
                type="password"
                placeholder="Entrez votre clé secrète"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-700" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-green-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !accessKey}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Vérification en cours...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  Accéder au Dashboard
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Connexion sécurisée JWT
              </span>
              <span>Session 24h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Partie droite - Image/Design */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-500 via-orange-600 to-green-600 items-center justify-center p-12 relative overflow-hidden">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        {/* Contenu central */}
        <div className="relative z-10 text-white text-center max-w-lg">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Dashboard Administrateur
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Gérez et surveillez LexIA en temps réel
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 text-left">
            {[
              { Icon: Database, text: 'Explorez ChromaDB et les documents juridiques' },
              { Icon: BarChart3, text: 'Analytics détaillées et statistiques d\'usage' },
              { Icon: Settings, text: 'Monitoring système et gestion des services' },
              { Icon: Search, text: 'Recherche vectorielle en temps réel' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <feature.Icon className="w-8 h-8" />
                <span className="text-lg">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Badge CI */}
          <div className="mt-12 inline-block px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Développé pour la Côte d'Ivoire
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
