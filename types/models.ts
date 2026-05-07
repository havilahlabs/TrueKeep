export type RelationshipType = 'partner' | 'parent' | 'sibling' | 'child' | 'friend' | 'mentor' | 'other';
export type NudgeState = 'pending' | 'snoozed' | 'completed' | 'dismissed';

export type Person = {
  id: string;
  name: string;
  relationshipType: RelationshipType;
  nickname?: string | null;
  birthday?: string | null;
  anniversary?: string | null;
  photoUri?: string | null;
  accentColor?: string | null;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PreferenceItem = {
  id: string;
  personId: string;
  category: string;
  label: string;
  value: string;
  priority: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ImportantDate = {
  id: string;
  personId: string;
  type: string;
  title: string;
  date: string;
  isRecurring: number;
  leadDays: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GiftIdea = {
  id: string;
  personId: string;
  title: string;
  notes?: string | null;
  url?: string | null;
  priceRange?: string | null;
  occasion?: string | null;
  status: 'idea' | 'purchased' | 'archived';
  createdAt: string;
  updatedAt: string;
};

export type FollowUp = {
  id: string;
  personId: string;
  title: string;
  context?: string | null;
  dueAt: string;
  status: 'open' | 'done';
  snoozedUntil?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Note = {
  id: string;
  personId: string;
  body: string;
  tag?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Nudge = {
  id: string;
  personId?: string | null;
  sourceType: 'important_date' | 'follow_up' | 'stale_connection' | 'gift_idea';
  sourceId?: string | null;
  title: string;
  supportingText: string;
  whyNow: string;
  score: number;
  state: NudgeState;
  scheduledFor: string;
  snoozedUntil?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AppSettings = {
  notificationsEnabled: number;
  quietHoursStart: string;
  quietHoursEnd: string;
  theme: 'light';
  passcodeEnabled: number;
  freeTierPeopleLimit: number;
  freeTierItemLimit: number;
  onboardingCompleted: number;
};

export type PurchaseState = {
  id: number;
  unlocked: number;
  purchasedAt?: string | null;
};

export type WidgetConfig = {
  id: number;
  mode: 'simple' | 'context';
  preferredRelationship?: RelationshipType | null;
};
