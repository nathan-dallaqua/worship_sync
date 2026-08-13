import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconName = keyof typeof MAPPING;

const MAPPING = {
  // Navigation
  'house.fill': 'home',
  'calendar.fill': 'calendar-month',
  'music.note.list': 'queue-music',
  'person.fill': 'person',
  // Actions
  'plus.circle.fill': 'add-circle',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  'xmark.circle.fill': 'cancel',
  'checkmark.circle.fill': 'check-circle',
  'trash.fill': 'delete',
  'pencil.circle.fill': 'edit',
  'sun.max.fill': 'light-mode',
  'moon.fill': 'dark-mode',
  'circle.lefthalf.filled': 'brightness-auto',
  // Music
  'music.note': 'music-note',
  'music.quarternote.3': 'library-music',
  'guitars.fill': 'mic',
  // Team
  'person.3.fill': 'groups',
  'person.badge.plus': 'person-add',
  // Status
  'checkmark': 'check',
  'xmark': 'close',
  'clock.fill': 'schedule',
  'arrow.right': 'arrow-forward',
  'magnifyingglass': 'search',
  'gearshape.fill': 'settings',
  'list.bullet': 'list',
  'info.circle.fill': 'info',
  'arrow.up.arrow.down': 'swap-vert',
  'key.fill': 'vpn-key',
  'link': 'link',
  'play.circle.fill': 'play-circle',
  'book.fill': 'menu-book',
  'doc.text.fill': 'description',
} as const;

export type IconSymbolName = IconName;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: string;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
