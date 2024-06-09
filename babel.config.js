module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '~': ['./src'],
        },
      },
    ],
    /**
     * Cái này phải để cuối cùng
     * Reference: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started
     */
    'react-native-reanimated/plugin',
  ],
};
