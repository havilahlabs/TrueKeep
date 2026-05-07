#!/usr/bin/env node
/**
 * Generates placeholder icon assets and a debug Android keystore.
 * Run this once after cloning: node scripts/setup-assets.js
 *
 * For production, replace assets/icon.png with a 1024x1024 PNG before
 * running `npx expo prebuild --clean`.
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const assetsDir = path.join(root, 'assets');

// ---------------------------------------------------------------------------
// 1. Placeholder icon (1024x1024 purple square with "T" letter)
// ---------------------------------------------------------------------------
function generatePlaceholderIcon() {
  const iconPath = path.join(assetsDir, 'icon.png');
  const adaptiveFgPath = path.join(assetsDir, 'adaptive-icon.png');
  const splashPath = path.join(assetsDir, 'splash.png');

  if (fs.existsSync(iconPath)) {
    console.log('  icon.png already exists, skipping.');
  } else {
    // Minimal 1x1 purple PNG (valid PNG, replace before submitting)
    // prettier-ignore
    const minimalPng = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG header
      0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x04, 0x00, // 1024x1024
      0x08, 0x02, 0x00, 0x00, 0x00, 0x6d, 0x22, 0x72, // bit depth, color type
      0x5d, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, // IDAT start
      0x54, 0x08, 0xd7, 0x63, 0x60, 0x60, 0x60, 0x00,
      0x00, 0x00, 0x04, 0x00, 0x01, 0x27, 0x07, 0x15,
      0xea, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, // IEND
      0x44, 0xae, 0x42, 0x60, 0x82,
    ]);

    // Try ImageMagick if available (produces a better placeholder)
    const convert = spawnSync('convert', [
      '-size', '1024x1024',
      'xc:#7B5EA7',
      '-fill', 'white',
      '-font', 'Helvetica',
      '-pointsize', '400',
      '-gravity', 'center',
      '-annotate', '0', 'T',
      iconPath,
    ], { stdio: 'pipe' });

    if (convert.status === 0) {
      console.log('  Created icon.png via ImageMagick.');
      execSync(`cp "${iconPath}" "${adaptiveFgPath}"`);
      execSync(`convert -size 2048x2048 xc:#7B5EA7 "${splashPath}"`);
    } else {
      // Fallback: write the minimal valid PNG bytes
      fs.writeFileSync(iconPath, minimalPng);
      fs.writeFileSync(adaptiveFgPath, minimalPng);
      fs.writeFileSync(splashPath, minimalPng);
      console.log('  Created placeholder icon.png (1px). Install ImageMagick for a better placeholder.');
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Debug Android keystore
// ---------------------------------------------------------------------------
function generateDebugKeystore() {
  const keystoreDest = path.join(root, 'android', 'app', 'debug.keystore');

  if (fs.existsSync(keystoreDest)) {
    console.log('  debug.keystore already exists, skipping.');
    return;
  }

  const keytool = spawnSync('keytool', [
    '-genkey', '-v',
    '-keystore', keystoreDest,
    '-storepass', 'android',
    '-alias', 'androiddebugkey',
    '-keypass', 'android',
    '-keyalg', 'RSA',
    '-keysize', '2048',
    '-validity', '10000',
    '-dname', 'CN=Android Debug,O=Android,C=US',
  ], { stdio: 'pipe' });

  if (keytool.status === 0) {
    console.log('  Created android/app/debug.keystore.');
  } else {
    console.warn('  keytool not found — install a JDK to generate the debug keystore.');
    console.warn('  Alternatively copy ~/.android/debug.keystore to android/app/debug.keystore.');
  }
}

// ---------------------------------------------------------------------------
// 3. Ensure app.json references assets
// ---------------------------------------------------------------------------
function patchAppJson() {
  const appJsonPath = path.join(root, 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

  let dirty = false;
  if (!appJson.expo.icon) { appJson.expo.icon = './assets/icon.png'; dirty = true; }
  if (!appJson.expo.splash) {
    appJson.expo.splash = { image: './assets/splash.png', backgroundColor: '#7B5EA7' };
    dirty = true;
  }
  if (!appJson.expo.android) appJson.expo.android = {};
  if (!appJson.expo.android.adaptiveIcon) {
    appJson.expo.android.adaptiveIcon = {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#7B5EA7',
    };
    dirty = true;
  }

  if (dirty) {
    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
    console.log('  Patched app.json with asset references.');
  } else {
    console.log('  app.json already has asset references.');
  }
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
console.log('\n=== Truekeep asset setup ===\n');
console.log('[1] Icon assets');
generatePlaceholderIcon();
console.log('[2] Android debug keystore');
generateDebugKeystore();
console.log('[3] app.json');
patchAppJson();
console.log('\nDone. Replace assets/icon.png with a real 1024x1024 PNG before submitting to the stores.\n');
