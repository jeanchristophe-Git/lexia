'use client';

import { useChatStore } from '@/store/chatStore';

export default function Footer() {
  const { selectedCountry } = useChatStore();

  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="text-xs text-gray-500 text-center space-y-2">
          <p>
            Information générale sur le droit {selectedCountry.code === 'ci' ? 'ivoirien' : selectedCountry.code === 'cm' ? 'camerounais' : 'togolais'}.
            Consultez un avocat inscrit au barreau pour validation juridique.
          </p>
          <div className="flex items-center justify-center space-x-4 text-[10px] opacity-75">
            <span>© 2024 Assistant Juridique Africain</span>
            <span>•</span>
            <button className="hover:text-black transition-colors">
              Confidentialité
            </button>
            <span>•</span>
            <button className="hover:text-black transition-colors">
              À propos
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}