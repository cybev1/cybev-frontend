// ============================================
// FILE: src/components/LanguageSelector.jsx
// Language Selector Component
// VERSION: 1.0
// ============================================

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function LanguageSelector({ variant = 'default', showFlag = true }) {
  const { locale, setLocale, supportedLocales, loading } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLocale = supportedLocales.find(l => l.code === locale) || supportedLocales[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (code) => {
    await setLocale(code);
    setIsOpen(false);
  };

  if (variant === 'minimal') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          disabled={loading}
        >
          <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">
            {locale}
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 overflow-hidden z-50">
            <div className="max-h-64 overflow-y-auto">
              {supportedLocales.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                    lang.code === locale ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {showFlag && <span className="text-lg">{lang.flag}</span>}
                    <span className="text-sm text-gray-900 dark:text-white">{lang.nativeName}</span>
                  </div>
                  {lang.code === locale && (
                    <Check className="w-4 h-4 text-purple-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        disabled={loading}
      >
        {showFlag && <span className="text-lg">{currentLocale.flag}</span>}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentLocale.nativeName}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 overflow-hidden z-50">
          <div className="p-2 border-b dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
              Select Language
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {supportedLocales.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                  lang.code === locale ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {lang.nativeName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {lang.name}
                    </div>
                  </div>
                </div>
                {lang.code === locale && (
                  <Check className="w-5 h-5 text-purple-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline language selector for settings page
export function LanguageSelectorInline() {
  const { locale, setLocale, supportedLocales, loading } = useI18n();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {supportedLocales.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          disabled={loading}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${
            lang.code === locale
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <span className="text-3xl">{lang.flag}</span>
          <div className="text-center">
            <div className={`text-sm font-medium ${
              lang.code === locale 
                ? 'text-purple-700 dark:text-purple-300' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {lang.nativeName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {lang.name}
            </div>
          </div>
          {lang.code === locale && (
            <Check className="w-5 h-5 text-purple-600 absolute top-2 right-2" />
          )}
        </button>
      ))}
    </div>
  );
}
