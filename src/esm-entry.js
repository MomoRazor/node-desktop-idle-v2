import { createRequire } from "module";
const require = createRequire(import.meta.url);
const desktopIdle = require("./cjs-entry.cjs");
export { desktopIdle };
