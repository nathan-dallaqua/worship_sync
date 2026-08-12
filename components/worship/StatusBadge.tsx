import { StyleSheet, Text, View } from 'react-native';

import { Colors, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  confirmed: boolean | null;
};

export function StatusBadge({ confirmed }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const config =
    confirmed === true
      ? { label: 'Confirmado', bg: Colors.light.success, text: '#fff' }
      : confirmed === false
        ? { label: 'Recusado', bg: Colors.light.danger, text: '#fff' }
        : { label: 'Pendente', bg: Colors.light.warning, text: '#2D2D3A' };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
