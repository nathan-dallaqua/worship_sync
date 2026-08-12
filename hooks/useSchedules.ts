import { useCallback, useMemo } from 'react';

import { useStorage } from '@/hooks/useStorage';
import type { Schedule, ScheduleStatus, ScheduleTeamMember } from '@/types';

export function useSchedules() {
  const storage = useStorage<Schedule>('@worship_sync/schedules');

  const addSchedule = useCallback(
    async (schedule: Omit<Schedule, 'id' | 'createdAt'>) => {
      const newSchedule: Schedule = {
        ...schedule,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      return storage.add(newSchedule);
    },
    [storage],
  );

  const updateScheduleStatus = useCallback(
    async (id: string, status: ScheduleStatus) => {
      return storage.update(id, { status } as Partial<Schedule>);
    },
    [storage],
  );

  const confirmPresence = useCallback(
    async (scheduleId: string, memberId: string, confirmed: boolean) => {
      const schedule = storage.data.find((s) => s.id === scheduleId);
      if (!schedule) return;

      const updatedTeam = schedule.team.map((t) =>
        t.memberId === memberId ? { ...t, confirmed } : t,
      );
      return storage.update(scheduleId, { team: updatedTeam });
    },
    [storage],
  );

  const upcomingSchedules = useMemo(() => {
    const now = new Date();
    return storage.data
      .filter(
        (s) =>
          new Date(s.date) >= now &&
          s.status !== 'cancelled' &&
          s.status !== 'completed',
      )
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
  }, [storage.data]);

  const pastSchedules = useMemo(() => {
    const now = new Date();
    return storage.data
      .filter(
        (s) => new Date(s.date) < now || s.status === 'completed',
      )
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
  }, [storage.data]);

  return {
    ...storage,
    addSchedule,
    updateScheduleStatus,
    confirmPresence,
    upcomingSchedules,
    pastSchedules,
  };
}
