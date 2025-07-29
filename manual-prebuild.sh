#!/usr/bin/env bash
# Manual prebuild packaging script for node-gyp-build
# Usage: ./manual-prebuild.sh

set -e

# Node.js and Electron versions to build for
NODE_VERSIONS=("20.0.0" "21.0.0" "22.0.0" "24.0.0")
ELECTRON_VERSIONS=("35.0.0" "36.0.0" "37.0.0")

# Detect platform and arch

# Detect platform and arch
to_platform() {
  case "$(uname -s)" in
    Linux*)   echo "linux" ;;
    Darwin*)  echo "darwin" ;;
    CYGWIN*|MINGW*|MSYS*) echo "win32" ;;
    *)        echo "unknown" ;;
  esac
}

PLATFORM=$(to_platform)
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
  ARCH="x64"
fi
echo "Created $PREBUILDS_DIR/$TARBALL"

NODE_FILE="desktopIdle.node"

# Build for Node.js versions
for NODE_VERSION in "${NODE_VERSIONS[@]}"; do
  echo "\n=== Building for Node.js $NODE_VERSION ==="
  ABI_VERSION=$(node ./get-abi.js node "$NODE_VERSION")
  if [ -z "$ABI_VERSION" ]; then
    echo "Could not detect ABI version for Node.js $NODE_VERSION. Skipping."
    continue
  fi
  echo "ABI version: $ABI_VERSION"
  node-gyp rebuild --target="$NODE_VERSION"
  PREBUILDS_DIR="prebuilds/${PLATFORM}-${ARCH}"
  TARBALL="node.napi.node-${ABI_VERSION}.tar.gz"
  mkdir -p "$PREBUILDS_DIR"
  if [ ! -f "build/Release/$NODE_FILE" ]; then
    echo "Native binary not found: build/Release/$NODE_FILE for Node.js $NODE_VERSION"
    continue
  fi
  cp "build/Release/$NODE_FILE" "$PREBUILDS_DIR/"
  cd "$PREBUILDS_DIR"
  tar -czvf "$TARBALL" "$NODE_FILE"
  # Extract the .node file from the tarball (overwrite if exists)
  tar -xzvf "$TARBALL" "$NODE_FILE" --overwrite
  ABI_NODE_FILE="node.napi.node-${ABI_VERSION}.node"
  mv -f "$NODE_FILE" "$ABI_NODE_FILE"
  echo "Created $PREBUILDS_DIR/$TARBALL and extracted $ABI_NODE_FILE for Node.js $NODE_VERSION"
  cd -
done

# Build for Electron versions
for ELECTRON_VERSION in "${ELECTRON_VERSIONS[@]}"; do
  echo "\n=== Building for Electron $ELECTRON_VERSION ==="
  ABI_VERSION=$(node ./get-abi.js electron "$ELECTRON_VERSION")
  if [ -z "$ABI_VERSION" ]; then
    echo "Could not detect ABI version for Electron $ELECTRON_VERSION. Skipping."
    continue
  fi
  echo "ABI version: $ABI_VERSION"
  node-gyp rebuild --target="$ELECTRON_VERSION" --dist-url="https://electronjs.org/headers"
  PREBUILDS_DIR="prebuilds/${PLATFORM}-${ARCH}"
  TARBALL="electron.napi.node-${ABI_VERSION}.tar.gz"
  mkdir -p "$PREBUILDS_DIR"
  if [ ! -f "build/Release/$NODE_FILE" ]; then
    echo "Native binary not found: build/Release/$NODE_FILE for Electron $ELECTRON_VERSION"
    continue
  fi
  cp "build/Release/$NODE_FILE" "$PREBUILDS_DIR/"
  cd "$PREBUILDS_DIR"
  tar -czvf "$TARBALL" "$NODE_FILE"
  # Extract the .node file from the tarball (overwrite if exists)
  tar -xzvf "$TARBALL" "$NODE_FILE" --overwrite
  ABI_NODE_FILE="electron.napi.node-${ABI_VERSION}.node"
  mv -f "$NODE_FILE" "$ABI_NODE_FILE"
  echo "Created $PREBUILDS_DIR/$TARBALL and extracted $ABI_NODE_FILE for Electron $ELECTRON_VERSION"
  cd -
done
