import { Nudge } from '../types/models';
import { getTodaysTopNudge } from './nudgeEngine';
import { writeWidgetPayload, reloadWidgetTimelines } from '../modules/widget-bridge';

export type WidgetPayload = {
  title: string;
  subtitle: string;
  deepLink: string;
  nudgeId?: string;
};

export function getWidgetNudge(nudges: Nudge[]): WidgetPayload {
  const best = getTodaysTopNudge(nudges);
  const payload: WidgetPayload = best
    ? {
        title: best.title,
        subtitle: best.whyNow,
        deepLink: best.personId ? `truekeep://person/${best.personId}` : 'truekeep://',
        nudgeId: best.id,
      }
    : {
        title: 'One thoughtful thing at a time',
        subtitle: 'Add a person to get your first nudge.',
        deepLink: 'truekeep://people',
      };

  return payload;
}

export function syncWidgetPayload(nudges: Nudge[]): void {
  const payload = getWidgetNudge(nudges);
  writeWidgetPayload(payload);
  reloadWidgetTimelines();
}
