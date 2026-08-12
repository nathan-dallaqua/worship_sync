import { useCallback } from 'react';

import { useStorage } from '@/hooks/useStorage';
import type { Song } from '@/types';

export function useSongs() {
  const storage = useStorage<Song>('@worship_sync/songs');

  const addSong = useCallback(
    async (song: Omit<Song, 'id' | 'createdAt'>) => {
      const newSong: Song = {
        ...song,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      return storage.add(newSong);
    },
    [storage],
  );

  return { ...storage, addSong };
}
