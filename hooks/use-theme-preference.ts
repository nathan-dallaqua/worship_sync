import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = '@worship_sync/theme';

// Module-level cache + listeners keep every hook instance in sync.
let cached: ThemePreference = 'system';
let loaded = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

async function load() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    cached =
      stored === 'light' || stored === 'dark' || stored === 'system'
        ? stored
        : 'system';
  } catch (e) {
    console.error('Failed to load theme preference:', e);
  } finally {
    loaded = true;
    notify();
  }
}

export function useThemePreference() {
  const [preference, setPreference] = useState<ThemePreference>(cached);

  useEffect(() => {
    if (!loaded) load();
    const listener = () => setPreference(cached);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setThemePreference = useCallback(async (next: ThemePreference) => {
    cached = next;
    setPreference(next);
    notify();
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      console.error('Failed to save theme preference:', e);
    }
  }, []);

  return { preference, setThemePreference };
}
