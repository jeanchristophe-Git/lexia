'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { COUNTRIES } from '@/lib/countries';

export default function CountrySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCountry, setSelectedCountry } = useChatStore();

  const handleSelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-sm font-medium text-black transition-colors min-w-[160px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <span className="text-base">{selectedCountry.flag}</span>
          <span>{selectedCountry.name}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.1 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden"
            >
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleSelect(country)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 text-sm text-left transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{country.flag}</span>
                    <span className="text-black">{country.name}</span>
                  </div>

                  {selectedCountry.code === country.code && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}