# Truekeep

Truekeep is a local-first relationship thoughtfulness app built with Expo + React Native + TypeScript.

## Project structure

- `app/` Expo Router routes for Home, People, Reminders, Settings, onboarding, search, purchase, person detail, and settings tools
- `features/app/` application state provider and core actions
- `db/` SQLite setup and repositories
- `services/` nudge engine, nudge generation, widget adapter, export service
- `types/` typed domain models
- `theme/` palette + typography
- `widgets/` widget contract
- `docs/` architecture and widget implementation strategy
- `tests/` logic tests for nudge ranking, generation, and widget shaping

## Delivery status

Implemented now:
- local-first persistence and repositories for people, notes, follow-ups, dates, nudges, and settings
- deterministic nudge generation from follow-ups, important dates, and stale connection logic
- real in-app data flow (add person, add follow-up/date/note, search notes, reminders and home fed by SQLite-backed nudges)
- free tier gate (3 people) with local unlock state
- privacy lock screen and export hooks
- native prebuild output (`ios/`, `android/`) for widget/purchase native integrations

Still native-platform tasks (documented):
- iOS WidgetKit target + Android AppWidget provider implementation against `services/widgetAdapter.ts`
- production store-kit / play billing purchase transaction plumbing


## Binary-free PR compatibility

To avoid PR systems that reject binary diffs, generated native binary assets are intentionally not committed (keystore, launcher PNG/WebP files, Gradle wrapper JAR, and iOS app icon PNG).

Recreate them locally when needed:

```bash
npm install
npx expo prebuild --clean
```

## Native integrations

`expo prebuild` has been run, generating `ios/` and `android/` projects for native widget and purchase integration work.
