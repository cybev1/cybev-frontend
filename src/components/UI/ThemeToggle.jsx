// ============================================
// FILE: src/components/UI/ThemeToggle.jsx
// Theme Toggle Component - Light/Dark/System
// VERSION: 1.0
// ============================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Simple toggle button (light/dark only)
export function ThemeToggleSimple({ className = '' }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait">
        {resolvedTheme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5 text-yellow-500" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-orange-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Dropdown with light/dark/system options
export function ThemeToggleDropdown({ className = '' }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'light', label: 'Light', icon: Sun, iconColor: 'text-orange-500' },
    { value: 'dark', label: 'Dark', icon: Moon, iconColor: 'text-indigo-500' },
    { value: 'system', label: 'System', icon: Monitor, iconColor: 'text-gray-500' }
  ];

  const currentOption = options.find(o => o.value === theme) || options[2];

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

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <currentOption.icon className={`w-4 h-4 ${currentOption.iconColor}`} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentOption.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  theme === option.value ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                }`}
              >
                <option.icon className={`w-4 h-4 ${option.iconColor}`} />
                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
                {theme === option.value && (
                  <Check className="w-4 h-4 text-purple-600" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Settings page version with full descriptions
export function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const options = [
    { 
      value: 'light', 
      label: 'Light', 
      description: 'Always use light mode',
      icon: Sun, 
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    { 
      value: 'dark', 
      label: 'Dark', 
      description: 'Always use dark mode',
      icon: Moon, 
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-100'
    },
    { 
      value: 'system', 
      label: 'System', 
      description: 'Match your device settings',
      icon: Monitor, 
      iconColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    }
  ];

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
            theme === option.value
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl ${option.bgColor} dark:bg-opacity-20 flex items-center justify-center`}>
            <option.icon className={`w-6 h-6 ${option.iconColor}`} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              {option.label}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {option.description}
            </p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            theme === option.value
              ? 'border-purple-500 bg-purple-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}>
            {theme === option.value && (
              <Check className="w-3 h-3 text-white" />
            )}
          </div>
        </button>
      ))}
      
      {theme === 'system' && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
          Currently using: <span className="font-medium">{resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span> mode
        </p>
      )}
    </div>
  );
}

// Export default as simple toggle
export default ThemeToggleSimple;
