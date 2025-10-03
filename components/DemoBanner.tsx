'use client';

import { AlertCircle, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold">Version Démo</span>
              <span className="text-blue-100 text-sm">
                20 conversations • 50 messages par conversation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:contact@lexia.ci?subject=Demande version complète LexIA"
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Obtenir la version complète</span>
              <span className="sm:hidden">Contact</span>
            </a>

            <button
              onClick={() => setIsVisible(false)}
              className="text-blue-100 hover:text-white p-1"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
