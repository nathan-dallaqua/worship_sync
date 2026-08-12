import { router, useLocalSearchParams, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { EmptyState } from '@/components/worship/EmptyState';
import { MemberChip } from '@/components/worship/MemberChip';
import { StatusBadge } from '@/components/worship/StatusBadge';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSchedules } from '@/hooks/useSchedules';
import type { Schedule } from '@/types';

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ];
  const weekday = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return `${weekday[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

export default function ScheduleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { data: schedules, confirmPresence } = useSchedules();

  const schedule = schedules.find((s) => s.id === id);

  if (!schedule) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <EmptyState icon="calendar-month" title="Escala não encontrada" subtitle="Esta escala não existe ou foi removida" />
        </View>
      </View>
    );
  }

  const memberId = 'current-user';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          Detalhes da Escala
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date & Title */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.dateBadge, { backgroundColor: colors.primary + '12' }]}>
            <Text style={[styles.dateText, { color: colors.primary }]}>
              {formatFullDate(schedule.date)}
            </Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{schedule.title}</Text>
          {schedule.description ? (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {schedule.description}
            </Text>
          ) : null}
          <Text style={[styles.leader, { color: colors.textMuted }]}>
            Líder: {schedule.leaderName}
          </Text>
        </View>

        {/* Team */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Equipe</Text>
        </View>
        <View style={styles.teamList}>
          {schedule.team.map((member) => (
            <MemberChip
              key={member.memberId}
              name={member.memberName}
              role={member.role}
              confirmed={member.confirmed}
            />
          ))}
        </View>

        {/* Songs */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Repertório</Text>
        </View>
        <View style={styles.songsList}>
          {schedule.songs.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Nenhuma música adicionada
            </Text>
          ) : (
            schedule.songs.map((song, idx) => (
              <Pressable
                key={song.songId}
                style={({ pressed }) => [
                  styles.songItem,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => router.push(`/song/${song.songId}` as Href)}>
                <View style={[styles.songIndex, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.songIndexText, { color: colors.primary }]}>{idx + 1}</Text>
                </View>
                <View style={styles.songInfo}>
                  <Text style={[styles.songTitle, { color: colors.text }]}>{song.songTitle}</Text>
                  {song.key ? (
                    <Text style={[styles.songKey, { color: colors.textMuted }]}>Tom: {song.key}</Text>
                  ) : null}
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.textMuted} />
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      {/* Confirm Button for members */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Pressable
          style={({ pressed }) => [
            styles.confirmBtn,
            { backgroundColor: Colors.light.success },
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => confirmPresence(schedule.id, memberId, true)}>
          <IconSymbol name="checkmark.circle.fill" size={20} color="#fff" />
          <Text style={styles.confirmBtnText}>Confirmar Presença</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.rejectBtn,
            { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => confirmPresence(schedule.id, memberId, false)}>
          <IconSymbol name="xmark.circle.fill" size={20} color={Colors.light.danger} />
          <Text style={[styles.rejectBtnText, { color: Colors.light.danger }]}>Recusar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  section: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  dateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  leader: {
    fontSize: 13,
    fontWeight: '500',
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  teamList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  songsList: {
    gap: Spacing.sm,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  songIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  songIndexText: {
    fontSize: 14,
    fontWeight: '700',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  songKey: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    padding: Spacing.lg,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    paddingBottom: 34,
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  rejectBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
