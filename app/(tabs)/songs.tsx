import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { EmptyState } from '@/components/worship/EmptyState';
import { SongCard } from '@/components/worship/SongCard';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSongs } from '@/hooks/useSongs';

export default function SongsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { data: songs } = useSongs();
  const [search, setSearch] = useState('');

  const filtered = search
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.artist.toLowerCase().includes(search.toLowerCase()),
      )
    : songs;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Músicas</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {songs.length} {songs.length === 1 ? 'música' : 'músicas'}
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar músicas..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <Pressable onPress={() => setSearch('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongCard song={item} onPress={() => router.push(`/song/${item.id}` as Href)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          search ? (
            <EmptyState
              icon="search"
              title="Nenhum resultado"
              subtitle={`Nenhuma música encontrada para "${search}"`}
            />
          ) : (
            <EmptyState
              icon="library-music"
              title="Nenhuma música"
              subtitle="Adicione músicas ao repertório"
            />
          )
        }
              />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    height: 48,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: 48,
  },
  list: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
});
