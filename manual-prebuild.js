#!/usr/bin/env node
// Cross-platform manual prebuild packaging script for node-gyp-build
// Usage: node manual-prebuild.js

const { execSync } = require("child_process");
const {
  mkdirSync,
  existsSync,
  copyFileSync,
  rmSync,
  renameSync,
} = require("fs");
const { join } = require("path");

const NODE_VERSIONS = ["20.0.0", "21.0.0", "22.0.0", "24.0.0"];
const ELECTRON_VERSIONS = ["35.0.0", "36.0.0", "37.0.0"];

function toPlatform() {
  const platform = process.platform;
  if (platform === "win32") return "win32";
  if (platform === "darwin") return "darwin";
  if (platform === "linux") return "linux";
  return "unknown";
}

function toArch() {
  const arch = process.arch;
  if (arch === "x64") return "x64";
  // Add more arch mappings if needed
  return arch;
}

function run(cmd, opts = {}) {
  try {
    execSync(cmd, { stdio: "inherit", ...opts });
  } catch (e) {
    console.error(`Error running: ${cmd}`);
    process.exit(1);
  }
}

function getAbi(targetType, version) {
  try {
    return execSync(`node ./get-abi.mjs ${targetType} ${version}`, {
      encoding: "utf8",
    }).trim();
  } catch {
    return "";
  }
}

function build(target, version, abiVersion, isElectron) {
  const nodeFile = "desktopIdle.node";
  const platform = toPlatform();
  const arch = toArch();
  const prebuildsDir = join("prebuilds", `${platform}-${arch}`);
  const tarball = `${target}.napi.node-${abiVersion}.tar.gz`;
  const buildArgs = ["node-gyp", "rebuild", `--target=${version}`];
  if (isElectron) {
    buildArgs.push("--dist-url=https://electronjs.org/headers");
  }
  run(buildArgs.join(" "));
  mkdirSync(prebuildsDir, { recursive: true });
  const builtFile = join("build", "Release", nodeFile);
  if (!existsSync(builtFile)) {
    console.error(
      `Native binary not found: ${builtFile} for ${target} ${version}`
    );
    return;
  }
  copyFileSync(builtFile, join(prebuildsDir, nodeFile));
  const cwd = process.cwd();
  process.chdir(prebuildsDir);
  run(`tar -czvf ${tarball} ${nodeFile}`);
  run(`tar -xzvf ${tarball} ${nodeFile} --overwrite`);
  const abiNodeFile = `${target}.napi.node-${abiVersion}.node`;
  renameSync(nodeFile, abiNodeFile);
  rmSync(tarball);
  console.log(
    `Created ${prebuildsDir}/${abiNodeFile} for ${target} ${version}`
  );
  process.chdir(cwd);
}

for (const nodeVersion of NODE_VERSIONS) {
  console.log(`\n=== Building for Node.js ${nodeVersion} ===`);
  const abiVersion = getAbi("node", nodeVersion);
  if (!abiVersion) {
    console.log(
      `Could not detect ABI version for Node.js ${nodeVersion}. Skipping.`
    );
    continue;
  }
  console.log(`ABI version: ${abiVersion}`);
  build("node", nodeVersion, abiVersion, false);
}

for (const electronVersion of ELECTRON_VERSIONS) {
  console.log(`\n=== Building for Electron ${electronVersion} ===`);
  const abiVersion = getAbi("electron", electronVersion);
  if (!abiVersion) {
    console.log(
      `Could not detect ABI version for Electron ${electronVersion}. Skipping.`
    );
    continue;
  }
  console.log(`ABI version: ${abiVersion}`);
  build("electron", electronVersion, abiVersion, true);
}
