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
        <Pressable style={styles.modalBackdrop} onPress={onCancel} />
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

function MemberFormModal({
  visible,
  member,
  colors,
  onClose,
  onSave,
}: {
  visible: boolean;
  member: Member | null;
  colors: any;
  onClose: () => void;
  onSave: (data: { name: string; roles: MemberRole[]; level: AccessLevel }) => void;
}) {
  const isEdit = member !== null;
  const [name, setName] = useState(member?.name || '');
  const [selectedRoles, setSelectedRoles] = useState<MemberRole[]>(member?.roles || []);
  const [selectedLevel, setSelectedLevel] = useState<AccessLevel>(member?.level || 'integrante');

  // Reset form when modal opens/closes
  const handleClose = () => {
    onClose();
  };

  // Sync state when member changes
  if (member && member.name !== name && name === '') {
    // Only happens on first open
  }

  const handleSave = () => {
    if (!name.trim() || selectedRoles.length === 0) {
      Alert.alert('Preencha os campos', 'Nome e pelo menos um instrumento são obrigatórios.');
      return;
    }
    onSave({ name: name.trim(), roles: selectedRoles, level: selectedLevel });
    setName('');
    setSelectedRoles([]);
    setSelectedLevel('integrante');
  };

  // On dismiss reset
  const onDismiss = () => {
    setName('');
    setSelectedRoles([]);
    setSelectedLevel('integrante');
    onClose();
  };

  // Init form when opening
  const initForm = () => {
    if (member) {
      setName(member.name);
      setSelectedRoles([...member.roles]);
      setSelectedLevel(member.level || 'integrante');
    } else {
      setName('');
      setSelectedRoles([]);
      setSelectedLevel('integrante');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onShow={initForm}
      onRequestClose={onDismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onDismiss} />
        <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {isEdit ? 'Editar Membro' : 'Novo Membro'}
            </Text>
            <Pressable onPress={onDismiss} style={styles.modalClose}>
              <IconSymbol name="xmark.circle.fill" size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalBody}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>NOME</Text>
            <TextInput
              style={[styles.modalInput, { color: colors.text, backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
              placeholder="Nome do membro"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoFocus
            />

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>INSTRUMENTOS</Text>
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
                      backgroundColor: selectedRoles.includes(role) ? colors.primary : colors.surfaceSecondary,
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

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>PERMISSÃO</Text>
            <View style={styles.chipRow}>
              {ALL_ACCESS.map((level) => (
                <Pressable
                  key={level}
                  onPress={() => setSelectedLevel(level)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selectedLevel === level ? colors.primary : colors.surfaceSecondary,
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
              onPress={handleSave}
              style={({ pressed }) => [
                styles.modalSaveBtn,
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.8 },
              ]}>
              <Text style={styles.modalSaveBtnText}>{isEdit ? 'Salvar alterações' : 'Adicionar membro'}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function ManageMembersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { data: members, addMember, update, remove } = useMembers();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const openAddModal = () => {
    setEditingMember(null);
    setModalVisible(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingMember(null);
  };

  const handleSave = async (data: { name: string; roles: MemberRole[]; level: AccessLevel }) => {
    if (editingMember) {
      await update(editingMember.id, data);
    } else {
      await addMember(data);
    }
    closeModal();
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="xmark.circle.fill" size={24} color={colors.textMuted} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Membros</Text>
        <Pressable onPress={openAddModal} style={styles.addBtn}>
          <IconSymbol name="plus.circle.fill" size={26} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.countLabel, { color: colors.textMuted }]}>
          {members.length} {members.length === 1 ? 'membro' : 'membros'}
        </Text>

        {members.length === 0 ? (
          <EmptyState
            icon="groups"
            title="Nenhum membro"
            subtitle="Toque no + para adicionar membros do grupo"
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

      <MemberFormModal
        visible={modalVisible}
        member={editingMember}
        colors={colors}
        onClose={closeModal}
        onSave={handleSave}
      />

      <ConfirmModal
        visible={deleteTarget !== null}
        title="Remover membro"
        message={`Tem certeza que deseja remover "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
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
  addBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  countLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.md,
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
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  modalClose: {
    padding: 4,
  },
  modalBody: {
    padding: Spacing.lg,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  modalInput: {
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
  modalSaveBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  modalSaveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  // Confirm modal
  confirmOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  confirmCard: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  confirmMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
    width: '100%',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
