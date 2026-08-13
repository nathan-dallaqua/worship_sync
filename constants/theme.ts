import { Platform } from 'react-native';

// Modern worship-themed color palette
const primary = '#1DB954';
const primaryLight = '#1ED760';
const secondary = '#00CEC9';
const accent = '#FD79A8';
const success = '#00B894';
const warning = '#FDCB6E';
const danger = '#E17055';

export const Colors = {
  light: {
    text: '#1B1B1B',
    textSecondary: '#576C61',
    textMuted: '#98A39B',
    background: '#F2F8F3',
    surface: '#FFFFFF',
    surfaceSecondary: '#E8F4EC',
    border: '#DEEBE1',
    tint: primary,
    tabIconDefault: '#98A39B',
    tabIconSelected: primary,
    icon: '#576C61',
    primary,
    primaryLight,
    secondary,
    accent,
    success,
    warning,
    danger,
    cardShadow: 'rgba(29, 185, 84, 0.10)',
  },
  dark: {
    text: '#E8F0EA',
    textSecondary: '#9BA8A0',
    textMuted: '#5C6B62',
    background: '#0B1210',
    surface: '#122019',
    surfaceSecondary: '#1B2B22',
    border: '#24352B',
    tint: primaryLight,
    tabIconDefault: '#5C6B62',
    tabIconSelected: primaryLight,
    icon: '#9BA8A0',
    primary,
    primaryLight,
    secondary,
    accent,
    success,
    warning,
    danger,
    cardShadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
