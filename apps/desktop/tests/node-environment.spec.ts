import { delimiter, join } from 'node:path'
import { expect, it } from 'vitest'
import { desktopNodeEnvironment, desktopNodeExecutable, primaryRuntimeNode } from '../src/node-environment.ts'

it('keeps private Desktop launchers out of the Host environment inherited by PTC', () => {
  const environment = { PATH: '/user/bin', HOME: '/user' }
  expect(desktopNodeEnvironment('/desktop/electron', undefined, environment)).toEqual({
    ...environment, ELECTRON_RUN_AS_NODE: '1',
  })
  expect(environment).toEqual({ PATH: '/user/bin', HOME: '/user' })
})

it('provides private launchers only to package installation processes', () => {
  expect(desktopNodeEnvironment('/desktop/electron', '/desktop/bin', { PATH: '/user/bin' })).toEqual({
    ELECTRON_RUN_AS_NODE: '1',
    DSH_DESKTOP_NODE_EXECUTABLE: '/desktop/electron',
    PATH: `/desktop/bin${delimiter}/user/bin`,
  })
})

it('runs Linux Node-mode children on the primary runtime Node and keeps Electron elsewhere', () => {
  expect(desktopNodeExecutable('/app/electron', '/r/primary-runtime', 'linux')).toBe(join('/r/primary-runtime', 'dependencies', 'node', 'bin', 'node'))
  expect(desktopNodeExecutable('/app/electron', '/r/primary-runtime', 'darwin')).toBe('/app/electron')
  expect(desktopNodeExecutable('C:\\app\\electron.exe', 'C:\\r', 'win32')).toBe('C:\\app\\electron.exe')
  expect(primaryRuntimeNode('/r', 'win32')).toBe(join('/r', 'dependencies', 'node', 'bin', 'node.exe'))
})
