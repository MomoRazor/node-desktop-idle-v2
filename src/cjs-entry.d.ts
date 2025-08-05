export interface DesktopIdle {
  startMonitoring: () => void;
  getIdleTime: () => number;
  stopMonitoring: () => void;
}

declare const desktopIdle: DesktopIdle;
export { desktopIdle };
