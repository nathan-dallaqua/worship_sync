import { router, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/worship/EmptyState';
import { ScheduleCard } from '@/components/worship/ScheduleCard';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSchedules } from '@/hooks/useSchedules';
import { useSongs } from '@/hooks/useSongs';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { upcomingSchedules, loading: sLoading } = useSchedules();
  const { data: songs, loading: songLoading } = useSongs();

  const nextSchedule = upcomingSchedules[0];
  const pendingCount = upcomingSchedules.length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textMuted }]}>Olá, bem-vindo</Text>
          <Text style={[styles.appName, { color: colors.text }]}>Worship Sync</Text>
        </View>
        <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>W</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{pendingCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Próximas escalas</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.secondary }]}>{songs.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Músicas</Text>
        </View>
      </View>

      {/* Próxima escala */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Próxima Escala</Text>
        {nextSchedule ? (
          <ScheduleCard
            schedule={nextSchedule}
            onPress={() => router.push(`/schedule/${nextSchedule.id}` as Href)}
          />
        ) : (
          <EmptyState
            icon="calendar-month"
            title="Nenhuma escala agendada"
            subtitle="As próximas escalas aparecerão aqui"
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  section: {
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
});
