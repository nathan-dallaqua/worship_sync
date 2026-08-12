import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export function useStorage<T>(key: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (e) {
      console.error(`Failed to load ${key}:`, e);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const save = useCallback(
    async (items: T[]) => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(items));
        setData(items);
      } catch (e) {
        console.error(`Failed to save ${key}:`, e);
      }
    },
    [key],
  );

  const add = useCallback(
    async (item: T) => {
      const updated = [...data, item];
      await save(updated);
      return item;
    },
    [data, save],
  );

  const update = useCallback(
    async (id: string, updates: Partial<T>) => {
      const updated = data.map((item: any) =>
        item.id === id ? { ...item, ...updates } : item,
      );
      await save(updated);
      return updated.find((item: any) => item.id === id);
    },
    [data, save],
  );

  const remove = useCallback(
    async (id: string) => {
      const updated = data.filter((item: any) => item.id !== id);
      await save(updated);
    },
    [data, save],
  );

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, load, save, add, update, remove };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
