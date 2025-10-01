import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

  if (diffInHours < 24) {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } else if (diffInHours < 168) { // 7 days
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }
}

export function getConfidenceColor(confidence: 'low' | 'medium' | 'high'): string {
  switch (confidence) {
    case 'high':
      return 'text-legal-confidence-high bg-legal-confidence-high/10 border-legal-confidence-high/20';
    case 'medium':
      return 'text-legal-confidence-medium bg-legal-confidence-medium/10 border-legal-confidence-medium/20';
    case 'low':
      return 'text-legal-confidence-low bg-legal-confidence-low/10 border-legal-confidence-low/20';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
}

export function getConfidenceText(confidence: 'low' | 'medium' | 'high'): string {
  switch (confidence) {
    case 'high':
      return 'Fiabilité élevée';
    case 'medium':
      return 'Fiabilité moyenne';
    case 'low':
      return 'Fiabilité faible';
    default:
      return 'Non évalué';
  }
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}