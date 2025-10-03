'use client';

import { AlertTriangle, Mail, Rocket, CheckCircle } from 'lucide-react';

interface QuotaLimitReachedProps {
  limitType: 'conversation' | 'daily' | 'total';
  currentLimit: number;
}

export function QuotaLimitReached({ limitType, currentLimit }: QuotaLimitReachedProps) {
  const config = {
    conversation: {
      icon: AlertTriangle,
      title: 'Limite de conversation atteinte',
      description: `Cette conversation a atteint ${currentLimit} messages (limite démo).`,
      action: 'Créez une nouvelle conversation pour continuer',
      color: 'orange',
    },
    daily: {
      icon: AlertTriangle,
      title: 'Limite quotidienne atteinte',
      description: `Vous avez envoyé ${currentLimit} messages aujourd'hui (limite démo).`,
      action: 'Revenez demain ou contactez-nous',
      color: 'red',
    },
    total: {
      icon: Rocket,
      title: 'Limite de conversations atteinte',
      description: `Vous avez atteint ${currentLimit} conversations (limite démo).`,
      action: 'Les plus anciennes seront automatiquement supprimées',
      color: 'blue',
    },
  };

  const { icon: Icon, title, description, action, color } = config[limitType];

  const colorClasses = {
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const buttonColors = {
    orange: 'bg-orange-600 hover:bg-orange-700',
    red: 'bg-red-600 hover:bg-red-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <div className={`border rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full bg-white`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-sm mb-4">{description}</p>
          <p className="text-sm font-medium mb-4">💡 {action}</p>

          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
            <h4 className="font-semibold text-gray-900">
              🚀 Passez à la version complète
            </h4>

            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Conversations illimitées</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Messages illimités par conversation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Installation sur vos serveurs (données privées)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Personnalisation interface</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Support technique dédié</span>
              </li>
            </ul>

            <a
              href="mailto:contact@lexia.ci?subject=Demande version complète LexIA&body=Bonjour,%0D%0A%0D%0AJe souhaite obtenir des informations sur la version complète de LexIA.%0D%0A%0D%0ANom de l'organisation:%0D%0AContact:%0D%0ABesoins spécifiques:"
              className={`flex items-center justify-center gap-2 w-full ${buttonColors[color]} text-white px-4 py-2.5 rounded-lg font-medium transition-colors`}
            >
              <Mail className="h-4 w-4" />
              Demander un devis
            </a>

            <p className="text-xs text-gray-500 text-center">
              Idéal pour : Institutions • Cabinets d'avocats • Entreprises
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
