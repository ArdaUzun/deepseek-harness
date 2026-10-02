/** Electron Node-mode startup, with private shell launchers scoped to package installation. */

import { delimiter, join } from 'node:path'

/**
 * Locate the Node executable the bundled primary runtime ships.
 * @param primaryRuntime - Primary runtime payload directory.
 * @param platform - Platform the payload was prepared for.
 * @returns Absolute Node executable path inside the payload.
 */
export function primaryRuntimeNode(primaryRuntime: string, platform: NodeJS.Platform = process.platform): string {
  return join(primaryRuntime, 'dependencies', 'node', 'bin', platform === 'win32' ? 'node.exe' : 'node')
}

/**
 * Select the executable for Desktop's Node-mode children. Linux Electron links the system glib, whose symbols
 * collide with the glib bundled in Sharp's libvips and crash image decoding (electron/electron#46323), so Linux
 * runs the Host and package scripts on the primary runtime's Node instead.
 * @param electron - Electron executable running the application.
 * @param primaryRuntime - Primary runtime payload directory.
 * @param platform - Platform the application runs on.
 * @returns Executable that runs Node-mode children.
 */
export function desktopNodeExecutable(electron: string, primaryRuntime: string, platform: NodeJS.Platform = process.platform): string {
  return platform === 'linux' ? primaryRuntimeNode(primaryRuntime, platform) : electron
}

/**
 * Select Electron's Node mode and the shell launcher used by package scripts.
 * @param executable - Executable from {@link desktopNodeExecutable}.
 * @param bin - Directory containing the node shell launcher.
 * @param environment - Caller environment preserved for plugin execution.
 * @returns Environment for a Node-mode child process.
 */
export function desktopNodeEnvironment(executable: string, bin: string | undefined, environment: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return {
    ...environment,
    ELECTRON_RUN_AS_NODE: '1',
    ...(bin === undefined ? {} : { DSH_DESKTOP_NODE_EXECUTABLE: executable, PATH: `${bin}${delimiter}${environment.PATH ?? ''}` }),
  }
}
