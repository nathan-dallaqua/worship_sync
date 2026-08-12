import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSongs } from '@/hooks/useSongs';
import { fetchLyrics } from '@/utils/fetchLyrics';

type Tab = 'lyrics' | 'chords' | 'notes';

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { data: songs, update } = useSongs();
  const [tab, setTab] = useState<Tab>('lyrics');
  const [loadingLyrics, setLoadingLyrics] = useState(false);

  const song = songs.find((s) => s.id === id);

  if (!song) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Música</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.textMuted }]}>Música não encontrada</Text>
        </View>
      </View>
    );
  }

  const showFetchButton = song.letrasUrl && !song.lyrics;

  const handleFetchLyrics = async () => {
    if (!song.letrasUrl) return;
    setLoadingLyrics(true);
    try {
      const lyrics = await fetchLyrics(song.letrasUrl);
      if (lyrics) {
        await update(song.id, { lyrics } as any);
      } else {
        Alert.alert('Não foi possível extrair a letra', 'Tente copiar manualmente do site.');
      }
    } catch {
      Alert.alert('Erro', 'Falha ao buscar a letra.');
    } finally {
      setLoadingLyrics(false);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'lyrics', label: 'Letra' },
    { key: 'chords', label: 'Cifras' },
    { key: 'notes', label: 'Notas' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={[styles.headerArtist, { color: colors.textMuted }]} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.meta}>
        <View style={[styles.metaChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <IconSymbol name="key.fill" size={16} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.primary }]}>Tom: {song.key || 'C'}</Text>
        </View>
        {showFetchButton && (
          <Pressable
            onPress={handleFetchLyrics}
            disabled={loadingLyrics}
            style={[styles.metaChip, styles.fetchChip, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
            {loadingLyrics ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <IconSymbol name="arrow.right" size={16} color={colors.primary} />
            )}
            <Text style={[styles.metaText, { color: colors.primary }]}>
              {loadingLyrics ? 'Buscando...' : 'Buscar letra'}
            </Text>
          </Pressable>
        )}
        {song.letrasUrl && song.lyrics && (
          <View style={[styles.metaChip, { backgroundColor: colors.success + '15', borderColor: colors.success + '30' }]}>
            <IconSymbol name="checkmark" size={14} color={colors.success} />
            <Text style={[styles.metaText, { color: colors.success }]}>Letra salva</Text>
          </View>
        )}
      </View>

      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {tabs.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setTab(t.key)}
            style={[styles.tab, tab === t.key && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}>
            <Text style={[styles.tabText, { color: tab === t.key ? colors.primary : colors.textMuted }]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {tab === 'lyrics' && (
          <Text style={[styles.contentText, { color: colors.text }]}>
            {song.lyrics || 'Nenhuma letra cadastrada.\n\nCole o link do Letras ou Vagalume no campo "Letras" ao editar a música, depois toque em "Buscar letra" para carregar automaticamente.'}
          </Text>
        )}
        {tab === 'chords' && (
          <Text style={[styles.chordsText, { color: colors.text }]}>
            {song.chords || 'Nenhuma cifra cadastrada.'}
          </Text>
        )}
        {tab === 'notes' && (
          <Text style={[styles.contentText, { color: colors.textSecondary }]}>
            {song.notes || 'Nenhuma nota ou observação.'}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 54, paddingBottom: Spacing.md, paddingHorizontal: Spacing.md, borderBottomWidth: 1,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  headerArtist: { fontSize: 12, marginTop: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, padding: Spacing.lg, paddingBottom: Spacing.md },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1,
  },
  fetchChip: {},
  metaText: { fontSize: 13, fontWeight: '600' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, marginHorizontal: Spacing.lg },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: '600' },
  scrollContent: { padding: Spacing.lg, paddingBottom: 60 },
  contentText: { fontSize: 15, lineHeight: 26 },
  chordsText: { fontSize: 15, lineHeight: 26, fontFamily: 'monospace' },
  errorText: { fontSize: 16 },
});
