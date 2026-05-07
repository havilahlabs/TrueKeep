import { Nudge } from '../../types/models';

const now = Date.now();

export const sampleNudges: Nudge[] = [
  {
    id: 'n1',
    personId: 'p1',
    sourceType: 'follow_up',
    sourceId: 'f1',
    title: 'Check in with Maya about interview prep',
    supportingText: 'You said you would text before Friday.',
    whyNow: 'Due today',
    score: 80,
    state: 'pending',
    scheduledFor: new Date(now).toISOString(),
    createdAt: new Date(now - 200000).toISOString(),
    updatedAt: new Date(now - 100000).toISOString()
  },
  {
    id: 'n2',
    personId: 'p2',
    sourceType: 'important_date',
    sourceId: 'd1',
    title: 'Dad\'s birthday is next week',
    supportingText: 'Gift idea saved: leather-bound notebook.',
    whyNow: '7 days out',
    score: 65,
    state: 'pending',
    scheduledFor: new Date(now + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
