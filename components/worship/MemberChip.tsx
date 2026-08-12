import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ROLE_LABELS, type MemberRole } from '@/types';

type Props = {
  name: string;
  role: MemberRole;
  confirmed?: boolean | null;
  selected?: boolean;
  onPress?: () => void;
};

const ROLE_COLORS: Record<MemberRole, string> = {
  vocal: '#FD79A8',
  violao: '#6C5CE7',
  guitarra: '#E17055',
  bateria: '#00CEC9',
  teclado: '#0984E3',
  baixo: '#00B894',
  percussao: '#FDCB6E',
  saxofone: '#E84393',
  trompete: '#F39C12',
};

export function MemberChip({ name, role, confirmed, selected, onPress }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const roleColor = ROLE_COLORS[role];

  const content = (
    <View
      style={[
        styles.chip,
        { backgroundColor: colors.surface, borderColor: selected ? colors.primary : colors.border },
        selected && { borderWidth: 2, backgroundColor: colors.primary + '08' },
      ]}>
      <View style={[styles.avatar, { backgroundColor: roleColor + '20' }]}>
        <Text style={[styles.avatarText, { color: roleColor }]}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.role, { color: roleColor }]}>{ROLE_LABELS[role]}</Text>
      </View>
      {confirmed !== undefined && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor:
                confirmed === true
                  ? Colors.light.success
                  : confirmed === false
                    ? Colors.light.danger
                    : Colors.light.warning,
            },
          ]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.8 }}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  role: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
