import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Linking, Modal } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { EmptyState } from '@/components/worship/EmptyState';
import { MemberChip } from '@/components/worship/MemberChip';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSchedules } from '@/hooks/useSchedules';

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const weekday = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return `${weekday[date.getDay()]}, ${day}/${month}/${year}`;
}

export default function ScheduleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { data: schedules, confirmPresence, updateScheduleStatus, remove } = useSchedules();

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const selectedMember = schedule.team.find((t) => t.memberId === selectedMemberId);
  const canConfirm = selectedMemberId !== null;

  const handleConfirm = async (confirmed: boolean) => {
    if (!selectedMemberId) return;
    await confirmPresence(schedule.id, selectedMemberId, confirmed);
  };

  const handleDelete = async () => {
    await remove(schedule.id);
    router.back();
  };

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
        <Pressable onPress={() => setShowDeleteConfirm(true)} style={styles.backBtn}>
          <IconSymbol name="trash.fill" size={20} color={colors.danger || '#E17055'} />
        </Pressable>
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
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            Toque no seu nome para selecionar
          </Text>
        </View>
        <View style={styles.teamList}>
          {schedule.team.map((member) => (
            <MemberChip
              key={member.memberId}
              name={member.memberName}
              role={member.role}
              confirmed={member.confirmed}
              selected={selectedMemberId === member.memberId}
              onPress={() =>
                setSelectedMemberId(
                  selectedMemberId === member.memberId ? null : member.memberId,
                )
              }
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
              <View
                key={song.songId}
                style={[styles.songItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.songIndex, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.songIndexText, { color: colors.primary }]}>{idx + 1}</Text>
                </View>
                <View style={styles.songInfo}>
                  <Text style={[styles.songTitle, { color: colors.text }]}>{song.songTitle}</Text>
                  <View style={styles.songMeta}>
                    {song.key ? (
                      <View style={[styles.keyChip, { backgroundColor: colors.primary + '12' }]}>
                        <Text style={[styles.keyChipText, { color: colors.primary }]}>Tom: {song.key}</Text>
                      </View>
                    ) : null}
                    {song.youtubeUrl && (
                      <Pressable onPress={() => Linking.openURL(song.youtubeUrl!)} style={styles.linkBtn}>
                        <IconSymbol name="play.circle.fill" size={16} color="#FF0000" />
                      </Pressable>
                    )}
                    {song.spotifyUrl && (
                      <Pressable onPress={() => Linking.openURL(song.spotifyUrl!)} style={styles.linkBtn}>
                        <IconSymbol name="music.note" size={16} color="#1DB954" />
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Confirm/Reject Footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {selectedMember ? (
          <>
            <Text style={[styles.footerLabel, { color: colors.textMuted }]} numberOfLines={1}>
              Confirmando como: {selectedMember.memberName}
            </Text>
            <View style={styles.footerBtns}>
              <Pressable
                style={({ pressed }) => [
                  styles.confirmBtn,
                  { backgroundColor: Colors.light.success },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => handleConfirm(true)}>
                <IconSymbol name="checkmark.circle.fill" size={18} color="#fff" />
                <Text style={styles.confirmBtnText}>Confirmar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.rejectBtn,
                  { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => handleConfirm(false)}>
                <IconSymbol name="xmark.circle.fill" size={18} color={Colors.light.danger} />
                <Text style={[styles.rejectBtnText, { color: Colors.light.danger }]}>Recusar</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Text style={[styles.footerHint, { color: colors.textMuted }]}>
            Selecione seu nome na lista acima para confirmar presença
          </Text>
        )}
      </View>

      {/* Delete confirmation modal */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade" onRequestClose={() => setShowDeleteConfirm(false)}>
        <View style={styles.confirmOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setShowDeleteConfirm(false)} />
          <View style={[styles.confirmCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="trash.fill" size={32} color={colors.danger || '#E17055'} />
            <Text style={[styles.confirmTitle, { color: colors.text }]}>Deletar escala</Text>
            <Text style={[styles.confirmMessage, { color: colors.textSecondary }]}>
              Tem certeza que deseja deletar "{schedule.title}"? Esta ação não pode ser desfeita.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable
                onPress={() => setShowDeleteConfirm(false)}
                style={[styles.confirmActionBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                <Text style={[styles.confirmActionText, { color: colors.text }]}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleDelete}
                style={[styles.confirmActionBtn, { backgroundColor: colors.danger || '#E17055' }]}>
                <Text style={[styles.confirmActionText, { color: '#fff' }]}>Deletar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { flex: 1, paddingTop: 100 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 54, paddingBottom: Spacing.md, paddingHorizontal: Spacing.md, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.lg, paddingBottom: 160 },
  section: {
    padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, marginBottom: Spacing.lg,
  },
  dateBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start', marginBottom: Spacing.sm,
  },
  dateText: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: Spacing.xs },
  description: { fontSize: 14, lineHeight: 20, marginBottom: Spacing.sm },
  leader: { fontSize: 13, fontWeight: '500' },
  sectionHeader: { marginBottom: Spacing.sm, marginTop: Spacing.xs },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  sectionHint: { fontSize: 12, marginTop: 2 },
  teamList: { gap: Spacing.sm, marginBottom: Spacing.lg },
  songsList: { gap: Spacing.sm },
  songItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, gap: Spacing.md,
  },
  songIndex: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  songIndexText: { fontSize: 14, fontWeight: '700' },
  songInfo: { flex: 1 },
  songTitle: { fontSize: 15, fontWeight: '600' },
  songMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 4 },
  keyChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.sm },
  keyChipText: { fontSize: 11, fontWeight: '700' },
  linkBtn: { padding: 2 },
  emptyText: { fontSize: 14, textAlign: 'center', padding: Spacing.lg },
  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.md, borderTopWidth: 1, paddingBottom: 34, gap: Spacing.sm,
  },
  footerLabel: { fontSize: 12, textAlign: 'center' },
  footerBtns: { flexDirection: 'row', gap: Spacing.md },
  footerHint: { fontSize: 13, textAlign: 'center', paddingVertical: Spacing.sm },
  confirmBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: BorderRadius.lg,
  },
  confirmBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  rejectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, paddingHorizontal: 20, borderRadius: BorderRadius.lg, borderWidth: 1,
  },
  rejectBtnText: { fontSize: 14, fontWeight: '700' },
  // Confirm modal
  confirmOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  confirmCard: {
    width: '100%', borderRadius: BorderRadius.xl, borderWidth: 1,
    padding: Spacing.lg, alignItems: 'center', gap: Spacing.sm,
  },
  confirmTitle: { fontSize: 17, fontWeight: '700', marginTop: Spacing.xs },
  confirmMessage: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  confirmActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, width: '100%' },
  confirmActionBtn: {
    flex: 1, paddingVertical: 12, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  confirmActionText: { fontSize: 15, fontWeight: '700' },
});
