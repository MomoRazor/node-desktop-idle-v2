const path = require("path");
const bindings = require("node-gyp-build")(path.resolve(__dirname, ".."));
module.exports = {
  desktopIdle: bindings,
};

// const nodeGypBuild = require("node-gyp-build");
// const resolvedPath = nodeGypBuild.path || __dirname; // node-gyp-build exposes .path in some versions
// console.log("node-gyp-build resolved path:", resolvedPath());

// console.log("Bindings loaded from:", nodeGypBuild());
// const bindings = nodeGypBuild(__dirname);
// module.exports = bindings;
