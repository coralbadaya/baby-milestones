/* global require, module, __dirname */
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Turn math is mirrored in mobile/lib/bookEngine.ts (see mobileEngineSync.test.js).
// Watch the shared engine folder only if you add a Metro alias later.
config.watchFolders = [path.resolve(projectRoot, '../src/book/engine')];
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];

module.exports = config;
