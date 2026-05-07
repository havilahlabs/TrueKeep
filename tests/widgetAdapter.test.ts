import { describe, expect, it } from 'vitest';
import { getWidgetNudge } from '../services/widgetAdapter';
import { Nudge } from '../types/models';

describe('widgetAdapter', () => {
  it('returns empty payload without nudges', () => {
    const result = getWidgetNudge([]);
    expect(result.deepLink).toContain('people');
  });

  it('maps top nudge to deep link', () => {
    const nudge: Nudge = {
      id: 'n1',
      personId: 'p22',
      sourceType: 'follow_up',
      sourceId: 's1',
      title: 'Call dad',
      supportingText: 'check in',
      whyNow: 'due',
      score: 10,
      state: 'pending',
      scheduledFor: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = getWidgetNudge([nudge]);
    expect(result.deepLink).toContain('/p22');
  });
});
