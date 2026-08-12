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
import type { MemberRole, ScheduleSong, ScheduleTeamMember, Song } from '@/types';
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

  const toggleSong = (song: Song) => {
    setSelectedSongs((prev) => {
      const exists = prev.find((s) => s.songId === song.id);
      if (exists) {
        return prev.filter((s) => s.songId !== song.id);
      }
      return [
        ...prev,
        {
          songId: song.id,
          songTitle: song.title,
          songArtist: song.artist,
          key: song.key || '',
          notes: '',
          youtubeUrl: song.youtubeUrl || '',
          spotifyUrl: song.spotifyUrl || '',
        },
      ];
    });
  };

  const updateSongKey = (songId: string, field: 'key' | 'youtubeUrl' | 'spotifyUrl', value: string) => {
    setSelectedSongs((prev) =>
      prev.map((s) => (s.songId === songId ? { ...s, [field]: value } : s)),
    );
  };

  const removeSong = (songId: string) => {
    setSelectedSongs((prev) => prev.filter((s) => s.songId !== songId));
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

    // Convert dd/MM/YYYY to ISO for storage
    const [d, m, y] = date.split('/');
    const isoDate = d && m && y ? `${y}-${m}-${d}` : date;

    await addSchedule({
      title,
      date: isoDate,
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: colors.textMuted }]}>TÍTULO</Text>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          placeholder="Ex: Culto de Domingo"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>DATA</Text>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          placeholder="dd/MM/YYYY"
          placeholderTextColor={colors.textMuted}
          value={date}
          onChangeText={setDate}
          keyboardType="numeric"
        />

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
              <Text style={[{ color: leaderId === m.id ? '#fff' : colors.text }]}>{m.name}</Text>
            </Pressable>
          ))}
        </View>

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
              <Text style={[{ color: team.some((t) => t.memberId === m.id) ? '#fff' : colors.text }]}>
                {m.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Selected songs with settings */}
        {selectedSongs.length > 0 && (
          <>
            <Text style={[styles.label, { color: colors.textMuted }]}>MÚSICAS SELECIONADAS</Text>
            {selectedSongs.map((ss, idx) => (
              <View
                key={ss.songId}
                style={[styles.selectedSongCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.selectedSongHeader}>
                  <View style={[styles.songIndexBadge, { backgroundColor: colors.primary + '15' }]}>
                    <Text style={[styles.songIndexText, { color: colors.primary }]}>{idx + 1}</Text>
                  </View>
                  <View style={styles.selectedSongInfo}>
                    <Text style={[styles.selectedSongName, { color: colors.text }]}>{ss.songTitle}</Text>
                    {ss.songArtist && (
                      <Text style={[styles.selectedSongArtist, { color: colors.textMuted }]}>{ss.songArtist}</Text>
                    )}
                  </View>
                  <Pressable onPress={() => removeSong(ss.songId)} style={styles.removeSongBtn}>
                    <IconSymbol name="xmark.circle.fill" size={20} color={colors.danger || '#E17055'} />
                  </Pressable>
                </View>
                <View style={styles.songFields}>
                  <View style={styles.songField}>
                    <Text style={[styles.songFieldLabel, { color: colors.textMuted }]}>Tom</Text>
                    <TextInput
                      style={[styles.songFieldInput, { color: colors.text, backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
                      placeholder="Ex: G"
                      placeholderTextColor={colors.textMuted}
                      value={ss.key || ''}
                      onChangeText={(v) => updateSongKey(ss.songId, 'key', v)}
                    />
                  </View>
                  <View style={styles.songField}>
                    <Text style={[styles.songFieldLabel, { color: colors.textMuted }]}>YouTube</Text>
                    <TextInput
                      style={[styles.songFieldInput, { color: colors.text, backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
                      placeholder="Link (opcional)"
                      placeholderTextColor={colors.textMuted}
                      value={ss.youtubeUrl || ''}
                      onChangeText={(v) => updateSongKey(ss.songId, 'youtubeUrl', v)}
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.songField}>
                    <Text style={[styles.songFieldLabel, { color: colors.textMuted }]}>Spotify</Text>
                    <TextInput
                      style={[styles.songFieldInput, { color: colors.text, backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
                      placeholder="Link (opcional)"
                      placeholderTextColor={colors.textMuted}
                      value={ss.spotifyUrl || ''}
                      onChangeText={(v) => updateSongKey(ss.songId, 'spotifyUrl', v)}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Available songs */}
        <Text style={[styles.label, { color: colors.textMuted, marginTop: Spacing.md }]}>REPERTÓRIO DISPONÍVEL</Text>
        <View style={styles.songList}>
          {songs.map((s) => {
            const selected = selectedSongs.some((ss) => ss.songId === s.id);
            return (
              <Pressable
                key={s.id}
                onPress={() => toggleSong(s)}
                style={[
                  styles.songSelect,
                  {
                    backgroundColor: selected ? colors.primary + '12' : colors.surface,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}>
                <IconSymbol
                  name={selected ? 'checkmark.circle.fill' : 'music.note'}
                  size={20}
                  color={selected ? colors.primary : colors.textMuted}
                />
                <View style={styles.songSelectInfo}>
                  <Text style={[styles.songSelectTitle, { color: colors.text }]}>{s.title}</Text>
                  <Text style={[styles.songSelectArtist, { color: colors.textMuted }]}>
                    {s.artist} {s.key ? `• Tom: ${s.key}` : ''}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 54, paddingBottom: Spacing.md, paddingHorizontal: Spacing.md, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  content: { padding: Spacing.lg, paddingBottom: 60 },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: Spacing.sm, marginTop: Spacing.md },
  input: {
    borderRadius: BorderRadius.md, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: 15,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  chipList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  selectChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1 },
  // Selected songs
  selectedSongCard: { padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, marginBottom: Spacing.sm },
  selectedSongHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  songIndexBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  songIndexText: { fontSize: 13, fontWeight: '700' },
  selectedSongInfo: { flex: 1 },
  selectedSongName: { fontSize: 14, fontWeight: '600' },
  selectedSongArtist: { fontSize: 11, marginTop: 1 },
  removeSongBtn: { padding: 4 },
  songFields: { gap: Spacing.xs },
  songField: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  songFieldLabel: { fontSize: 12, fontWeight: '600', width: 55 },
  songFieldInput: {
    flex: 1, borderRadius: BorderRadius.sm, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 6, fontSize: 13,
  },
  // Available songs list
  songList: { gap: Spacing.sm },
  songSelect: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, gap: Spacing.md },
  songSelectInfo: { flex: 1 },
  songSelectTitle: { fontSize: 15, fontWeight: '600' },
  songSelectArtist: { fontSize: 12, marginTop: 2 },
});
