import { createRequire } from "module";
const require = createRequire(import.meta.url);
const desktopIdleModule = require("./cjs-entry.cjs");
const desktopIdle = desktopIdleModule.default || desktopIdleModule;
export { desktopIdle };
