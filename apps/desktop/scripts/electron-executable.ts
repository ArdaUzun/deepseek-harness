/** Locate the Electron executable inside an extracted Electron distribution. */

/**
 * Return the executable path that one platform's Electron distribution archive extracts.
 * @param platform - Platform the distribution was downloaded for.
 * @returns Path relative to the distribution root.
 */
export function electronExecutable(platform: NodeJS.Platform): string {
  if (platform === 'win32') return 'electron.exe'
  if (platform === 'darwin') return 'Electron.app/Contents/MacOS/Electron'
  return 'electron'
}
