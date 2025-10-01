'use client';

import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { getConfidenceColor, getConfidenceText } from '@/lib/utils';

interface ConfidenceLevelProps {
  confidence: 'low' | 'medium' | 'high';
  showText?: boolean;
  size?: 'sm' | 'md';
}

export default function ConfidenceLevel({
  confidence,
  showText = true,
  size = 'sm'
}: ConfidenceLevelProps) {
  const getIcon = () => {
    const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

    switch (confidence) {
      case 'high':
        return <CheckCircle className={iconSize} />;
      case 'medium':
        return <AlertCircle className={iconSize} />;
      case 'low':
        return <XCircle className={iconSize} />;
      default:
        return <AlertCircle className={iconSize} />;
    }
  };

  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const padding = size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5';

  return (
    <div
      className={`inline-flex items-center space-x-1 ${padding} rounded-full border ${textSize} font-medium ${getConfidenceColor(confidence)}`}
    >
      {getIcon()}
      {showText && (
        <span>{getConfidenceText(confidence)}</span>
      )}
    </div>
  );
}