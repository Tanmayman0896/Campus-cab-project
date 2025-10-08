const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuration to handle Node.js v24+ compatibility issues
config.resolver.platforms = ['ios', 'android', 'web'];
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// Disable problematic externals
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native': 'react-native-web',
};

// Add transformer configuration
config.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true,
  },
  output: {
    ascii_only: true,
    quote_style: 3,
    wrap_iife: true,
  },
  sourceMap: {
    includeSources: false,
  },
  toplevel: false,
  compress: {
    reduce_funcs: false,
  },
};

module.exports = config;
