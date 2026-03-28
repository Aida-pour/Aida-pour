import { useState } from 'react';
export function useLanguage() {
  const [language, setLanguage] = useState<'en' | 'fa'>('en');
  return { language, setLanguage, isRTL: language === 'fa' };
}
