import { Platform } from 'react-native';

// Modern worship-themed color palette
const primary = '#6C5CE7';
const primaryLight = '#A29BFE';
const secondary = '#00CEC9';
const accent = '#FD79A8';
const success = '#00B894';
const warning = '#FDCB6E';
const danger = '#E17055';

export const Colors = {
  light: {
    text: '#2D2D3A',
    textSecondary: '#636E72',
    textMuted: '#B2BEC3',
    background: '#F8F9FE',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F2F8',
    border: '#E8E8F0',
    tint: primary,
    tabIconDefault: '#B2BEC3',
    tabIconSelected: primary,
    icon: '#636E72',
    primary,
    primaryLight,
    secondary,
    accent,
    success,
    warning,
    danger,
    cardShadow: 'rgba(108, 92, 231, 0.08)',
  },
  dark: {
    text: '#E8E8F0',
    textSecondary: '#9BA1A6',
    textMuted: '#636E72',
    background: '#0F0F1A',
    surface: '#1A1A2E',
    surfaceSecondary: '#16213E',
    border: '#2D2D3A',
    tint: primaryLight,
    tabIconDefault: '#636E72',
    tabIconSelected: primaryLight,
    icon: '#9BA1A6',
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
