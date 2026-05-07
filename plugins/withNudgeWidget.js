/**
 * Expo config plugin — adds the NudgeWidget WidgetKit extension.
 *
 * Applied during `npx expo prebuild --clean`. After prebuild:
 *   1. Open ios/Nudge.xcworkspace in Xcode.
 *   2. For BOTH the "Nudge" and "NudgeWidget" targets:
 *      Signing & Capabilities → + Capability → App Groups → group.com.truekeep.app
 *   3. Build & run.
 */

const {
  withXcodeProject,
  withEntitlementsPlist,
  withDangerousMod,
} = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const APP_GROUP = 'group.com.truekeep.app';
const WIDGET_NAME = 'NudgeWidget';
const SWIFT_VERSION = '5.0';
const DEPLOYMENT_TARGET = '16.0';

// Deterministic 24-char hex UUID from a seed (same input → same UUID across prebuilds)
function uid(seed) {
  return crypto.createHash('sha1').update(seed).digest('hex').substring(0, 24).toUpperCase();
}

// ---------------------------------------------------------------------------
// 1. Add App Group entitlement to the main app
// ---------------------------------------------------------------------------
function withAppGroupEntitlement(config) {
  return withEntitlementsPlist(config, (c) => {
    const key = 'com.apple.security.application-groups';
    const existing = c.modResults[key] ?? [];
    if (!existing.includes(APP_GROUP)) {
      c.modResults[key] = [...existing, APP_GROUP];
    }
    return c;
  });
}

// ---------------------------------------------------------------------------
// 2. Copy Swift sources and support files into ios/NudgeWidget/
// ---------------------------------------------------------------------------
function withWidgetSources(config) {
  return withDangerousMod(config, [
    'ios',
    async (c) => {
      const srcDir = path.join(__dirname, 'widget-source/ios');
      const destDir = path.join(c.modRequest.platformProjectRoot, WIDGET_NAME);

      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

      for (const file of fs.readdirSync(srcDir)) {
        fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
      }
      return c;
    },
  ]);
}

// ---------------------------------------------------------------------------
// 3. Add the widget extension target to the Xcode project
// ---------------------------------------------------------------------------
function withWidgetTarget(config) {
  return withXcodeProject(config, (c) => {
    const proj = c.modResults;
    const bundleId = c.ios?.bundleIdentifier ?? 'com.truekeep.app';
    const widgetBundleId = `${bundleId}.${WIDGET_NAME}`;

    // Idempotency guard — check existing native targets
    const nativeTargets = proj.pbxNativeTargetSection();
    const alreadyAdded = Object.values(nativeTargets).some(
      (t) => t && t.name === `"${WIDGET_NAME}"`,
    );
    if (alreadyAdded) return c;

    // ------------------------------------------------------------------
    // UUIDs (stable across runs)
    // ------------------------------------------------------------------
    const T = {
      // File references
      swiftFile1: uid(`${WIDGET_NAME}-NudgeWidget.swift`),
      swiftFile2: uid(`${WIDGET_NAME}-NudgeWidgetBundle.swift`),
      infoPlist: uid(`${WIDGET_NAME}-Info.plist`),
      entitlements: uid(`${WIDGET_NAME}.entitlements`),
      productRef: uid(`${WIDGET_NAME}-product`),
      // Build files
      bfSwift1: uid(`${WIDGET_NAME}-bf-NudgeWidget.swift`),
      bfSwift2: uid(`${WIDGET_NAME}-bf-NudgeWidgetBundle.swift`),
      // Build phases
      sources: uid(`${WIDGET_NAME}-sources-phase`),
      resources: uid(`${WIDGET_NAME}-resources-phase`),
      // Configs
      debugCfg: uid(`${WIDGET_NAME}-debug-cfg`),
      releaseCfg: uid(`${WIDGET_NAME}-release-cfg`),
      cfgList: uid(`${WIDGET_NAME}-cfg-list`),
      // Target
      target: uid(`${WIDGET_NAME}-target`),
      // Embed
      embedPhase: uid(`${WIDGET_NAME}-embed-phase`),
      embedBuildFile: uid(`${WIDGET_NAME}-embed-bf`),
      // Group
      group: uid(`${WIDGET_NAME}-group`),
    };

    // ------------------------------------------------------------------
    // File references
    // ------------------------------------------------------------------
    const fileRefs = proj.pbxFileReferenceSection();

    fileRefs[T.swiftFile1] = {
      isa: 'PBXFileReference',
      lastKnownFileType: 'sourcecode.swift',
      name: '"NudgeWidget.swift"',
      path: `"${WIDGET_NAME}/NudgeWidget.swift"`,
      sourceTree: '"<group>"',
    };
    fileRefs[`${T.swiftFile1}_comment`] = 'NudgeWidget.swift';

    fileRefs[T.swiftFile2] = {
      isa: 'PBXFileReference',
      lastKnownFileType: 'sourcecode.swift',
      name: '"NudgeWidgetBundle.swift"',
      path: `"${WIDGET_NAME}/NudgeWidgetBundle.swift"`,
      sourceTree: '"<group>"',
    };
    fileRefs[`${T.swiftFile2}_comment`] = 'NudgeWidgetBundle.swift';

    fileRefs[T.infoPlist] = {
      isa: 'PBXFileReference',
      lastKnownFileType: 'text.plist.xml',
      name: '"NudgeWidget-Info.plist"',
      path: `"${WIDGET_NAME}/NudgeWidget-Info.plist"`,
      sourceTree: '"<group>"',
    };
    fileRefs[`${T.infoPlist}_comment`] = 'NudgeWidget-Info.plist';

    fileRefs[T.entitlements] = {
      isa: 'PBXFileReference',
      lastKnownFileType: 'text.plist.entitlements',
      name: '"NudgeWidget.entitlements"',
      path: `"${WIDGET_NAME}/NudgeWidget.entitlements"`,
      sourceTree: '"<group>"',
    };
    fileRefs[`${T.entitlements}_comment`] = 'NudgeWidget.entitlements';

    fileRefs[T.productRef] = {
      isa: 'PBXFileReference',
      explicitFileType: '"wrapper.app-extension"',
      includeInIndex: 0,
      path: `"${WIDGET_NAME}.appex"`,
      sourceTree: 'BUILT_PRODUCTS_DIR',
    };
    fileRefs[`${T.productRef}_comment`] = `${WIDGET_NAME}.appex`;

    // ------------------------------------------------------------------
    // Build files
    // ------------------------------------------------------------------
    const buildFiles = proj.pbxBuildFileSection();

    buildFiles[T.bfSwift1] = {
      isa: 'PBXBuildFile',
      fileRef: T.swiftFile1,
      settings: {},
    };
    buildFiles[`${T.bfSwift1}_comment`] = 'NudgeWidget.swift in Sources';

    buildFiles[T.bfSwift2] = {
      isa: 'PBXBuildFile',
      fileRef: T.swiftFile2,
      settings: {},
    };
    buildFiles[`${T.bfSwift2}_comment`] = 'NudgeWidgetBundle.swift in Sources';

    buildFiles[T.embedBuildFile] = {
      isa: 'PBXBuildFile',
      fileRef: T.productRef,
      settings: { ATTRIBUTES: ['RemoveHeadersOnCopy'] },
    };
    buildFiles[`${T.embedBuildFile}_comment`] = `${WIDGET_NAME}.appex in Embed Foundation Extensions`;

    // ------------------------------------------------------------------
    // PBXGroup for NudgeWidget
    // ------------------------------------------------------------------
    const groups = proj.pbxGroupSection();
    groups[T.group] = {
      isa: 'PBXGroup',
      children: [
        { value: T.swiftFile1, comment: 'NudgeWidget.swift' },
        { value: T.swiftFile2, comment: 'NudgeWidgetBundle.swift' },
        { value: T.infoPlist, comment: 'NudgeWidget-Info.plist' },
        { value: T.entitlements, comment: 'NudgeWidget.entitlements' },
      ],
      name: `"${WIDGET_NAME}"`,
      sourceTree: '"<group>"',
    };
    groups[`${T.group}_comment`] = WIDGET_NAME;

    // Add the widget group to the root project group
    const rootGroupUUID = proj.pbxProjectSection()[proj.getFirstProject().uuid].mainGroup;
    const rootGroup = groups[rootGroupUUID];
    if (rootGroup && !rootGroup.children.find((ch) => ch.value === T.group)) {
      rootGroup.children.push({ value: T.group, comment: WIDGET_NAME });
    }

    // ------------------------------------------------------------------
    // Build phases — added directly to the project object sections below
    // ------------------------------------------------------------------

    // Sources
    proj.hash.project.objects['PBXSourcesBuildPhase'] =
      proj.hash.project.objects['PBXSourcesBuildPhase'] ?? {};
    proj.hash.project.objects['PBXSourcesBuildPhase'][T.sources] = {
      isa: 'PBXSourcesBuildPhase',
      buildActionMask: 2147483647,
      files: [
        { value: T.bfSwift1, comment: 'NudgeWidget.swift in Sources' },
        { value: T.bfSwift2, comment: 'NudgeWidgetBundle.swift in Sources' },
      ],
      runOnlyForDeploymentPostprocessing: 0,
    };
    proj.hash.project.objects['PBXSourcesBuildPhase'][`${T.sources}_comment`] = 'Sources';

    // Resources (empty)
    proj.hash.project.objects['PBXResourcesBuildPhase'] =
      proj.hash.project.objects['PBXResourcesBuildPhase'] ?? {};
    proj.hash.project.objects['PBXResourcesBuildPhase'][T.resources] = {
      isa: 'PBXResourcesBuildPhase',
      buildActionMask: 2147483647,
      files: [],
      runOnlyForDeploymentPostprocessing: 0,
    };
    proj.hash.project.objects['PBXResourcesBuildPhase'][`${T.resources}_comment`] = 'Resources';

    // ------------------------------------------------------------------
    // Build configurations
    // ------------------------------------------------------------------
    const cfgSection = proj.pbxXCBuildConfigurationSection();

    const sharedSettings = {
      ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES: 'NO',
      APPLICATION_EXTENSION_API_ONLY: 'YES',
      CODE_SIGN_ENTITLEMENTS: `"${WIDGET_NAME}/${WIDGET_NAME}.entitlements"`,
      CODE_SIGN_STYLE: 'Automatic',
      INFOPLIST_FILE: `"${WIDGET_NAME}/${WIDGET_NAME}-Info.plist"`,
      LD_RUNPATH_SEARCH_PATHS: '"$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks"',
      MARKETING_VERSION: '1.0',
      CURRENT_PROJECT_VERSION: 1,
      PRODUCT_BUNDLE_IDENTIFIER: `"${widgetBundleId}"`,
      PRODUCT_NAME: '"$(TARGET_NAME)"',
      SKIP_INSTALL: 'YES',
      SWIFT_EMIT_LOC_STRINGS: 'YES',
      SWIFT_VERSION: SWIFT_VERSION,
      TARGETED_DEVICE_FAMILY: '"1,2"',
      IPHONEOS_DEPLOYMENT_TARGET: DEPLOYMENT_TARGET,
    };

    cfgSection[T.debugCfg] = {
      isa: 'XCBuildConfiguration',
      buildSettings: { ...sharedSettings, DEBUG_INFORMATION_FORMAT: 'dwarf' },
      name: 'Debug',
    };
    cfgSection[`${T.debugCfg}_comment`] = 'Debug';

    cfgSection[T.releaseCfg] = {
      isa: 'XCBuildConfiguration',
      buildSettings: {
        ...sharedSettings,
        DEBUG_INFORMATION_FORMAT: '"dwarf-with-dsym"',
        COPY_PHASE_STRIP: 'NO',
      },
      name: 'Release',
    };
    cfgSection[`${T.releaseCfg}_comment`] = 'Release';

    // Config list
    const cfgLists = proj.pbxXCConfigurationListSection();
    cfgLists[T.cfgList] = {
      isa: 'XCConfigurationList',
      buildConfigurations: [
        { value: T.debugCfg, comment: 'Debug' },
        { value: T.releaseCfg, comment: 'Release' },
      ],
      defaultConfigurationIsVisible: 0,
      defaultConfigurationName: 'Release',
    };
    cfgLists[`${T.cfgList}_comment`] = `Build configuration list for PBXNativeTarget "${WIDGET_NAME}"`;

    // ------------------------------------------------------------------
    // Native target
    // ------------------------------------------------------------------
    nativeTargets[T.target] = {
      isa: 'PBXNativeTarget',
      buildConfigurationList: T.cfgList,
      buildPhases: [
        { value: T.sources, comment: 'Sources' },
        { value: T.resources, comment: 'Resources' },
      ],
      buildRules: [],
      dependencies: [],
      name: `"${WIDGET_NAME}"`,
      productName: `"${WIDGET_NAME}"`,
      productReference: T.productRef,
      productType: '"com.apple.product-type.app-extension"',
    };
    nativeTargets[`${T.target}_comment`] = WIDGET_NAME;

    // Add target to PBXProject
    const projectEntry = proj.pbxProjectSection()[proj.getFirstProject().uuid];
    if (projectEntry.targets && !projectEntry.targets.find((t) => t.value === T.target)) {
      projectEntry.targets.push({ value: T.target, comment: WIDGET_NAME });
    }

    // ------------------------------------------------------------------
    // Embed extensions build phase on the main app target
    // ------------------------------------------------------------------
    const mainTargetUUID = proj.getFirstTarget().uuid;
    proj.hash.project.objects['PBXCopyFilesBuildPhase'] =
      proj.hash.project.objects['PBXCopyFilesBuildPhase'] ?? {};
    proj.hash.project.objects['PBXCopyFilesBuildPhase'][T.embedPhase] = {
      isa: 'PBXCopyFilesBuildPhase',
      buildActionMask: 2147483647,
      dstPath: '""',
      dstSubfolderSpec: 13, // PlugIns / Extensions
      files: [{ value: T.embedBuildFile, comment: `${WIDGET_NAME}.appex in Embed Foundation Extensions` }],
      name: '"Embed Foundation Extensions"',
      runOnlyForDeploymentPostprocessing: 0,
    };
    proj.hash.project.objects['PBXCopyFilesBuildPhase'][`${T.embedPhase}_comment`] =
      'Embed Foundation Extensions';

    // Attach embed phase to main target
    const mainTarget = nativeTargets[mainTargetUUID];
    if (mainTarget && !mainTarget.buildPhases.find((p) => p.value === T.embedPhase)) {
      mainTarget.buildPhases.push({
        value: T.embedPhase,
        comment: 'Embed Foundation Extensions',
      });
    }

    // ------------------------------------------------------------------
    // Products group — add widget .appex
    // ------------------------------------------------------------------
    const productsGroup = Object.values(groups).find(
      (g) => g && g.name === '"Products"',
    );
    if (productsGroup && !productsGroup.children.find((ch) => ch.value === T.productRef)) {
      productsGroup.children.push({ value: T.productRef, comment: `${WIDGET_NAME}.appex` });
    }

    return c;
  });
}

// ---------------------------------------------------------------------------
// Compose and export
// ---------------------------------------------------------------------------
module.exports = (config) => {
  config = withAppGroupEntitlement(config);
  config = withWidgetSources(config);
  config = withWidgetTarget(config);
  return config;
};
