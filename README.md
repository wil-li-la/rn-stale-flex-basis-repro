# rn-stale-flex-basis-repro

![Build](https://github.com/wil-li-la/rn-stale-flex-basis-repro/workflows/Pre%20Merge%20Checks/badge.svg)

Fabric keeps a stale Yoga flex basis when a view's style changes from `width` to `flex: 1`. React Native 0.88.1, New Architecture. See `ReproducerApp/App.tsx`.

Each row starts 360 wide with a 300-wide child. **Shrink rows to 200** shrinks both rows in one commit and changes the children's style:

- `width: 300` -> `flex: 1`: the child stays 300 wide and overflows the 200 row (expected 196).
- `width: 300` -> `width: '100%'` (control): 196, as expected.

Cause: `YogaLayoutableShadowNode::updateYogaProps()` applies the new style with `setStyle()` + `setDirty()`, which keeps Yoga's cached `computedFlexBasis` (Yoga's own setters clear it via `markDirtyAndPropagate()`).

# How to use this Reproducer

This project has been created with `npx @react-native-community/cli init` and is a vanilla React Native app.

> [!IMPORTANT]  
> Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/set-up-your-environment) so that you have a working environment locally.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

First, make sure you install dependencies with:

```bash
cd ios && bundle install && bundle exec pod install
```

Then you can run the iOS app with:

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!
