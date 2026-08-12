export type MemberRole = 'vocal' | 'violao' | 'guitarra' | 'bateria' | 'teclado' | 'baixo' | 'percussao' | 'saxofone' | 'trompete';

export type AccessLevel = 'admin' | 'integrante';

export type ScheduleStatus = 'draft' | 'published' | 'completed' | 'cancelled';

export type UserRole = 'admin' | 'member' | 'leader';

export const ACCESS_LABELS: Record<AccessLevel, string> = {
  admin: 'Admin',
  integrante: 'Integrante',
};

export const ROLE_LABELS: Record<MemberRole, string> = {
  vocal: 'Vocal',
  violao: 'Violão',
  guitarra: 'Guitarra',
  bateria: 'Bateria',
  teclado: 'Teclado',
  baixo: 'Baixo',
  percussao: 'Percussão',
  saxofone: 'Saxofone',
  trompete: 'Trompete',
};

export const ROLE_COLORS: Record<MemberRole, string> = {
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

export interface Member {
  id: string;
  name: string;
  roles: MemberRole[];
  level: AccessLevel;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics?: string;
  chords?: string;
  notes?: string;
  key?: string;
  youtubeUrl?: string;
  defaultRole?: MemberRole;
  createdAt: string;
}

export interface ScheduleTeamMember {
  memberId: string;
  memberName: string;
  role: MemberRole;
  confirmed: boolean | null; // null = pendente, true = confirmado, false = recusado
}

export interface ScheduleSong {
  songId: string;
  songTitle: string;
  key?: string;
  notes?: string;
}

export interface Schedule {
  id: string;
  date: string;
  title: string;
  description?: string;
  leaderId: string;
  leaderName: string;
  team: ScheduleTeamMember[];
  songs: ScheduleSong[];
  status: ScheduleStatus;
  createdAt: string;
}
