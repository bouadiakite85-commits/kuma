/**
 * Répertoire Mondial des Indicatifs Téléphoniques Internationaux
 * Compatible KUMA International (Afrique, Europe, Amériques, Asie, Océanie, Moyen-Orient)
 */

export interface CountryInfo {
  code: string;
  name: string;
  nameEn: string;
  flag: string;
  region: 'Afrique' | 'Europe' | 'Amériques' | 'Asie' | 'Moyen-Orient' | 'Océanie';
  example: string;
  formatRegex?: string;
}

export const ALL_INTERNATIONAL_COUNTRIES: CountryInfo[] = [
  // Afrique de l'Ouest & Sahel (Priorité KUMA)
  { code: '+223', name: 'Mali', nameEn: 'Mali', flag: '🇲🇱', region: 'Afrique', example: '76 12 34 56' },
  { code: '+221', name: 'Sénégal', nameEn: 'Senegal', flag: '🇸🇳', region: 'Afrique', example: '77 123 45 67' },
  { code: '+225', name: 'Côte d\'Ivoire', nameEn: 'Ivory Coast', flag: '🇨🇮', region: 'Afrique', example: '07 08 09 10 11' },
  { code: '+224', name: 'Guinée', nameEn: 'Guinea', flag: '🇬🇳', region: 'Afrique', example: '620 12 34 56' },
  { code: '+226', name: 'Burkina Faso', nameEn: 'Burkina Faso', flag: '🇧🇫', region: 'Afrique', example: '70 12 34 56' },
  { code: '+227', name: 'Niger', nameEn: 'Niger', flag: '🇳🇪', region: 'Afrique', example: '90 12 34 56' },
  { code: '+228', name: 'Togo', nameEn: 'Togo', flag: '🇹🇬', region: 'Afrique', example: '90 12 34 56' },
  { code: '+229', name: 'Bénin', nameEn: 'Benin', flag: '🇧🇯', region: 'Afrique', example: '97 12 34 56' },
  { code: '+234', name: 'Nigéria', nameEn: 'Nigeria', flag: '🇳🇬', region: 'Afrique', example: '802 123 4567' },
  { code: '+233', name: 'Ghana', nameEn: 'Ghana', flag: '🇬🇭', region: 'Afrique', example: '24 123 4567' },
  { code: '+220', name: 'Gambie', nameEn: 'Gambia', flag: '🇬🇲', region: 'Afrique', example: '701 2345' },
  { code: '+245', name: 'Guinée-Bissau', nameEn: 'Guinea-Bissau', flag: '🇬🇼', region: 'Afrique', example: '955 12 34 56' },
  { code: '+238', name: 'Cap-Vert', nameEn: 'Cape Verde', flag: '🇨🇻', region: 'Afrique', example: '991 23 45' },
  { code: '+222', name: 'Mauritanie', nameEn: 'Mauritania', flag: '🇲🇷', region: 'Afrique', example: '45 12 34 56' },
  { code: '+231', name: 'Libéria', nameEn: 'Liberia', flag: '🇱🇷', region: 'Afrique', example: '77 123 4567' },
  { code: '+232', name: 'Sierra Leone', nameEn: 'Sierra Leone', flag: '🇸🇱', region: 'Afrique', example: '76 123456' },

  // Afrique Centrale & Autres
  { code: '+237', name: 'Cameroun', nameEn: 'Cameroon', flag: '🇨🇲', region: 'Afrique', example: '6 99 12 34 56' },
  { code: '+242', name: 'Congo-Brazzaville', nameEn: 'Congo', flag: '🇨🇬', region: 'Afrique', example: '06 123 4567' },
  { code: '+243', name: 'RD Congo (Kinshasa)', nameEn: 'DR Congo', flag: '🇨🇩', region: 'Afrique', example: '81 234 5678' },
  { code: '+241', name: 'Gabon', nameEn: 'Gabon', flag: '🇬🇦', region: 'Afrique', example: '07 12 34 56' },
  { code: '+235', name: 'Tchad', nameEn: 'Chad', flag: '🇹🇩', region: 'Afrique', example: '66 12 34 56' },
  { code: '+236', name: 'Centrafrique', nameEn: 'Central African Republic', flag: '🇨🇫', region: 'Afrique', example: '70 12 34 56' },
  { code: '+240', name: 'Guinée Équatoriale', nameEn: 'Equatorial Guinea', flag: '🇬🇶', region: 'Afrique', example: '222 12 34 56' },
  { code: '+250', name: 'Rwanda', nameEn: 'Rwanda', flag: '🇷🇼', region: 'Afrique', example: '788 123 456' },
  { code: '+257', name: 'Burundi', nameEn: 'Burundi', flag: '🇧🇮', region: 'Afrique', example: '79 12 34 56' },
  { code: '+254', name: 'Kenya', nameEn: 'Kenya', flag: '🇰🇪', region: 'Afrique', example: '712 345678' },
  { code: '+256', name: 'Ouganda', nameEn: 'Uganda', flag: '🇺🇬', region: 'Afrique', example: '772 123456' },
  { code: '+255', name: 'Tanzanie', nameEn: 'Tanzania', flag: '🇹🇿', region: 'Afrique', example: '712 345 678' },
  { code: '+251', name: 'Éthiopie', nameEn: 'Ethiopia', flag: '🇪🇹', region: 'Afrique', example: '91 123 4567' },
  { code: '+261', name: 'Madagascar', nameEn: 'Madagascar', flag: '🇲🇬', region: 'Afrique', example: '32 12 345 67' },
  { code: '+27', name: 'Afrique du Sud', nameEn: 'South Africa', flag: '🇿🇦', region: 'Afrique', example: '82 123 4567' },

  // Afrique du Nord
  { code: '+212', name: 'Maroc', nameEn: 'Morocco', flag: '🇲🇦', region: 'Afrique', example: '6 61 23 45 67' },
  { code: '+213', name: 'Algérie', nameEn: 'Algeria', flag: '🇩🇿', region: 'Afrique', example: '5 50 12 34 56' },
  { code: '+216', name: 'Tunisie', nameEn: 'Tunisia', flag: '🇹🇳', region: 'Afrique', example: '20 123 456' },
  { code: '+20', name: 'Égypte', nameEn: 'Egypt', flag: '🇪🇬', region: 'Afrique', example: '10 1234 5678' },
  { code: '+218', name: 'Libye', nameEn: 'Libya', flag: '🇱🇾', region: 'Afrique', example: '91 234 5678' },

  // Europe (Diaspora & International)
  { code: '+33', name: 'France', nameEn: 'France', flag: '🇫🇷', region: 'Europe', example: '6 12 34 56 78' },
  { code: '+32', name: 'Belgique', nameEn: 'Belgium', flag: '🇧🇪', region: 'Europe', example: '470 12 34 56' },
  { code: '+41', name: 'Suisse', nameEn: 'Switzerland', flag: '🇨🇭', region: 'Europe', example: '78 123 45 67' },
  { code: '+49', name: 'Allemagne', nameEn: 'Germany', flag: '🇩🇪', region: 'Europe', example: '151 23456789' },
  { code: '+44', name: 'Royaume-Uni', nameEn: 'United Kingdom', flag: '🇬🇧', region: 'Europe', example: '7700 900123' },
  { code: '+34', name: 'Espagne', nameEn: 'Spain', flag: '🇪🇸', region: 'Europe', example: '612 34 56 78' },
  { code: '+39', name: 'Italie', nameEn: 'Italy', flag: '🇮🇹', region: 'Europe', example: '312 345 6789' },
  { code: '+351', name: 'Portugal', nameEn: 'Portugal', flag: '🇵🇹', region: 'Europe', example: '912 345 678' },
  { code: '+31', name: 'Pays-Bas', nameEn: 'Netherlands', flag: '🇳🇱', region: 'Europe', example: '6 12345678' },
  { code: '+46', name: 'Suède', nameEn: 'Sweden', flag: '🇸🇪', region: 'Europe', example: '70 123 45 67' },
  { code: '+47', name: 'Norvège', nameEn: 'Norway', flag: '🇳🇴', region: 'Europe', example: '412 34 567' },
  { code: '+45', name: 'Danemark', nameEn: 'Denmark', flag: '🇩🇰', region: 'Europe', example: '20 12 34 56' },
  { code: '+352', name: 'Luxembourg', nameEn: 'Luxembourg', flag: '🇱🇺', region: 'Europe', example: '621 123 456' },
  { code: '+43', name: 'Autriche', nameEn: 'Austria', flag: '🇦🇹', region: 'Europe', example: '664 1234567' },
  { code: '+7', name: 'Russie', nameEn: 'Russia', flag: '🇷🇺', region: 'Europe', example: '912 345-67-89' },
  { code: '+380', name: 'Ukraine', nameEn: 'Ukraine', flag: '🇺🇦', region: 'Europe', example: '50 123 4567' },
  { code: '+90', name: 'Turquie', nameEn: 'Turkey', flag: '🇹🇷', region: 'Europe', example: '532 123 4567' },

  // Amériques (USA, Canada, Caraïbes, Amérique Latine)
  { code: '+1', name: 'États-Unis', nameEn: 'United States', flag: '🇺🇸', region: 'Amériques', example: '202 555 0199' },
  { code: '+1', name: 'Canada', nameEn: 'Canada', flag: '🇨🇦', region: 'Amériques', example: '514 555 0142' },
  { code: '+55', name: 'Brésil', nameEn: 'Brazil', flag: '🇧🇷', region: 'Amériques', example: '11 98765-4321' },
  { code: '+52', name: 'Mexique', nameEn: 'Mexico', flag: '🇲🇽', region: 'Amériques', example: '55 1234 5678' },
  { code: '+54', name: 'Argentine', nameEn: 'Argentina', flag: '🇦🇷', region: 'Amériques', example: '9 11 1234-5678' },
  { code: '+57', name: 'Colombie', nameEn: 'Colombia', flag: '🇨🇴', region: 'Amériques', example: '300 1234567' },
  { code: '+56', name: 'Chili', nameEn: 'Chile', flag: '🇨🇱', region: 'Amériques', example: '9 1234 5678' },
  { code: '+509', name: 'Haïti', nameEn: 'Haiti', flag: '🇭🇹', region: 'Amériques', example: '34 12 3456' },

  // Asie & Océanie
  { code: '+86', name: 'Chine', nameEn: 'China', flag: '🇨🇳', region: 'Asie', example: '138 0013 8000' },
  { code: '+91', name: 'Inde', nameEn: 'India', flag: '🇮🇳', region: 'Asie', example: '98765 43210' },
  { code: '+81', name: 'Japon', nameEn: 'Japan', flag: '🇯🇵', region: 'Asie', example: '90 1234 5678' },
  { code: '+82', name: 'Corée du Sud', nameEn: 'South Korea', flag: '🇰🇷', region: 'Asie', example: '10 1234 5678' },
  { code: '+84', name: 'Vietnam', nameEn: 'Vietnam', flag: '🇻🇳', region: 'Asie', example: '91 234 5678' },
  { code: '+62', name: 'Indonésie', nameEn: 'Indonesia', flag: '🇮🇩', region: 'Asie', example: '812 3456 789' },
  { code: '+60', name: 'Malaisie', nameEn: 'Malaysia', flag: '🇲🇾', region: 'Asie', example: '12 345 6789' },
  { code: '+65', name: 'Singapour', nameEn: 'Singapore', flag: '🇸🇬', region: 'Asie', example: '8123 4567' },
  { code: '+61', name: 'Australie', nameEn: 'Australia', flag: '🇦🇺', region: 'Océanie', example: '412 345 678' },

  // Moyen-Orient
  { code: '+971', name: 'Émirats Arabes Unis', nameEn: 'United Arab Emirates', flag: '🇦🇪', region: 'Moyen-Orient', example: '50 123 4567' },
  { code: '+966', name: 'Arabie Saoudite', nameEn: 'Saudi Arabia', flag: '🇸🇦', region: 'Moyen-Orient', example: '50 123 4567' },
  { code: '+974', name: 'Qatar', nameEn: 'Qatar', flag: '🇶🇦', region: 'Moyen-Orient', example: '3312 3456' },
  { code: '+965', name: 'Koweït', nameEn: 'Kuwait', flag: '🇰🇼', region: 'Moyen-Orient', example: '9123 4567' },
  { code: '+961', name: 'Liban', nameEn: 'Lebanon', flag: '🇱🇧', region: 'Moyen-Orient', example: '70 123 456' }
];

/**
 * Recherche et détection intelligente du pays à partir d'un numéro complet
 */
export function findCountryByPhone(phone: string): CountryInfo {
  if (!phone) return ALL_INTERNATIONAL_COUNTRIES[0];
  const cleaned = phone.replace(/\s+/g, '');
  
  // Try longest prefix match (+223, +225, etc.)
  const sorted = [...ALL_INTERNATIONAL_COUNTRIES].sort((a, b) => b.code.length - a.code.length);
  for (const c of sorted) {
    if (cleaned.startsWith(c.code) || cleaned.startsWith(c.code.replace('+', ''))) {
      return c;
    }
  }

  return ALL_INTERNATIONAL_COUNTRIES[0]; // Default Mali
}

/**
 * Formate un numéro international avec espacement lisible
 */
export function formatInternationalNumber(phone: string): string {
  if (!phone) return '';
  const trimmed = phone.trim();
  if (trimmed.startsWith('+')) {
    const parts = trimmed.split(' ');
    if (parts.length > 1) return trimmed;
    // Format spacing
    const country = findCountryByPhone(trimmed);
    const rest = trimmed.replace(country.code, '').trim();
    const spaced = rest.match(/.{1,2}/g)?.join(' ') || rest;
    return `${country.code} ${spaced}`;
  }
  return trimmed;
}
