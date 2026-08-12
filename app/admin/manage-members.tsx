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
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { EmptyState } from '@/components/worship/EmptyState';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMembers } from '@/hooks/useMembers';
import type { Member, MemberRole, AccessLevel } from '@/types';
import { ROLE_LABELS, ACCESS_LABELS } from '@/types';

const ALL_ROLES: MemberRole[] = [
  'vocal',
  'violao',
  'guitarra',
  'bateria',
  'teclado',
  'baixo',
];

const ALL_ACCESS: AccessLevel[] = ['admin', 'integrante'];

export default function ManageMembersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { data: members, addMember, update, remove } = useMembers();

  // Add form state
  const [name, setName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<MemberRole[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<AccessLevel>('integrante');

  // Edit modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [editName, setEditName] = useState('');
  const [editRoles, setEditRoles] = useState<MemberRole[]>([]);
  const [editLevel, setEditLevel] = useState<AccessLevel>('integrante');

  const resetAddForm = () => {
    setName('');
    setSelectedRoles([]);
    setSelectedLevel('integrante');
  };

  const openEditModal = (member: Member) => {
    setEditMember(member);
    setEditName(member.name);
    setEditRoles([...member.roles]);
    setEditLevel(member.level || 'integrante');
    setModalVisible(true);
  };

  const handleAdd = async () => {
    if (!name.trim() || selectedRoles.length === 0) {
      Alert.alert('Preencha os campos', 'Nome e pelo menos um instrumento são obrigatórios.');
      return;
    }
    await addMember({ name: name.trim(), roles: selectedRoles, level: selectedLevel });
    resetAddForm();
  };

  const handleEditSave = async () => {
    if (!editMember || !editName.trim() || editRoles.length === 0) return;
    await update(editMember.id, {
      name: editName.trim(),
      roles: editRoles,
      level: editLevel,
    });
    setModalVisible(false);
    setEditMember(null);
  };

  const handleDelete = (id: string, memberName: string) => {
    Alert.alert('Remover membro', `Remover ${memberName}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => remove(id) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="xmark.circle.fill" size={24} color={colors.textMuted} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Membros</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Add form */}
        <Text style={[styles.label, { color: colors.textMuted }]}>ADICIONAR MEMBRO</Text>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          placeholder="Nome do membro"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleAdd}
        />

        <Text style={[styles.sublabel, { color: colors.textMuted }]}>Instrumentos</Text>
        <View style={styles.chipRow}>
          {ALL_ROLES.map((role) => (
            <Pressable
              key={role}
              onPress={() =>
                setSelectedRoles((prev) =>
                  prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
                )
              }
              style={[
                styles.chip,
                {
                  backgroundColor: selectedRoles.includes(role) ? colors.primary : colors.surface,
                  borderColor: selectedRoles.includes(role) ? colors.primary : colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.chipText,
                  { color: selectedRoles.includes(role) ? '#fff' : colors.textSecondary },
                ]}>
                {ROLE_LABELS[role]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sublabel, { color: colors.textMuted }]}>Permissão</Text>
        <View style={styles.chipRow}>
          {ALL_ACCESS.map((level) => (
            <Pressable
              key={level}
              onPress={() => setSelectedLevel(level)}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedLevel === level ? colors.primary : colors.surface,
                  borderColor: selectedLevel === level ? colors.primary : colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.chipText,
                  { color: selectedLevel === level ? '#fff' : colors.textSecondary },
                ]}>
                {ACCESS_LABELS[level]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [
            styles.addBtn,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.8 },
          ]}>
          <IconSymbol name="person.badge.plus" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Adicionar</Text>
        </Pressable>

        {/* Members list */}
        <Text style={[styles.label, { color: colors.textMuted, marginTop: Spacing.lg }]}>
          MEMBROS ({members.length})
        </Text>

        {members.length === 0 ? (
          <EmptyState
            icon="groups"
            title="Nenhum membro"
            subtitle="Adicione membros do grupo de louvor"
          />
        ) : (
          members.map((member) => (
            <View
              key={member.id}
              style={[styles.memberCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.memberInfo}>
                <View style={[styles.memberAvatar, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.memberAvatarText, { color: colors.primary }]}>
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.memberText}>
                  <View style={styles.memberNameRow}>
                    <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                    <View
                      style={[
                        styles.levelBadge,
                        {
                          backgroundColor:
                            member.level === 'admin'
                              ? colors.primary + '20'
                              : colors.success + '20',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.levelBadgeText,
                          { color: member.level === 'admin' ? colors.primary : colors.success },
                        ]}>
                        {ACCESS_LABELS[member.level || 'integrante']}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.memberRoles, { color: colors.textMuted }]}>
                    {member.roles.map((r) => ROLE_LABELS[r]).join(', ')}
                  </Text>
                </View>
              </View>
              <View style={styles.memberActions}>
                <Pressable onPress={() => openEditModal(member)} style={styles.actionBtn}>
                  <IconSymbol name="pencil.circle.fill" size={22} color={colors.primary} />
                </Pressable>
                <Pressable onPress={() => handleDelete(member.id, member.name)} style={styles.actionBtn}>
                  <IconSymbol name="trash.fill" size={20} color={colors.danger || '#E17055'} />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.backBtn}>
              <IconSymbol name="xmark.circle.fill" size={24} color={colors.textMuted} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Editar Membro</Text>
            <Pressable
              onPress={handleEditSave}
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.8 },
              ]}>
              <Text style={styles.saveBtnText}>Salvar</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <Text style={[styles.label, { color: colors.textMuted }]}>NOME</Text>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
              placeholder="Nome do membro"
              placeholderTextColor={colors.textMuted}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={[styles.sublabel, { color: colors.textMuted }]}>Instrumentos</Text>
            <View style={styles.chipRow}>
              {ALL_ROLES.map((role) => (
                <Pressable
                  key={role}
                  onPress={() =>
                    setEditRoles((prev) =>
                      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
                    )
                  }
                  style={[
                    styles.chip,
                    {
                      backgroundColor: editRoles.includes(role) ? colors.primary : colors.surface,
                      borderColor: editRoles.includes(role) ? colors.primary : colors.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.chipText,
                      { color: editRoles.includes(role) ? '#fff' : colors.textSecondary },
                    ]}>
                    {ROLE_LABELS[role]}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.sublabel, { color: colors.textMuted }]}>Permissão</Text>
            <View style={styles.chipRow}>
              {ALL_ACCESS.map((level) => (
                <Pressable
                  key={level}
                  onPress={() => setEditLevel(level)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: editLevel === level ? colors.primary : colors.surface,
                      borderColor: editLevel === level ? colors.primary : colors.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.chipText,
                      { color: editLevel === level ? '#fff' : colors.textSecondary },
                    ]}>
                    {ACCESS_LABELS[level]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  content: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  sublabel: {
    fontSize: 12,
    fontWeight: '600',
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  memberText: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  memberRoles: {
    fontSize: 12,
    marginTop: 2,
  },
  memberActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    padding: Spacing.sm,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
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
  modalContent: {
    padding: Spacing.lg,
  },
});
