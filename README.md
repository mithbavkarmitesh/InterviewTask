# Treefe Frontend_React_App

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Installation

This project is created with `npm`, check the installation instructions at [NPM Installation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

1. Install dependencies in package.json with npm

```bash
cd treefe
npm install --legacy-peer-deps
```

2. Pods will be auto-installed, but, if somehow, pod install fails, you need to run the following command in the root directory.

`npx pod-install` or going inside ios directory by

```bash
cd ios
pod install
```

3. Open project in Xcode going by `xed -b ios` in your root folder.
4. You can also directly run iOS app by using `npx react-native run-ios`
5. To run in android use command `npx react-native run-android`

## Release Builds

Follow instructions below for respective platforms to create release builds.

### 1. **iOS Release**

1.1 Go into the root directory and run `npm install` or `yarn` in terminal.  
1.2 Pods will be automatically installed. You must stop the execution of pods install by pressing `^(cntrl) + c`. We will manually install the pods.  
1.3 Run `npx react-native setup-ios-permissions` in terminal.  
1.4 Now run the below command from the root folder of the react native project  
`NO_FLIPPER=1 bundle exec pod install --project-directory=ios`  
1.5 Open xcode going by `xed -b ios` in your root folder  
1.6 Select destination as _Any iOS Device (arm64)_ and from the menu bar select _Archive_

## Prerequisites

This project is built using the following

1. [Node](https://nodejs.org/en) v20.5.1 & NPM v9.8.0
2. [Android Studio](https://developer.android.com/studio/archive) Electric Eel | 2022.1.1 Patch 2
3. Xcode Version 14.3.1 (14E300c)
4. [Cocoapods](https://guides.cocoapods.org/using/getting-started.html) v1.12.1
5. Java version 11

```
openjdk version "11.0.19" 2023-04-18 LTS
OpenJDK Runtime Environment Zulu11.64+19-CA (build 11.0.19+7-LTS)
OpenJDK 64-Bit Server VM Zulu11.64+19-CA (build 11.0.19+7-LTS, mixed mode)
```

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
