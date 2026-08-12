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
  Modal,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { EmptyState } from '@/components/worship/EmptyState';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSongs } from '@/hooks/useSongs';
import type { Song } from '@/types';

function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  confirmColor,
  colors,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: string;
  colors: any;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.confirmOverlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={[styles.confirmCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <IconSymbol name="trash.fill" size={32} color={confirmColor} />
          <Text style={[styles.confirmTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.confirmMessage, { color: colors.textSecondary }]}>{message}</Text>
          <View style={styles.confirmActions}>
            <Pressable
              onPress={onCancel}
              style={[styles.confirmBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <Text style={[styles.confirmBtnText, { color: colors.text }]}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={[styles.confirmBtn, { backgroundColor: confirmColor }]}>
              <Text style={[styles.confirmBtnText, { color: '#fff' }]}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SongFormModal({
  visible,
  song,
  colors,
  onClose,
  onSave,
}: {
  visible: boolean;
  song: Song | null;
  colors: any;
  onClose: () => void;
  onSave: (data: {
    title: string;
    artist: string;
    key: string;
    letrasUrl: string;
    spotifyUrl: string;
    youtubeUrl: string;
  }) => void;
}) {
  const isEdit = song !== null;
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [key, setKey] = useState('');
  const [letrasUrl, setLetrasUrl] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const initForm = () => {
    if (song) {
      setTitle(song.title);
      setArtist(song.artist);
      setKey(song.key || '');
      setLetrasUrl(song.letrasUrl || '');
      setSpotifyUrl(song.spotifyUrl || '');
      setYoutubeUrl(song.youtubeUrl || '');
    } else {
      setTitle('');
      setArtist('');
      setKey('');
      setLetrasUrl('');
      setSpotifyUrl('');
      setYoutubeUrl('');
    }
  };

  const handleSave = () => {
    if (!title.trim() || !artist.trim()) {
      Alert.alert('Preencha os campos', 'Nome e artista são obrigatórios.');
      return;
    }
    onSave({
      title: title.trim(),
      artist: artist.trim(),
      key: key.trim(),
      letrasUrl: letrasUrl.trim(),
      spotifyUrl: spotifyUrl.trim(),
      youtubeUrl: youtubeUrl.trim(),
    });
  };

  const openWebSearch = (site: 'letras' | 'vagalume') => {
    const query = encodeURIComponent(`${artist} ${title}`.trim() || title.trim());
    if (!query) return;
    const url =
      site === 'letras'
        ? `https://www.letras.mus.br/?q=${query}`
        : `https://www.vagalume.com.br/search?q=${query}`;
    Linking.openURL(url);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onShow={initForm} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ScrollView
            contentContainerStyle={styles.modalBody}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {isEdit ? 'Editar Música' : 'Nova Música'}
              </Text>
              <Pressable onPress={onClose}>
                <IconSymbol name="xmark.circle.fill" size={22} color={colors.textMuted} />
              </Pressable>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>NOME DA MÚSICA</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
              placeholder="Ex: Rendido Estou"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>ARTISTA</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
              placeholder="Ex: Aline Barros"
              placeholderTextColor={colors.textMuted}
              value={artist}
              onChangeText={setArtist}
            />

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>TOM PADRÃO</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
              placeholder="Ex: G"
              placeholderTextColor={colors.textMuted}
              value={key}
              onChangeText={setKey}
            />

            <View style={styles.searchRow}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted, flex: 1 }]}>LINKS</Text>
              <View style={styles.searchBtns}>
                <Pressable
                  onPress={() => openWebSearch('letras')}
                  style={[styles.searchBtn, { backgroundColor: colors.primary + '15' }]}>
                  <IconSymbol name="doc.text.fill" size={14} color={colors.primary} />
                  <Text style={[styles.searchBtnText, { color: colors.primary }]}>Letras</Text>
                </Pressable>
                <Pressable
                  onPress={() => openWebSearch('vagalume')}
                  style={[styles.searchBtn, { backgroundColor: colors.secondary + '15' }]}>
                  <IconSymbol name="magnifyingglass" size={14} color={colors.secondary} />
                  <Text style={[styles.searchBtnText, { color: colors.secondary }]}>Vagalume</Text>
                </Pressable>
              </View>
            </View>

            <Text style={[styles.urlLabel, { color: colors.textMuted }]}>Letras</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
              placeholder="https://www.letras.mus.br/..."
              placeholderTextColor={colors.textMuted}
              value={letrasUrl}
              onChangeText={setLetrasUrl}
              autoCapitalize="none"
              keyboardType="url"
            />

            <Text style={[styles.urlLabel, { color: colors.textMuted }]}>Spotify</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
              placeholder="https://open.spotify.com/..."
              placeholderTextColor={colors.textMuted}
              value={spotifyUrl}
              onChangeText={setSpotifyUrl}
              autoCapitalize="none"
              keyboardType="url"
            />

            <Text style={[styles.urlLabel, { color: colors.textMuted }]}>YouTube</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
              placeholder="https://youtube.com/..."
              placeholderTextColor={colors.textMuted}
              value={youtubeUrl}
              onChangeText={setYoutubeUrl}
              autoCapitalize="none"
              keyboardType="url"
            />

            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.8 },
              ]}>
              <Text style={styles.saveBtnText}>{isEdit ? 'Salvar alterações' : 'Adicionar música'}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function ManageSongsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { data: songs, addSong, update, remove } = useSongs();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const openAddModal = () => {
    setEditingSong(null);
    setModalVisible(true);
  };

  const openEditModal = (song: Song) => {
    setEditingSong(song);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingSong(null);
  };

  const handleSave = async (data: {
    title: string;
    artist: string;
    key: string;
    letrasUrl: string;
    spotifyUrl: string;
    youtubeUrl: string;
  }) => {
    if (editingSong) {
      await update(editingSong.id, data as Partial<Song>);
    } else {
      await addSong(data);
    }
    closeModal();
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const openLink = (url: string) => {
    if (url) Linking.openURL(url);
  };

  const hasLinks = (song: Song) => song.letrasUrl || song.spotifyUrl || song.youtubeUrl;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.pageHeader, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <IconSymbol name="xmark.circle.fill" size={24} color={colors.textMuted} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Repertório</Text>
        <Pressable onPress={openAddModal} style={styles.headerBtn}>
          <IconSymbol name="plus.circle.fill" size={26} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.countLabel, { color: colors.textMuted }]}>
          {songs.length} {songs.length === 1 ? 'música' : 'músicas'}
        </Text>

        {songs.length === 0 ? (
          <EmptyState
            icon="library-music"
            title="Nenhuma música"
            subtitle="Toque no + para adicionar músicas ao repertório"
          />
        ) : (
          songs.map((song) => (
            <View
              key={song.id}
              style={[styles.songCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.songInfo}>
                <View style={[styles.keyBadge, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.keyText, { color: colors.primary }]}>{song.key || '?'}</Text>
                </View>
                <View style={styles.songText}>
                  <Text style={[styles.songName, { color: colors.text }]}>{song.title}</Text>
                  <Text style={[styles.songArtist, { color: colors.textSecondary }]}>{song.artist}</Text>
                </View>
              </View>

              <View style={styles.songActions}>
                {hasLinks(song) && (
                  <View style={styles.linkIcons}>
                    {song.letrasUrl && (
                      <Pressable onPress={() => openLink(song.letrasUrl!)} style={styles.linkBtn}>
                        <IconSymbol name="doc.text.fill" size={14} color={colors.textMuted} />
                      </Pressable>
                    )}
                    {song.spotifyUrl && (
                      <Pressable onPress={() => openLink(song.spotifyUrl!)} style={styles.linkBtn}>
                        <IconSymbol name="music.note" size={14} color="#1DB954" />
                      </Pressable>
                    )}
                    {song.youtubeUrl && (
                      <Pressable onPress={() => openLink(song.youtubeUrl!)} style={styles.linkBtn}>
                        <IconSymbol name="play.circle.fill" size={14} color="#FF0000" />
                      </Pressable>
                    )}
                  </View>
                )}
                <Pressable onPress={() => openEditModal(song)} style={styles.actionBtn}>
                  <IconSymbol name="pencil.circle.fill" size={20} color={colors.primary} />
                </Pressable>
                <Pressable onPress={() => handleDelete(song.id, song.title)} style={styles.actionBtn}>
                  <IconSymbol name="trash.fill" size={18} color={colors.danger || '#E17055'} />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <SongFormModal
        visible={modalVisible}
        song={editingSong}
        colors={colors}
        onClose={closeModal}
        onSave={handleSave}
      />

      <ConfirmModal
        visible={deleteTarget !== null}
        title="Remover música"
        message={`Tem certeza que deseja remover "${deleteTarget?.title}"?`}
        confirmLabel="Remover"
        confirmColor={colors.danger || '#E17055'}
        colors={colors}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  pageTitle: { fontSize: 17, fontWeight: '700' },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.lg, paddingBottom: 60 },
  countLabel: { fontSize: 13, fontWeight: '600', marginBottom: Spacing.md },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  songInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  songText: { flex: 1 },
  songName: { fontSize: 15, fontWeight: '600' },
  songArtist: { fontSize: 12, marginTop: 2 },
  keyBadge: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  keyText: { fontSize: 13, fontWeight: '700' },
  songActions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  linkIcons: { flexDirection: 'row', gap: 1 },
  linkBtn: { padding: 4 },
  actionBtn: { padding: 6 },
  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalCard: {
    width: '100%', maxHeight: '90%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderWidth: 1, borderBottomWidth: 0,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: Spacing.md, marginBottom: Spacing.md, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 17, fontWeight: '700' },
  modalBody: { padding: Spacing.lg },
  fieldLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: Spacing.sm, marginTop: Spacing.md },
  input: {
    borderRadius: BorderRadius.md, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: 10, fontSize: 15,
  },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  searchBtns: { flexDirection: 'row', gap: Spacing.sm },
  searchBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: BorderRadius.sm,
  },
  searchBtnText: { fontSize: 12, fontWeight: '600' },
  urlLabel: { fontSize: 11, fontWeight: '600', marginBottom: Spacing.xs, marginTop: Spacing.sm, color: '#636E72' },
  saveBtn: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: BorderRadius.lg, marginTop: Spacing.lg,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  // Confirm modal
  confirmOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  confirmCard: {
    width: '100%', borderRadius: BorderRadius.xl, borderWidth: 1,
    padding: Spacing.lg, alignItems: 'center', gap: Spacing.sm,
  },
  confirmTitle: { fontSize: 17, fontWeight: '700', marginTop: Spacing.xs },
  confirmMessage: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  confirmActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, width: '100%' },
  confirmBtn: {
    flex: 1, paddingVertical: 12, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  confirmBtnText: { fontSize: 15, fontWeight: '700' },
});
