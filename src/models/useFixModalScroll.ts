import { useState, useEffect } from 'react';

export default function useFixModalScroll() {
  const [isFixLayout, setIsFixLayout] = useState<boolean>(false);

  return {
    isFixLayout,
    fixLayout: () => setIsFixLayout(true),
    looseLayout: () => setIsFixLayout(false),
  };
}
