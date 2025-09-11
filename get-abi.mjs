// get-abi.js
// Usage: node get-abi.js <type> <version>
// <type>: "node" or "electron"
// <version>: version string, e.g. "22.0.0" or "38.0.0"

import { getAbi } from "node-abi";
const [, , type, version] = process.argv;

if (!type || !version) {
  console.error("Usage: node get-abi.js <type> <version>");
  process.exit(1);
}

let result;
if (type === "node") {
  result = getAbi(version, "node");
} else if (type === "electron") {
  result = getAbi(version, "electron");
} else {
  console.error('Type must be "node" or "electron"');
  process.exit(1);
}

if (!result) {
  console.error("Could not determine ABI for", type, version);
  process.exit(2);
}

console.log("v" + result);
