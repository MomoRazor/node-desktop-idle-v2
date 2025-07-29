// postinstall.js
try {
  require("node-gyp-build")(__dirname);
} catch (e) {
  // fallback or error handling if needed
  throw e;
}
