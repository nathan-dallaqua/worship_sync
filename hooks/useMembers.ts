import { useCallback } from 'react';

import { useStorage } from '@/hooks/useStorage';
import type { Member } from '@/types';

export function useMembers() {
  const storage = useStorage<Member>('@worship_sync/members');

  const addMember = useCallback(
    async (member: Omit<Member, 'id'>) => {
      const newMember: Member = {
        ...member,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      };
      return storage.add(newMember);
    },
    [storage],
  );

  return { ...storage, addMember };
}
