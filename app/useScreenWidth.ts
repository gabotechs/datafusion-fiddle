import { useState, useEffect } from 'react';

export function useScreenWidth() {
  const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const [screenWidth, setScreenWidth] = useState(innerWidth);

  useEffect(() => {
    function handleResize () {
      setScreenWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenWidth;
}
