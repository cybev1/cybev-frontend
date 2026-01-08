// ============================================
// FILE: src/contexts/I18nContext.jsx
// Internationalization Context
// VERSION: 1.0
// ============================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io';

// Default translations (English)
const defaultTranslations = {
  'common.welcome': 'Welcome',
  'common.hello': 'Hello',
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.search': 'Search',
  'auth.login': 'Log In',
  'auth.signup': 'Sign Up',
  'auth.logout': 'Log Out',
  'nav.home': 'Home',
  'nav.feed': 'Feed',
  'nav.explore': 'Explore',
  'nav.notifications': 'Notifications',
  'nav.messages': 'Messages',
  'nav.profile': 'Profile',
  'nav.settings': 'Settings',
  'post.like': 'Like',
  'post.comment': 'Comment',
  'post.share': 'Share',
  'profile.followers': 'Followers',
  'profile.following': 'Following',
  'profile.follow': 'Follow',
  'profile.unfollow': 'Unfollow'
};

// Supported locales
const supportedLocales = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
];

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState('en');
  const [translations, setTranslations] = useState(defaultTranslations);
  const [loading, setLoading] = useState(true);
  const [isRTL, setIsRTL] = useState(false);

  // Load translations for a locale
  const loadTranslations = useCallback(async (newLocale) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/i18n/translations/${newLocale}`);
      if (res.data.ok) {
        setTranslations({ ...defaultTranslations, ...res.data.translations });
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fall back to default
      setTranslations(defaultTranslations);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set locale
  const setLocale = useCallback(async (newLocale) => {
    if (!supportedLocales.find(l => l.code === newLocale)) {
      console.warn(`Locale ${newLocale} is not supported`);
      return;
    }

    setLocaleState(newLocale);
    setIsRTL(newLocale === 'ar'); // Arabic is RTL
    
    // Save to localStorage
    localStorage.setItem('cybev-locale', newLocale);
    
    // Update HTML dir attribute for RTL
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;

    // Load translations
    await loadTranslations(newLocale);

    // Save to server if logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.put(
          `${API_URL}/api/i18n/preference`,
          { language: newLocale },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Failed to save language preference:', error);
      }
    }
  }, [loadTranslations]);

  // Translate function
  const t = useCallback((key, params = {}) => {
    let text = translations[key] || defaultTranslations[key] || key;
    
    // Replace parameters
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, value);
    });
    
    return text;
  }, [translations]);

  // Format number
  const formatNumber = useCallback((num) => {
    return new Intl.NumberFormat(locale).format(num);
  }, [locale]);

  // Format date
  const formatDate = useCallback((date, options = {}) => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(new Date(date));
  }, [locale]);

  // Format relative time
  const formatRelativeTime = useCallback((date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return t('time.now') || 'just now';
    if (minutes < 60) return t('time.minutesAgo', { n: minutes }) || `${minutes}m ago`;
    if (hours < 24) return t('time.hoursAgo', { n: hours }) || `${hours}h ago`;
    if (days < 7) return t('time.daysAgo', { n: days }) || `${days}d ago`;
    return formatDate(date, { month: 'short', day: 'numeric' });
  }, [t, formatDate]);

  // Initialize locale
  useEffect(() => {
    const init = async () => {
      // Check localStorage first
      const savedLocale = localStorage.getItem('cybev-locale');
      
      if (savedLocale && supportedLocales.find(l => l.code === savedLocale)) {
        await setLocale(savedLocale);
        return;
      }

      // Try to detect from browser
      const browserLocale = navigator.language?.split('-')[0];
      if (browserLocale && supportedLocales.find(l => l.code === browserLocale)) {
        await setLocale(browserLocale);
        return;
      }

      // Default to English
      await setLocale('en');
    };

    init();
  }, [setLocale]);

  const value = {
    locale,
    setLocale,
    t,
    translations,
    loading,
    isRTL,
    supportedLocales,
    formatNumber,
    formatDate,
    formatRelativeTime
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook to use i18n
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Simple t function for use outside of React
export function t(key, locale = 'en') {
  return defaultTranslations[key] || key;
}

export default I18nContext;
