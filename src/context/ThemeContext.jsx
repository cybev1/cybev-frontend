// ============================================
// FILE: src/context/ThemeContext.jsx
// Theme Context Provider with Dark Mode Support
// VERSION: 1.0
// ============================================

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('system'); // 'light', 'dark', 'system'
  const [resolvedTheme, setResolvedTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = () => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Apply theme to document
  const applyTheme = (theme) => {
    const root = document.documentElement;
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    
    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', resolved === 'dark' ? '#1a1a1a' : '#ffffff');
    }
    
    setResolvedTheme(resolved);
  };

  // Load theme from localStorage and user preferences
  useEffect(() => {
    setMounted(true);
    
    // Check localStorage first
    const savedTheme = localStorage.getItem('cybev_theme');
    
    // Check user preferences from API
    const user = localStorage.getItem('user');
    let userTheme = null;
    if (user) {
      try {
        const parsed = JSON.parse(user);
        userTheme = parsed.preferences?.theme;
      } catch (e) {}
    }
    
    // Priority: localStorage > user preference > system
    const initialTheme = savedTheme || userTheme || 'system';
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Update theme
  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('cybev_theme', newTheme);
    applyTheme(newTheme);
    
    // Optionally sync to backend
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('cybev_token');
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.cybev.io'}/api/user/preferences`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ theme: newTheme })
        });
      }
    } catch (e) {
      // Silently fail - local storage is the source of truth
      console.log('Could not sync theme preference');
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Prevent flash on initial load
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'system', resolvedTheme: 'light', setTheme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
