import { Country } from '@/types';

export const COUNTRIES: Country[] = [
  {
    code: 'ci',
    name: 'Côte d\'Ivoire',
    flag: '🇨🇮'
  },
  {
    code: 'cm',
    name: 'Cameroun',
    flag: '🇨🇲'
  },
  {
    code: 'tg',
    name: 'Togo',
    flag: '🇹🇬'
  }
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Côte d'Ivoire par défaut

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(country => country.code === code);
}

export function getPlaceholderByCountry(countryCode: string): string {
  switch (countryCode) {
    case 'ci':
      return 'Posez votre question sur le droit ivoirien...';
    case 'cm':
      return 'Posez votre question sur le droit camerounais...';
    case 'tg':
      return 'Posez votre question sur le droit togolais...';
    default:
      return 'Posez votre question juridique...';
  }
}

export function getLegalDisclaimerByCountry(countryCode: string): {
  text: string;
  consultLink: string;
  consultText: string;
} {
  switch (countryCode) {
    case 'ci':
      return {
        text: 'Information générale sur le droit ivoirien, pas un conseil juridique.',
        consultLink: 'https://barreau-ci.org',
        consultText: 'Consultez un avocat inscrit au Barreau de Côte d\'Ivoire'
      };
    case 'cm':
      return {
        text: 'Information générale sur le droit camerounais, pas un conseil juridique.',
        consultLink: 'https://barreau-cameroun.org',
        consultText: 'Consultez un avocat inscrit au Barreau du Cameroun'
      };
    case 'tg':
      return {
        text: 'Information générale sur le droit togolais, pas un conseil juridique.',
        consultLink: 'https://barreau-togo.org',
        consultText: 'Consultez un avocat inscrit au Barreau du Togo'
      };
    default:
      return {
        text: 'Information générale, pas un conseil juridique.',
        consultLink: '#',
        consultText: 'Consultez un avocat qualifié'
      };
  }
}