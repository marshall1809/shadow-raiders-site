export type Competition = 'rise' | 'cfc' | 'ams' | 'friendly'
export type MatchStatus = 'upcoming' | 'completed' | 'cancelled'
export type MatchOutcome = 'win' | 'loss' | 'draw'

export interface ScheduleItem {
  id: string
  date: string
  time_gmt: string
  competition: Competition
  title: string
  opponent: string
  status: MatchStatus
  notes?: string
  created_at: string
  updated_at: string
}

export interface Result {
  id: string
  date: string
  competition: Competition
  title: string
  opponent: string
  our_score?: number
  their_score?: number
  outcome?: MatchOutcome
  notes?: string
  created_at: string
  updated_at: string
}

export interface Leader {
  id: string
  rank_order: number
  name: string
  rank_title: string
  role_title: string
  bio: string
  badge_text?: string
  created_at: string
  updated_at: string
}

export interface FaqItem {
  id: string
  sort_order: number
  question: string
  answer: string
  created_at: string
  updated_at: string
}

export interface HallOfFameProfile {
  id: string
  display_name: string
  role_title?: string | null
  short_description: string
  biography?: string | null
  avatar_url?: string | null
  avatar_path?: string | null
  inducted_at?: string | null
  tags?: string[] | null
  status?: string | null
  sort_order?: number | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export const COMPETITION_LABELS: Record<Competition, string> = {
  rise: 'Rise League',
  cfc: 'CFC',
  ams: 'Alliance Masters Series',
  friendly: 'Friendly AvA',
}

export const COMPETITION_COLORS: Record<Competition, { row: string; badge: string; dot: string; border: string }> = {
  rise:     { row: 'border-l-red-900 bg-red-950/20',      badge: 'bg-red-950/50 border-red-800 text-red-300',          dot: 'bg-red-900',     border: '#7a1a1a' },
  cfc:      { row: 'border-l-neutral-600 bg-neutral-900/30', badge: 'bg-neutral-900 border-neutral-600 text-neutral-400', dot: 'bg-neutral-700', border: '#555' },
  ams:      { row: 'border-l-yellow-600 bg-yellow-950/10', badge: 'bg-yellow-950/20 border-yellow-700 text-yellow-400', dot: 'bg-yellow-600',   border: '#c8a840' },
  friendly: { row: 'border-l-blue-800 bg-blue-950/10',    badge: 'bg-blue-950/30 border-blue-800 text-blue-300',        dot: 'bg-blue-800',    border: '#1d3a5c' },
}

export const OUTCOME_COLORS: Record<MatchOutcome, string> = {
  win:  'text-green-400 border-green-700 bg-green-950/30',
  loss: 'text-red-400 border-red-800 bg-red-950/20',
  draw: 'text-yellow-400 border-yellow-700 bg-yellow-950/20',
}

// ── MEMBER TYPES ──────────────────────────────────────────────

export type MemberRole = 'member' | 'officer'
export type PostCategory = 'announcement' | 'tactics' | 'news' | 'other'
export type FileCategory = 'general' | 'tactics' | 'rules' | 'media'

export interface Member {
  id: string
  username: string
  role: MemberRole
  notes?: string
  active: boolean
  created_at: string
  last_login?: string
  updated_at: string
}

export interface MemberPost {
  id: string
  title: string
  body: string
  category: PostCategory
  pinned: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface MemberFile {
  id: string
  name: string
  description?: string
  file_path: string
  file_url: string
  file_type: string
  file_size?: number
  category: FileCategory
  created_at: string
  updated_at: string
}

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  announcement: 'Announcement',
  tactics:      'Tactics',
  news:         'News',
  other:        'General',
}

export const FILE_CATEGORY_LABELS: Record<FileCategory, string> = {
  general:  'General',
  tactics:  'Tactics',
  rules:    'Rules & Standards',
  media:    'Media',
}
