# Widget Strategy

Truekeep widgets are centered around a single actionable prompt, powered by `services/widgetAdapter.ts`.

## iOS
- Implement WidgetKit extension via `expo prebuild` and a native target.
- Widget reads a serialized payload from App Group storage updated by the app on nudge changes.
- Deep links route to `truekeep://person/:id` or `truekeep://reminders`.

## Android
- Implement AppWidgetProvider with Glance/RemoteViews in a prebuild plugin.
- Widget data is stored in SharedPreferences mirrored from SQLite snapshots.
- PendingIntent deep links resolve into Expo Router routes.

## Refresh rules
- Update widget payload after any nudge completion/snooze/regeneration event.
- Trigger explicit platform refresh (`WidgetCenter.reloadAllTimelines` / `AppWidgetManager.notifyAppWidgetViewDataChanged`).

## Empty state
- Copy: "One thoughtful thing at a time."
- CTA deep link to Add Person screen.
