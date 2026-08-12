import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

// Simple event bus to sync data across hook instances
const listeners = new Map<string, Set<() => void>>();

function subscribe(key: string, fn: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(fn);
  return () => {
    listeners.get(key)?.delete(fn);
  };
}

function notify(key: string) {
  listeners.get(key)?.forEach((fn) => fn());
}

export function useStorage<T>(key: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        setData([]);
      }
    } catch (e) {
      console.error(`Failed to load ${key}:`, e);
    } finally {
      setLoading(false);
    }
  }, [key]);

  // Listen for changes from other hook instances
  useEffect(() => {
    load();
    return subscribe(key, () => {
      load();
    });
  }, [load, key]);

  const save = useCallback(
    async (items: T[]) => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(items));
        setData(items);
        notify(key);
      } catch (e) {
        console.error(`Failed to save ${key}:`, e);
      }
    },
    [key],
  );

  const add = useCallback(
    async (item: T) => {
      const stored = await AsyncStorage.getItem(key);
      const current: T[] = stored ? JSON.parse(stored) : [];
      const updated = [...current, item];
      await save(updated);
      return item;
    },
    [key, save],
  );

  const update = useCallback(
    async (id: string, updates: Partial<T>) => {
      const stored = await AsyncStorage.getItem(key);
      const current: T[] = stored ? JSON.parse(stored) : [];
      const updated = current.map((item: any) =>
        item.id === id ? { ...item, ...updates } : item,
      );
      await save(updated);
      return updated.find((item: any) => item.id === id);
    },
    [key, save],
  );

  const remove = useCallback(
    async (id: string) => {
      const stored = await AsyncStorage.getItem(key);
      const current: T[] = stored ? JSON.parse(stored) : [];
      const updated = current.filter((item: any) => item.id !== id);
      await save(updated);
    },
    [key, save],
  );

  return { data, loading, load, save, add, update, remove };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
