import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSchedules } from '@/hooks/useSchedules';
import { useSongs } from '@/hooks/useSongs';
import { useMembers } from '@/hooks/useMembers';
import type { MemberRole, ScheduleSong, ScheduleTeamMember } from '@/types';
import { ROLE_LABELS } from '@/types';

export default function CreateScheduleScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { addSchedule } = useSchedules();
  const { data: songs } = useSongs();
  const { data: members } = useMembers();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [leaderId, setLeaderId] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<ScheduleSong[]>([]);
  const [team, setTeam] = useState<ScheduleTeamMember[]>([]);

  const toggleSong = (songId: string, songTitle: string) => {
    setSelectedSongs((prev) =>
      prev.some((s) => s.songId === songId)
        ? prev.filter((s) => s.songId !== songId)
        : [...prev, { songId, songTitle }],
    );
  };

  const toggleMember = (memberId: string, memberName: string) => {
    if (team.some((t) => t.memberId === memberId)) {
      setTeam((prev) => prev.filter((t) => t.memberId !== memberId));
    } else {
      const member = members.find((m) => m.id === memberId);
      const role: MemberRole = member?.roles[0] || 'vocal';
      setTeam((prev) => [...prev, { memberId, memberName, role, confirmed: null }]);
    }
  };

  const handleCreate = async () => {
    if (!title || !date || !leaderId) {
      Alert.alert('Preencha os campos', 'Título, data e líder são obrigatórios.');
      return;
    }

    const leader = members.find((m) => m.id === leaderId);

    await addSchedule({
      title,
      date,
      description,
      leaderId,
      leaderName: leader?.name || 'Líder',
      team,
      songs: selectedSongs,
      status: 'published',
    });

    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="xmark.circle.fill" size={24} color={colors.textMuted} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Nova Escala</Text>
        <Pressable
          onPress={handleCreate}
          style={({ pressed }) => [
            styles.saveBtn,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.8 },
          ]}>
          <Text style={styles.saveBtnText}>Criar</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={[styles.label, { color: colors.textMuted }]}>TÍTULO</Text>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          placeholder="Ex: Culto de Domingo"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        {/* Date */}
        <Text style={[styles.label, { color: colors.textMuted }]}>DATA</Text>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textMuted}
          value={date}
          onChangeText={setDate}
        />

        {/* Description */}
        <Text style={[styles.label, { color: colors.textMuted }]}>DESCRIÇÃO (OPCIONAL)</Text>
        <TextInput
          style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          placeholder="Informações adicionais..."
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Leader */}
        <Text style={[styles.label, { color: colors.textMuted }]}>LÍDER</Text>
        <View style={styles.chipList}>
          {members.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setLeaderId(m.id)}
              style={[
                styles.selectChip,
                {
                  backgroundColor: leaderId === m.id ? colors.primary : colors.surface,
                  borderColor: leaderId === m.id ? colors.primary : colors.border,
                },
              ]}>
              <Text style={[{ color: leaderId === m.id ? '#fff' : colors.text }]}>
                {m.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Team */}
        <Text style={[styles.label, { color: colors.textMuted }]}>EQUIPE</Text>
        <View style={styles.chipList}>
          {members.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => toggleMember(m.id, m.name)}
              style={[
                styles.selectChip,
                {
                  backgroundColor: team.some((t) => t.memberId === m.id) ? colors.primary : colors.surface,
                  borderColor: team.some((t) => t.memberId === m.id) ? colors.primary : colors.border,
                },
              ]}>
              <Text
                style={[
                  { color: team.some((t) => t.memberId === m.id) ? '#fff' : colors.text },
                ]}>
                {m.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Songs */}
        <Text style={[styles.label, { color: colors.textMuted }]}>REPERTÓRIO</Text>
        <View style={styles.songList}>
          {songs.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => toggleSong(s.id, s.title)}
              style={[
                styles.songSelect,
                {
                  backgroundColor: selectedSongs.some((ss) => ss.songId === s.id)
                    ? colors.primary + '15'
                    : colors.surface,
                  borderColor: selectedSongs.some((ss) => ss.songId === s.id)
                    ? colors.primary
                    : colors.border,
                },
              ]}>
              <IconSymbol
                name={selectedSongs.some((ss) => ss.songId === s.id) ? 'checkmark.circle.fill' : 'music.note'}
                size={20}
                color={selectedSongs.some((ss) => ss.songId === s.id) ? colors.primary : colors.textMuted}
              />
              <View style={styles.songSelectInfo}>
                <Text style={[styles.songSelectTitle, { color: colors.text }]}>{s.title}</Text>
                <Text style={[styles.songSelectArtist, { color: colors.textMuted }]}>
                  {s.artist} {s.key ? `• ${s.key}` : ''}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
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
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  selectChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  songList: {
    gap: Spacing.sm,
  },
  songSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  songSelectInfo: {
    flex: 1,
  },
  songSelectTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  songSelectArtist: {
    fontSize: 12,
    marginTop: 2,
  },
});
