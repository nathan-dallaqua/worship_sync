import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Song } from '@/types';

type Props = {
  song: Song;
  onPress?: () => void;
};

export function SongCard({ song, onPress }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const hasLinks = song.letrasUrl || song.spotifyUrl || song.youtubeUrl;

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
      <View style={styles.keyBadge}>
        <Text style={styles.keyText}>{song.key || 'C'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
          {song.artist}
        </Text>
      </View>
      {hasLinks && (
        <View style={styles.links}>
          {song.youtubeUrl && <IconSymbol name="play.circle.fill" size={14} color="#FF0000" />}
          {song.spotifyUrl && <IconSymbol name="music.note" size={14} color="#1DB954" />}
          {song.letrasUrl && <IconSymbol name="doc.text.fill" size={14} color={colors.textMuted} />}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  keyBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C5CE7' + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C5CE7',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  artist: {
    fontSize: 13,
    marginTop: 2,
  },
  links: {
    flexDirection: 'row',
    gap: 3,
  },
});
