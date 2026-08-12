import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { EmptyState } from '@/components/worship/EmptyState';
import { ScheduleCard } from '@/components/worship/ScheduleCard';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSchedules } from '@/hooks/useSchedules';

type Filter = 'upcoming' | 'past';

export default function SchedulesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { upcomingSchedules, pastSchedules, data } = useSchedules();
  const [filter, setFilter] = useState<Filter>('upcoming');

  const shown = filter === 'upcoming' ? upcomingSchedules : pastSchedules;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Escalas</Text>
        <Pressable
          onPress={() => router.push('/admin/create-schedule' as Href)}
          style={({ pressed }) => [
            styles.addBtn,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.8 },
          ]}>
          <IconSymbol name="plus.circle.fill" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Nova</Text>
        </Pressable>
      </View>

      {/* Filter */}
      <View style={styles.filterRow}>
        {(['upcoming', 'past'] as Filter[]).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterBtn,
              {
                backgroundColor: filter === f ? colors.primary : colors.surface,
                borderColor: filter === f ? colors.primary : colors.border,
              },
            ]}>
            <Text
              style={[
                styles.filterBtnText,
                { color: filter === f ? '#fff' : colors.textSecondary },
              ]}>
              {f === 'upcoming' ? 'Futuras' : 'Passadas'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}>
        {shown.length === 0 ? (
          <EmptyState
            icon="calendar-month"
            title="Nenhuma escala"
            subtitle={filter === 'upcoming' ? 'Nenhuma escala futura agendada' : 'Nenhuma escala passada'}
          />
        ) : (
          shown.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onPress={() => router.push(`/schedule/${schedule.id}` as Href)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
});
