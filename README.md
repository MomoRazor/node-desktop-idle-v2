Forking https://github.com/bithavoc/node-desktop-idle since current Electron idle timers do not work on Linux due to upstream issues, and package seems to be abandoned.

This fork focuses on making node-desktop-idle work with contemporary softwares, until electron provides a more stable way to get idle time (at least on Linux platforms)

# Changes Made:

- Updated and prebuilt on latest NodeJs LTS (24.11.0 currently)
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

## Platform Specific Changes:

- Linux:
  - Switched from an xscreensaver approach to a input based approach to support more enviornments.
- Windows:
  - No significant changes needed
- Mac:
  - No significant changes needed

## Directly Tested Platforms:

- Linux
  - Ubuntu 24.04.2 LTS
- Windows
  - Windows 11
- macOS
  - Not directly tested so far

NB; It supports more OS versions, however these are the version that have been directly tested.

# Instructions

## Usage in Projects

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

## Usage in Test Frameworks

Test Frameworks (like Jest, Mocha, ecc ecc) sometimes may affect the way that dynamic imports are done. Since packages with native components, like this one, require dynamic imports to be able to import the correct binary according to the environment they are running it, this might lead to failures in tests, that do not occure in normal usage. I'll endevour to provide support for Test Frameworks that run into trouble here.

### Jest

Jest has a very simple way of solving the dynamic import issue, and it is by defining the import explicitly in the `jest.config.js`. This is done using the `moduleNameMapper` field as shown below:

` moduleNameMapper: {
    desktopIdle:
      '<rootDir>/node_modules/node-desktop-idle-v2/prebuilds/linux-x64/node.napi.node-v127.node'
  }`

Of course, it is important to replace `linux-x64` with the OS where the unit test is running, and the actually `.node` file that supports the NodeJs running in the unit test environment.

## Note on Binaries

### Versions after v1.1

In v1.1, this project has been released with bundled in binaries for the supported platforms, for various NodeJs versions. This means that now, binaries should be, for the most part, embedded in the package and ready to use. If issues pertaining to NodeJS ABI version come up, follow the steps below.

### Version before v1.1 (or in case of issues)

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

# Contribution

This package is still a work in progress, and will definitely continue to need more work done as more issues are found. Feel free to fork the package, and contribute, either by writing code, or testing the features there in and lodging issues if things do not work as expected.

## Instructions to test the package after cloning:

- Follow Platform specific instructions
- Run the normal `npm i` command to install packages.
- If changes are done to native code for any platform, please run `npm run build-native` and `npm run build` in that order. The order is important as the `build` command requires that the native binaries are already in place to make the necessary connections. Running `full-build` will do all of this in the right order.
- To run a test, run `npm run test` after having built (`npm run build`) the project. This will run a 10 second test, giving idle time every second.
