import { createRequire } from "module";
import { fileURLToPath } from "url";

const customRequire = createRequire(import.meta.url);
export interface DesktopIdle {
  startMonitoring: () => void;
  getIdleTime: () => number;
  stopMonitoring: () => void;
}

const bindings = customRequire("node-gyp-build")(
  fileURLToPath(new URL("..", import.meta.url))
);

export const desktopIdle: DesktopIdle = bindings as unknown as DesktopIdle;
