/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useEffect, useState } from 'react';

const LOCAL_STORAGE_PREFIX = 'chat-docs';

export function useLocalStorage<T>(_key: string, defaultValue: T): [T, (value: T) => void] {
  const key = `${LOCAL_STORAGE_PREFIX}-${_key}`;
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }
    setValue(item ? JSON.parse(item) : defaultValue);
    function handler(e: StorageEvent) {
      if (e.key !== key) return;
      const lsi = localStorage.getItem(key);
      setValue(JSON.parse(lsi ?? ''));
    }
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('storage', handler);
    };
  }, []);

  const setValueWrap = (value: T) => {
    try {
      setValue(value);
      localStorage.setItem(key, JSON.stringify(value));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', { key }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return [value, setValueWrap];
}
