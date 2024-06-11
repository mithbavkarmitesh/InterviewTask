module.exports = {
  project: {
    ios: { unstable_reactLegacyComponentNames: ["Video"] },
    android: {
      unstable_reactLegacyComponentNames: ["Video"],
    },
  },
  dependencies: {
    // "react-native-video": {
    //   platforms: {
    //     android: {
    //       sourceDir: "../node_modules/react-native-video/android-exoplayer",
    //     },
    //   },
    // },
  },
  assets: ["./assets/fonts"],
};
