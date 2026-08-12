import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Schedule } from '@/types';
import { StatusBadge } from '@/components/worship/StatusBadge';

type Props = {
  schedule: Schedule;
  statusForMember?: boolean | null;
  onPress?: () => void;
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const weekday = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()];
  return `${weekday}, ${day}/${month}/${year}`;
}

export function ScheduleCard({ schedule, statusForMember, onPress }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const confirmedCount = schedule.team.filter((t) => t.confirmed === true).length;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.cardShadow,
        },
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}>
      <View style={styles.header}>
        <View style={[styles.dateBadge, { backgroundColor: colors.primary + '12' }]}>
          <Text style={[styles.dateText, { color: colors.primary }]}>
            {formatDate(schedule.date)}
          </Text>
        </View>
        {statusForMember !== undefined && <StatusBadge confirmed={statusForMember} />}
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{schedule.title}</Text>

      <View style={styles.meta}>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          {schedule.songs.length} {schedule.songs.length === 1 ? 'música' : 'músicas'}
        </Text>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          {confirmedCount}/{schedule.team.length} confirmados
        </Text>
      </View>

      <View style={styles.songs}>
        {schedule.songs.slice(0, 3).map((s) => (
          <View key={s.songId} style={[styles.songChip, { backgroundColor: colors.surfaceSecondary }]}>
            <Text style={[styles.songChipText, { color: colors.textSecondary }]}>{s.songTitle}</Text>
          </View>
        ))}
        {schedule.songs.length > 3 && (
          <Text style={[styles.moreText, { color: colors.textMuted }]}>
            +{schedule.songs.length - 3} mais
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  metaText: {
    fontSize: 13,
  },
  songs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  songChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  songChipText: {
    fontSize: 12,
  },
  moreText: {
    fontSize: 12,
    alignSelf: 'center',
  },
});
