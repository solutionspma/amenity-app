'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ] as const;

  const currentOption = themeOptions.find(option => option.value === theme) || themeOptions[2];
  const CurrentIcon = currentOption.icon;

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
        title={`Current theme: ${currentOption.label}`}
      >
        <CurrentIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
      </button>

      {/* Theme Selection Menu */}
      {showMenu && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="py-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value);
                      setShowMenu(false);
                    }}
                    className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <span className="flex-1">{option.label}</span>
                    {option.value === 'system' && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({actualTheme})
                      </span>
                    )}
                    {isSelected && (
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}