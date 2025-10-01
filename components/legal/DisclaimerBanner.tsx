'use client';

import { AlertTriangle, ExternalLink } from 'lucide-react';
import { getLegalDisclaimerByCountry } from '@/lib/countries';

interface DisclaimerBannerProps {
  country: string;
  variant?: 'warning' | 'info';
  compact?: boolean;
}

export default function DisclaimerBanner({
  country,
  variant = 'warning',
  compact = false
}: DisclaimerBannerProps) {
  const disclaimer = getLegalDisclaimerByCountry(country);

  const bgColor = variant === 'warning' ? 'bg-gray-50' : 'bg-gray-50';
  const borderColor = variant === 'warning' ? 'border-gray-200' : 'border-gray-200';
  const iconColor = variant === 'warning' ? 'text-gray-600' : 'text-gray-600';
  const titleColor = variant === 'warning' ? 'text-gray-800' : 'text-gray-800';
  const textColor = variant === 'warning' ? 'text-gray-700' : 'text-gray-700';
  const linkColor = variant === 'warning' ? 'text-gray-800 hover:text-gray-900' : 'text-gray-800 hover:text-gray-900';

  if (compact) {
    return (
      <div className={`${bgColor} ${borderColor} border rounded-lg p-3 max-w-4xl mx-auto`}>
        <div className="flex items-center space-x-2 text-sm">
          <AlertTriangle className={`h-4 w-4 ${iconColor} flex-shrink-0`} />
          <div className={`${textColor} flex-1`}>
            <span>{disclaimer.text} </span>
            <a
              href={disclaimer.consultLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkColor} underline font-medium inline-flex items-center space-x-1 hover:space-x-2 transition-all`}
            >
              <span>{disclaimer.consultText}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-6 max-w-2xl mx-auto`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <AlertTriangle className={`h-6 w-6 ${iconColor}`} />
        </div>

        <div className="flex-1">
          <h3 className={`text-base font-semibold ${titleColor} mb-2`}>
            Avertissement Important
          </h3>

          <div className={`${textColor} space-y-3`}>
            <p className="text-sm leading-relaxed">
              Cette plateforme fournit des <strong>informations générales</strong> sur la législation
              et ne constitue pas un conseil juridique personnalisé. Les informations présentées
              peuvent ne pas être exhaustives ou à jour.
            </p>

            <p className="text-sm leading-relaxed">
              Pour toute situation juridique spécifique, il est fortement recommandé de consulter
              un professionnel du droit qualifié.
            </p>

            <div className="pt-2 border-t border-gray-200">
              <a
                href={disclaimer.consultLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkColor} inline-flex items-center space-x-2 font-medium underline hover:no-underline transition-all`}
              >
                <span>{disclaimer.consultText}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}