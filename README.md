Forking https://github.com/bithavoc/node-desktop-idle since current Electron idle timers do not work on Linux due to upstream issues, and package seems to be abandoned.

This fork focuses on making node-desktop-idle work with contemporary softwares, until electron provides a more stable way to get idle time (at least on Linux platforms)

# Changes Made:

- Updated and prebuilt on latest NodeJs LTS (22.15.0 currently)
- Switched package to ESModule
- Converted to Typescript
- Switched to NPM from Yarn
- Updated the following packages:
  - Node-gyp
  - eslint
  - npm-watch
- Switched Packages:
  - vows switched to jest
- Added Packages:
  - nan for better support to C++
  - npm-check for easier updates

# Platform Specific Changes:

- Linux:
  - Switched from an xscreensaver approach to a input based approach to support more enviornments.
- Windows:
  - No significant changes needed
- Mac:
  - Cannot be tested and so re-implemented if required

# Instrutions

# Usage with Electron:

## Versions after v1.1

In v1.1, this project started to use the combination of [prebuildify](https://github.com/prebuild/prebuildify) and [node-gyp-build](https://github.com/prebuild/node-gyp-build). This means that now, binaries should be, for the most part, embedded in the package and ready to use. If issues pertaining to NodeJS ABI version come up, follow the steps below.

## Version before v1.1 (or in case of issues)

Due the native nature of this package, using it in different contexts requires different binaries. This can be done with a whole host of binary building packages, but if you are targeting Electron, I suggest [@electron/rebuild](https://www.npmjs.com/package/@electron/rebuild). For other contexts, more complex processes must be done, which would be out of scope for this readme.

Let me know if you find this package is missing binaries you need, and I will try to see how it can be bundled.

## Platform specific Instructions:

- Linux:
  - Confirm that User has permission to access `inputs` group.
  - This can be done in a variety of ways, but the simplest way is the following:
    `sudo usermod -aG input $USER`
  - Make sure to restart or log out and log in again for changes to permissions to take effect.
  - This will be required for whatever project uses this package as well, so my suggestion is checking for this access in your project and guiding the end user through this process for linux cases. Even though this is a bit outside the scope of this package, if more help is required on this point, don't hesitate to reach out :).
  - You might also be required to run `sudo apt install libudev-dev libinput-dev` when rebuilding this package, as while `libudev` and `libinput` come bundled with Linux distros (usually), the dev bindings of these packages are not.
- Windows:
  - No extra steps needed
- MacOS:
  - No extra steps needed

## Instructions to use package:

Firstly, make sure you following the Platform Specific Instructions, according to your platform, above. Once you are ready, you can import the package in your code base as show:

`import { desktopIdle } from 'node-desktop-idle-v2'`

The package offers 3 functions:

- `startMonitoring()`
  - This enables the system to start tracking idle time. This is required in Linux systems, but can be ignored on Windows systems, since Windows systems have their own idle time trackers that can be used.
    NB; On Linux systems, time will always be tracked from the moment `startMonitoring()` is called, so any usage of `getIdleTime()` before this point will return a 0.
- `getIdleTime()`
  - This is the function that returns the current Idle time in seconds. This value will reset every time the user interacts with their device in any way.
  - It is important to note that if for whatever reason, the code fails to start monitoring actions, the idle time will remain '-1', and this can be handled by your code accordingly (thanks <a href="https://github.com/hovancik" target="_blank">@hovancik</a> for this one).
- `stopMonitoring()`
  - This pauses the system from tracking idle time. Similar to `startMonitoring()`, this only effects Linux systems, and can be safely ignored on Windows systems.

## Instructions to test the package after cloning:

- Follow Platform specific instructions
- If changes are done to native code for any platform, please run `npm run build-native`
- To run a test, run `node ./test-esm.js` after having built (`npm run build`) the project. This will run a 10 second test, giving idle time every second.

# Directly Tested Platforms:

- Linux
  - Ubuntu 24.04.2 LTS
- Windows
  - Windows 11
- macOS (do not have the resources to test this </3)

NB; It supports more OS versions, however these are the version that have been directly tested.
