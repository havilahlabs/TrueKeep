# Truekeep Deployment Guide

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | JavaScript runtime |
| Xcode | 16+ | iOS builds |
| Android Studio | Hedgehog+ | Android builds |
| JDK | 17+ | Android toolchain |
| CocoaPods | 1.15+ | iOS dependency manager |

---

## First-time environment setup

```bash
npm install
node scripts/setup-assets.js      # generates icon placeholders + debug keystore

# Register the project with EAS (once, requires `eas login` first).
# This replaces the placeholder projectId in app.json with your real one.
eas login
eas init --id <your-project-id>   # or just `eas init` to create a new project

npx expo prebuild --clean          # regenerates ios/ and android/ from app.json
```

> **`extra.eas.projectId`** in `app.json` is currently a placeholder (`00000000-…`).
> Running `eas init` while logged in will replace it with the real UUID for your
> Expo account. Commit the updated `app.json` afterwards.

Replace `assets/icon.png` with a real **1024×1024 PNG** before submitting.

---

## Running locally

```bash
npm run ios       # build and launch on iOS Simulator
npm run android   # build and launch on Android Emulator
```

---

## iOS — App Store submission

### 1. Certificates and provisioning

1. In Xcode → **Signing & Capabilities**, set Team to your Apple Developer account.
2. Enable **Automatic Signing** for the `Nudge` and `NudgeWidget` targets.
3. Under **Signing & Capabilities → + Capability**, add **App Groups** → `group.com.truekeep.app` to both targets.

### 2. Configure In-App Purchase product

1. In [App Store Connect](https://appstoreconnect.apple.com), create a new app with bundle ID `com.truekeep.app`.
2. Go to **In-App Purchases → +**, choose **Non-Consumable**.
3. Product ID: `com.truekeep.app.unlock`
4. Display Name: `Unlock Truekeep`
5. Price: select a price tier (e.g. Tier 3 ≈ $2.99).
6. Submit for review alongside the first app version.

### 3. Archive and upload

```bash
# In Xcode:
# Product → Archive → Distribute App → App Store Connect → Upload
```

Or use EAS Build (see below).

### 4. TestFlight

After uploading, go to App Store Connect → TestFlight and add internal testers.

---

## Android — Play Store submission

### 1. Release keystore

Generate a production keystore (keep it secret, never commit it):

```bash
keytool -genkey -v \
  -keystore release.keystore \
  -alias truekeep \
  -keyalg RSA -keysize 4096 -validity 10000
```

Set in `android/gradle.properties` (or via environment variables in CI):

```properties
TRUEKEEP_UPLOAD_STORE_FILE=../../release.keystore
TRUEKEEP_UPLOAD_KEY_ALIAS=truekeep
TRUEKEEP_UPLOAD_STORE_PASSWORD=<store-password>
TRUEKEEP_UPLOAD_KEY_PASSWORD=<key-password>
```

Then wire it in `android/app/build.gradle`:

```groovy
android {
  signingConfigs {
    release {
      storeFile file(TRUEKEEP_UPLOAD_STORE_FILE)
      storePassword TRUEKEEP_UPLOAD_STORE_PASSWORD
      keyAlias TRUEKEEP_UPLOAD_KEY_ALIAS
      keyPassword TRUEKEEP_UPLOAD_KEY_PASSWORD
    }
  }
  buildTypes {
    release { signingConfig signingConfigs.release }
  }
}
```

### 2. Configure In-App Billing product

1. In [Google Play Console](https://play.google.com/console), create the app.
2. Go to **Monetize → Products → In-app products → Create product**.
3. Product ID: `com.truekeep.app.unlock`
4. Name: `Unlock Truekeep`
5. Price: set and activate.

### 3. Build and upload

```bash
cd android
./gradlew bundleRelease          # produces .aab in app/build/outputs/bundle/release/
```

Upload `app-release.aab` to Play Console → **Production** (or **Internal testing** first).

---

## EAS Build (recommended for CI)

[Expo Application Services](https://expo.dev/eas) builds native binaries in the cloud.

```bash
npm install -g eas-cli
eas login
eas build:configure          # creates eas.json

# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

EAS handles signing automatically if you provide credentials when prompted.

---

## CI/CD (GitHub Actions)

The `.github/workflows/ci.yml` workflow runs lint, typecheck, and tests on every push and pull request. To add automated EAS builds on release tags, extend the workflow:

```yaml
on:
  push:
    tags: ['v*']

jobs:
  eas-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - uses: expo/expo-github-action@v8
        with: { eas-version: latest, token: ${{ secrets.EXPO_TOKEN }} }
      - run: eas build --platform all --profile production --non-interactive
```

---

## Versioning

Bump version before each release:

- `app.json` → `expo.version` (display version, e.g. `1.1.0`)
- `app.json` → `expo.ios.buildNumber` (integer string, increment each upload)
- `app.json` → `expo.android.versionCode` (integer, increment each upload)

---

## Checklist before first release

- [ ] Real 1024×1024 icon in `assets/icon.png`
- [ ] Splash screen image in `assets/splash.png`
- [ ] Production keystore created and stored securely (not in git)
- [ ] IAP product IDs registered in both stores
- [ ] App Group `group.com.truekeep.app` enabled in Xcode for both targets
- [ ] `npx expo prebuild --clean` run after any `app.json` / plugin changes
- [ ] All tests passing (`npm test`)
- [ ] Privacy policy URL set in App Store Connect / Play Console
- [ ] App Store screenshots prepared (6.9" iPhone required)
