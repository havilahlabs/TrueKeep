/**
 * EAS Build post-install hook — restores gradle-wrapper.jar.
 *
 * expo prebuild regenerates android/ from templates that do not include
 * gradle-wrapper.jar (Expo intentionally excludes binary files from its
 * templates). Without the jar, GradleWrapperMain cannot be loaded and
 * the Android build fails immediately.
 *
 * This script copies the jar from @react-native/gradle-plugin (which ships
 * it as part of its own wrapper setup) to the location gradlew expects.
 */

const fs = require('fs');
const path = require('path');

const src = path.resolve(
  __dirname,
  '..',
  'node_modules',
  '@react-native',
  'gradle-plugin',
  'gradle',
  'wrapper',
  'gradle-wrapper.jar',
);

const dest = path.resolve(
  __dirname,
  '..',
  'android',
  'gradle',
  'wrapper',
  'gradle-wrapper.jar',
);

const destDir = path.dirname(dest);
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (!fs.existsSync(src)) {
  console.error('gradle-wrapper.jar source not found at:', src);
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log('gradle-wrapper.jar restored to android/gradle/wrapper/');
