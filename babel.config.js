/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [".js", ".json"],
        alias: {
          "@": "./src",
        },
      },
    ],
    ["react-native-worklets-core/plugin"],
    "inline-dotenv",
    [
      "react-native-reanimated/plugin",
      {
        processNestedWorklets: true,
      },
    ], // needs to be last
  ],
};
