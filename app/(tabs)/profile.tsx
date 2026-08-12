import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isAdmin, setIsAdmin] = useState(true);
  const [userName, setUserName] = useState('Líder do Grupo');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Perfil</Text>
      </View>

      {/* Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{userName}</Text>
        <View style={[styles.roleBadge, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[styles.roleText, { color: colors.primary }]}>
            {isAdmin ? 'Administrador' : 'Membro'}
          </Text>
        </View>
      </View>

      {/* Sections */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>GERENCIAR</Text>

        <Pressable
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.push('/admin/manage-members' as Href)}>
          <IconSymbol name="person.3.fill" size={22} color={colors.primary} />
          <Text style={[styles.rowText, { color: colors.text }]}>Membros do grupo</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textMuted} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.push('/admin/manage-members' as Href)}>
          <IconSymbol name="music.quarternote.3" size={22} color={colors.primary} />
          <Text style={[styles.rowText, { color: colors.text }]}>Gerenciar repertório</Text>
          <IconSymbol name="chevron.right" size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>CONFIGURAÇÕES</Text>

        <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <IconSymbol name="gearshape.fill" size={22} color={colors.primary} />
          <Text style={[styles.rowText, { color: colors.text }]}>Modo administrador</Text>
          <Switch
            value={isAdmin}
            onValueChange={setIsAdmin}
            trackColor={{ false: colors.border, true: colors.primary + '60' }}
            thumbColor={isAdmin ? colors.primary : colors.textMuted}
          />
        </View>
      </View>

      <Text style={[styles.version, { color: colors.textMuted }]}>Worship Sync v1.0.0</Text>
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
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  profileCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    paddingLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: Spacing.lg,
  },
});
