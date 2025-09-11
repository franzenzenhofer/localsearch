import { useState, useEffect } from 'react';

export function useDarkMode(): [boolean, () => void] {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggle = () => setDarkMode((prev: boolean) => !prev);

  return [darkMode, toggle];
}