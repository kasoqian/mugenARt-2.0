import { useState } from 'react';

enum ELanguage {
  en = 'en',
  japan = 'japan',
}

export default function useLanguage() {
  const [language, setLanguage] = useState<keyof typeof ELanguage>('japan');

  return {
    language,
    setLanguage,
  };
}
