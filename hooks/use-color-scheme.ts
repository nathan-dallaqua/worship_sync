import { useColorScheme as useRNColorScheme } from 'react-native';

import { useThemePreference } from './use-theme-preference';

export function useColorScheme() {
  const system = useRNColorScheme();
  const { preference } = useThemePreference();
  return preference === 'system' ? system : preference;
}
