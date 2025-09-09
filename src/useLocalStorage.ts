import { useState, useRef, useCallback, Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T, overWriteValue?: T, debounceMs: number = 200) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (overWriteValue) {
      window.localStorage.setItem(key, JSON.stringify(initialValue));
      return overWriteValue
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const timeoutRef = useRef<number>(null);

  const setValue: Dispatch<SetStateAction<T>> = useCallback((value) => {
    try {
      setStoredValue(value);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setStoredValue(prev => {
          window.localStorage.setItem(key, JSON.stringify(prev));
          return prev
        })
      }, debounceMs);
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue, debounceMs]);

  return [storedValue, setValue] as const;
}