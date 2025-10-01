'use client';

import { ExternalLink, Book, Calendar } from 'lucide-react';
import { LegalSource } from '@/types';

interface LegalReferenceProps {
  source: LegalSource;
}

export default function LegalReference({ source }: LegalReferenceProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 p-1 bg-gray-100 rounded">
          <Book className="h-4 w-4 text-gray-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                {source.title}
              </h4>

              <div className="flex items-center space-x-3 text-sm text-gray-700 mb-2">
                <span className="font-mono font-medium">
                  {source.article}
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{source.year}</span>
                </span>
                <span className="px-2 py-1 bg-gray-200 rounded-full text-xs font-medium">
                  {source.country.toUpperCase()}
                </span>
              </div>

              {source.excerpt && (
                <blockquote className="text-sm text-gray-800 italic border-l-2 border-gray-300 pl-3 mb-3">
                  "{source.excerpt}"
                </blockquote>
              )}
            </div>

            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 ml-2 p-1 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
                title="Voir la source complète"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              Source officielle vérifiée
            </div>
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 hover:text-gray-800 underline"
              >
                Consulter le texte complet →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}